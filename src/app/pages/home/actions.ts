"use server";

import { RSVP_FORM_FIELDS } from "@@/constants";
import { requestInfo } from "rwsdk/worker";
import { sendRsvpConfirmationEmail, sendRsvpUpdateEmail } from "@/app/email";
import { db } from "@/db";

const getRsvpFormData = (formData: FormData) => {
  const name = formData.get(RSVP_FORM_FIELDS.NAME) as string;
  const email = formData.get(RSVP_FORM_FIELDS.EMAIL) as string;
  const plusOne = formData.get(RSVP_FORM_FIELDS.PLUS_ONE) === "true";
  const plusOneName = formData.get(RSVP_FORM_FIELDS.PLUS_ONE_NAME) as
    | string
    | null;
  const dietaryRestrictions = formData.get(
    RSVP_FORM_FIELDS.DIETARY_RESTRICTIONS
  ) as string | null;
  const message = formData.get(RSVP_FORM_FIELDS.MESSAGE) as string | null;

  return {
    name,
    email,
    plusOne,
    plusOneName,
    dietaryRestrictions,
    message,
  };
};

export const submitRsvp = async (formData: FormData) => {
  const { request } = requestInfo;
  const origin = new URL(request.url).origin;

  const { name, email, plusOne, plusOneName, dietaryRestrictions, message } =
    getRsvpFormData(formData);

  // Validate required fields
  if (!(name && email)) {
    return {
      success: false,
      error: "Name and email are required",
    };
  }

  // Check for existing RSVP with same email
  const existingRsvp = await db.rsvp.findFirst({
    where: {
      email,
    },
  });

  if (existingRsvp) {
    return {
      success: false,
      error: "An RSVP with this email already exists",
    };
  }

  try {
    // Create the RSVP
    const rsvp = await db.rsvp.create({
      data: {
        name,
        email,
        plusOne,
        plusOneName: plusOne ? plusOneName : null,
        dietaryRestrictions,
        message,
      },
    });

    // Send confirmation email
    await sendRsvpConfirmationEmail(rsvp, origin);

    return {
      success: true,
      data: {
        id: rsvp.id,
        name: rsvp.name,
        email: rsvp.email,
      },
    };
  } catch (error) {
    console.error("Failed to submit RSVP:", error);
    return {
      success: false,
      error: "Failed to submit RSVP. Please try again.",
    };
  }
};

export const getRsvpByEditToken = async (token: string) => {
  if (!token) {
    return {
      success: false,
      error: "Invalid token",
    };
  }

  try {
    const rsvp = await db.rsvp.findUnique({
      where: {
        editToken: token,
      },
    });

    if (!rsvp) {
      return {
        success: false,
        error: "RSVP not found",
      };
    }

    return {
      success: true,
      data: rsvp,
    };
  } catch (error) {
    console.error("Failed to fetch RSVP:", error);
    return {
      success: false,
      error: "Failed to fetch RSVP",
    };
  }
};

export const updateRsvp = async (editToken: string, formData: FormData) => {
  const { request } = requestInfo;
  const origin = new URL(request.url).origin;

  const { name, email, plusOne, plusOneName, dietaryRestrictions, message } =
    getRsvpFormData(formData);

  // Validate required fields
  if (!(name && email)) {
    return {
      success: false,
      error: "Name and email are required",
    };
  }

  try {
    // Verify the RSVP exists
    const existingRsvp = await db.rsvp.findUnique({
      where: {
        editToken,
      },
    });

    if (!existingRsvp) {
      return {
        success: false,
        error: "Invalid edit token",
      };
    }

    // Check if email is being changed and if new email already exists
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
        return {
          success: false,
          error: "An RSVP with this email already exists",
        };
      }
    }

    // Update the RSVP
    const updatedRsvp = await db.rsvp.update({
      where: {
        editToken,
      },
      data: {
        name,
        email,
        plusOne,
        plusOneName: plusOne ? plusOneName : null,
        dietaryRestrictions,
        message,
      },
    });

    // Send update confirmation email
    await sendRsvpUpdateEmail(updatedRsvp, origin);

    return {
      success: true,
      data: updatedRsvp,
    };
  } catch (error) {
    console.error("Failed to update RSVP:", error);
    return {
      success: false,
      error: "Failed to update RSVP. Please try again.",
    };
  }
};
