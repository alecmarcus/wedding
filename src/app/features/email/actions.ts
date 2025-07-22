"use server";

import {
  literal,
  maxLength,
  object,
  parse,
  pipe,
  string,
  union,
} from "valibot";
import { db } from "@/db";
import { BULK_SEND_FIELDS } from "./fields";
import { sendEmail } from "./functions";

const bulkEmailSchema = object({
  content: pipe(string(), maxLength(BULK_SEND_FIELDS.content.max)),
  subject: pipe(string(), maxLength(BULK_SEND_FIELDS.subject.max)),
  attending: union([
    literal("true"),
    literal("false"),
    literal("null"),
  ]),
});

const parseAndValidateFormData = ({ formData }: { formData: FormData }) => {
  const rawData = {
    content: formData.get(BULK_SEND_FIELDS.content.name) as string,
    subject: formData.get(BULK_SEND_FIELDS.subject.name) as string,
    attending: formData.get(BULK_SEND_FIELDS.attending.name) as string,
  };

  return parse(bulkEmailSchema, rawData);
};

type FailedEmail = {
  email: string;
  error: string | null;
};

type BulkEmailResponse = {
  failureCount: number;
  failures: FailedEmail[];
  successCount: number;
  successes: string[];
  total: number;
};

export type ActionState = {
  data: BulkEmailResponse | null;
  error: string | null;
  isSuccess: boolean | null;
};

export const sendBulkEmail = async (
  _initialState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const { subject, content, attending } = parseAndValidateFormData({
      formData,
    });

    const recipients = await db.rsvp.findMany({
      select: {
        email: true,
      },
      ...(attending !== "null" && {
        where: {
          attending: {
            equals: attending === "true",
          },
        },
      }),
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
          html,
          subject,
          text: content.replace(/<[^>]*>/g, ""),
          to: email,
        });

        return {
          data: result,
          error: null,
          isSuccess: true,
          recipient: email,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        return {
          data: null,
          error: errorMessage,
          isSuccess: false,
          recipient: email,
        };
      }
    });

    const results = await Promise.allSettled(emails);

    const successes: BulkEmailResponse["successes"] = [];
    const failures: BulkEmailResponse["failures"] = [];

    results.forEach((result, index) => {
      const recipient = recipients[index];

      if (result.status === "fulfilled") {
        if (result.value.isSuccess) {
          successes.push(recipient.email);
        } else {
          failures.push({
            email: recipient.email,
            error: result.value.error,
          });
        }
      } else {
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);

        failures.push({
          email: recipient.email,
          error: errorMessage,
        });
      }
    });

    const data = {
      failureCount: failures.length,
      failures,
      successCount: successes.length,
      successes,
      total: recipients.length,
    };

    return {
      data,
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
    };
  }
};
