"use server";

import { sendEmail } from "@@/email";
import { maxLength, object, parse, pipe, string } from "valibot";
import { BULK_EMAIL_FIELDS } from "@/app/constants";
import { db } from "@/db";

const bulkEmailSchema = object({
  subject: pipe(string(), maxLength(BULK_EMAIL_FIELDS.subject.max)),
  content: pipe(string(), maxLength(BULK_EMAIL_FIELDS.content.max)),
});

const parseAndValidateFormData = (formData: FormData) => {
  const rawData = {
    subject: formData.get(BULK_EMAIL_FIELDS.subject.name) as string,
    content: formData.get(BULK_EMAIL_FIELDS.content.name) as string,
  };

  return parse(bulkEmailSchema, rawData);
};

type BulkEmailResponse = {
  successes: string[];
  failures: {
    email: string;
    error: string | null;
  }[];
  total: number;
  successCount: number;
  failureCount: number;
};

export type ActionState = {
  isSuccess: boolean | null;
  error: string | null;
  data: BulkEmailResponse | null;
};

export const sendBulkEmail = async (
  _initialState: ActionState,
  payload: FormData
): Promise<ActionState> => {
  try {
    const { subject, content } = parseAndValidateFormData(payload);

    const recipients = await db.rsvp.findMany({
      select: {
        email: true,
      },
    });

    if (recipients.length === 0) {
      throw new Error("No RSVPs found");
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${content}
      </div>
    `;

    const emails = recipients.map(async ({ email }) => {
      try {
        const result = await sendEmail({
          to: email,
          subject,
          html,
          text: content.replace(/<[^>]*>/g, ""),
        });

        return {
          data: result,
          error: null,
          recipient: email,
          success: true,
        };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? error.message : String(error),
          recipient: email,
          success: false,
        };
      }
    });

    const results = await Promise.allSettled(emails);

    const successes: BulkEmailResponse["successes"] = [];
    const failures: BulkEmailResponse["failures"] = [];

    results.forEach((result, index) => {
      const recipient = recipients[index];

      if (result.status === "fulfilled") {
        if (result.value.success) {
          successes.push(recipient.email);
        } else {
          failures.push({
            email: recipient.email,
            error: result.value.error,
          });
        }
      } else {
        failures.push({
          email: recipient.email,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        });
      }
    });

    return {
      isSuccess: true,
      error: null,
      data: {
        successes,
        failures,
        total: recipients.length,
        successCount: successes.length,
        failureCount: failures.length,
      },
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to send bulk email",
    };
  }
};
