"use server";

import { sendBulkEmail, sendRsvpConfirmationEmail } from "@@/email";
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
    };
  } catch (error) {
    console.error("Failed to resend confirmation email:", error);
    return {
      success: false,
      error: "Failed to resend confirmation email",
    };
  }
};

export const sendBulkEmailToGuests = async (
  subject: string,
  content: string
) => {
  try {
    const rsvps = await db.rsvp.findMany({
      select: {
        email: true,
      },
    });

    const emails = rsvps.map(rsvp => rsvp.email);

    if (emails.length === 0) {
      return {
        success: false,
        error: "No RSVPs found",
      };
    }

    const results = await sendBulkEmail(emails, subject, content);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return {
      success: true,
      data: {
        totalSent: results.length,
        successCount,
        failureCount,
        results,
      },
    };
  } catch (error) {
    console.error("Failed to send bulk email:", error);
    return {
      success: false,
      error: "Failed to send bulk email",
    };
  }
};
