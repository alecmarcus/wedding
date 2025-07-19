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
    bcc: env.FROM_EMAIL,
    html,
    subject: "Wedding RSVP Confirmation",
    text,
    to: rsvp.email,
  });
};

export const resendConfirmationEmail = async ({ id }: { id: string }) => {
  try {
    const rsvp = await db.rsvp.findUnique({
      where: {
        id,
      },
    });

    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    await sendRsvpConfirmationEmail({
      rsvp,
    });

    return {
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || "Unknown error";

    return {
      error: errorMessage,
      isSuccess: false,
    };
  }
};

export const sendRsvpExistsEmail = ({ rsvp }: { rsvp: Rsvp }) => {
  const { html, text } = rsvpExistsTemplate({
    rsvp,
  });

  return sendEmail({
    bcc: env.FROM_EMAIL,
    html,
    subject: "Wedding RSVP Confirmation",
    text,
    to: rsvp.email,
  });
};

export const sendRsvpUpdateEmail = ({ rsvp }: { rsvp: Rsvp }) => {
  const { html, text } = rsvpUpdateTemplate({
    rsvp,
  });

  return sendEmail({
    html,
    subject: "Wedding RSVP Updated",
    text,
    to: rsvp.email,
  });
};
