"use server";

import { RSVP_FIELDS } from "@@/constants";
import {
  sendRsvpConfirmationEmail,
  sendRsvpExistsEmail,
  sendRsvpUpdateEmail,
} from "@@/email";
import { requestInfo } from "rwsdk/worker";
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
  const rawData = {
    name: formData.get(RSVP_FIELDS.name.name) as string,
    email: formData.get(RSVP_FIELDS.email.name) as string,
    plusOne: formData.get(RSVP_FIELDS.plusOne.name) === "true",
    plusOneName: formData.get(RSVP_FIELDS.plusOneName.name) as string | null,
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
  const { request } = requestInfo;
  const origin = new URL(request.url).origin;

  try {
    const existingRsvp = await db.rsvp.findFirst({
      where: {
        email,
      },
    });

    if (existingRsvp) {
      await sendRsvpExistsEmail(existingRsvp, origin);
      throw new Error("An RSVP with this email already exists");
    }
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to check for existing RSVP.",
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

    await sendRsvpConfirmationEmail(rsvp, origin);

    return {
      isSuccess: true,
      error: null,
      data: rsvp,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to submit RSVP.",
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

      await sendRsvpUpdateEmail(updatedRsvp, origin);

      return {
        isSuccess: true,
        error: null,
        data: updatedRsvp,
      };
    }

    throw new Error("RSVP not found");
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to update RSVP.",
    };
  }
};

export type ActionState = {
  isSuccess: boolean | null;
  error: string | null;
  data: Rsvp | null;
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
    return {
      isSuccess: false,
      data: initialData,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to create RSVP.",
    };
  }
};
