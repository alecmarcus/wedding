"use server";

import {
  sendRsvpConfirmationEmail,
  sendRsvpExistsEmail,
  sendRsvpUpdateEmail,
} from "@@/features/email/functions";
import {
  boolean,
  email,
  maxLength,
  nullable,
  object,
  parse,
  pipe,
  string,
} from "valibot";
import { db, type Rsvp } from "@/db";
import { RSVP_FIELDS } from "./fields";

const rsvpSchema = object({
  name: pipe(string(), maxLength(RSVP_FIELDS.name.max)),
  email: pipe(string(), email(), maxLength(RSVP_FIELDS.email.max)),
  plusOne: boolean(),
  plusOneName: nullable(pipe(string(), maxLength(RSVP_FIELDS.plusOneName.max))),
  dietaryRestrictions: nullable(
    pipe(string(), maxLength(RSVP_FIELDS.dietaryRestrictions.max))
  ),
  message: nullable(pipe(string(), maxLength(RSVP_FIELDS.message.max))),
});

const parseAndValidateFormData = (formData: FormData) => {
  const plusOne = !!formData.get(RSVP_FIELDS.plusOne.name);

  const rawData = {
    name: formData.get(RSVP_FIELDS.name.name) as string,
    email: formData.get(RSVP_FIELDS.email.name) as string,
    plusOne,
    plusOneName: plusOne
      ? (formData.get(RSVP_FIELDS.plusOneName.name) as string)
      : null,
    dietaryRestrictions: formData.get(RSVP_FIELDS.dietaryRestrictions.name) as
      | string
      | null,
    message: formData.get(RSVP_FIELDS.message.name) as string | null,
  };

  return parse(rsvpSchema, rawData);
};

type ParsedFormData = ReturnType<typeof parseAndValidateFormData>;

const createRsvp = async ({
  name,
  email,
  ...data
}: ParsedFormData): Promise<ActionState> => {
  try {
    const existingRsvp = await db.rsvp.findFirst({
      where: {
        email,
      },
    });

    if (existingRsvp) {
      await sendRsvpExistsEmail({
        rsvp: existingRsvp,
      });
      throw new Error("An RSVP with this email already exists");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || "Unknown error";

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
    };
  }

  try {
    const rsvp = await db.rsvp.create({
      data: {
        name,
        email,
        ...data,
      },
    });

    await sendRsvpConfirmationEmail({
      rsvp,
    });

    return {
      data: rsvp,
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || "Unknown error";

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
    };
  }
};

const updateRsvp = async ({
  editToken,
  email,
  ...data
}: {
  editToken: string;
} & ParsedFormData): Promise<ActionState> => {
  try {
    const existingRsvp = await db.rsvp.findUnique({
      where: {
        editToken,
      },
    });

    // Extra cautious check.
    // We don't allow editing name and email on the client currently.
    if (existingRsvp) {
      if (email !== existingRsvp.email) {
        const emailExists = await db.rsvp.findFirst({
          where: {
            email,
            NOT: {
              id: existingRsvp.id,
            },
          },
        });

        if (emailExists) {
          throw new Error("An RSVP with this email already exists");
        }
      }

      const updatedRsvp = await db.rsvp.update({
        where: {
          editToken,
        },
        data: {
          email,
          ...data,
        },
      });

      await sendRsvpUpdateEmail({
        rsvp: updatedRsvp,
      });

      return {
        data: updatedRsvp,
        error: null,
        isSuccess: true,
      };
    }

    throw new Error("RSVP not found");
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || "Failed to update RSVP.";

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
    };
  }
};

export type ActionState = {
  data: Rsvp | null;
  error: string | null;
  isSuccess: boolean | null;
};

export const rsvp = async (
  { data: initialData }: ActionState,
  payload: FormData
): Promise<ActionState> => {
  try {
    const data = parseAndValidateFormData(payload);

    if (!(data.name && data.email)) {
      throw new Error("Name and email are required.");
    }

    if (initialData?.editToken) {
      return await updateRsvp({
        ...data,
        editToken: initialData.editToken,
      });
    }

    return await createRsvp(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || "Failed to create RSVP.";

    return {
      data: initialData,
      error: errorMessage,
      isSuccess: false,
    };
  }
};
