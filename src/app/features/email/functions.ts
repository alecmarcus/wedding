"use server";

import { env } from "cloudflare:workers";
import { type CreateEmailOptions, Resend } from "resend";
import type { Rsvp } from "@/db";
import { db } from "@/db";
import type { DistributiveOmit } from "~/types";
import {
  rsvpConfirmationTemplate,
  rsvpExistsTemplate,
  rsvpUpdateTemplate,
} from "./templates";

export const resend = new Resend(env.RESEND_API);

export const sendEmail = async (
  options: DistributiveOmit<CreateEmailOptions, "from">
) => {
  const { data, error } = await resend.emails.send({
    from: env.FROM_EMAIL,
    ...options,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
};

export const sendRsvpConfirmationEmail = ({ rsvp }: { rsvp: Rsvp }) => {
  const { html, text } = rsvpConfirmationTemplate({
    rsvp,
  });

  return sendEmail({
    to: rsvp.email,
    bcc: env.FROM_EMAIL,
    subject: "Wedding RSVP Confirmation",
    html,
    text,
  });
};

export const resendConfirmationEmail = async ({
  rsvpId,
}: {
  rsvpId: string;
}) => {
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

    await sendRsvpConfirmationEmail({
      rsvp,
    });

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

export const sendRsvpExistsEmail = ({ rsvp }: { rsvp: Rsvp }) => {
  const { html, text } = rsvpExistsTemplate({
    rsvp,
  });

  return sendEmail({
    to: rsvp.email,
    bcc: env.FROM_EMAIL,
    subject: "Wedding RSVP Confirmation",
    html,
    text,
  });
};

export const sendRsvpUpdateEmail = ({ rsvp }: { rsvp: Rsvp }) => {
  const { html, text } = rsvpUpdateTemplate({
    rsvp,
  });

  return sendEmail({
    to: rsvp.email,
    subject: "Wedding RSVP Updated",
    html,
    text,
  });
};
