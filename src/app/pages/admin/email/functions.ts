"use server";

import { sendRsvpConfirmationEmail } from "@@/email";
import { requestInfo } from "rwsdk/worker";
import { db } from "@/db";

export const getAllEmails = async () => {
  return await db.rsvp.findMany({
    select: {
      email: true,
      name: true,
    },
  });
};

export const resendConfirmationEmail = async (rsvpId: string) => {
  const { request } = requestInfo;
  const origin = new URL(request.url).origin;

  try {
    const rsvp = await db.rsvp.findUnique({
      where: {
        id: rsvpId,
      },
    });

    if (!rsvp) {
      return {
        success: false,
        error: "RSVP not found",
      };
    }

    await sendRsvpConfirmationEmail(rsvp, origin);

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Unknown error",
    };
  }
};
