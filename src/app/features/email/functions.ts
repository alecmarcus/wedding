"use server";

import { env } from "cloudflare:workers";
import type { CreateEmailOptions } from "resend";
import { renderToString, requestInfo } from "rwsdk/worker";
import type { Rsvp } from "@/db";
import { db } from "@/db";
import type { DistributiveOmit } from "~/types";
import {
  ArbitraryEmail,
  ConfirmationEmail,
  RsvpExistsEmail,
  RsvpUpdatedEmail,
} from "./templates";

const getEditLinks = ({
  editToken,
  uploadToken,
}: {
  editToken: string;
  uploadToken: string;
}) => {
  const { request } = requestInfo;
  const { origin } = new URL(request.url);

  const editLink = `${origin}/rsvp/${editToken}`;
  const uploadLink = `${origin}/upload/${uploadToken}`;

  return {
    editLink,
    uploadLink,
  };
};

export const sendEmail = async (
  options: DistributiveOmit<CreateEmailOptions, "from">
) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...options,
      from: env.FROM_EMAIL,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${error}`);
  }

  return await response.json();
};

export const sendRsvpConfirmationEmail = async ({ rsvp }: { rsvp: Rsvp }) => {
  const html = await renderToString(
    ConfirmationEmail({
      rsvp,
      ...getEditLinks({
        editToken: rsvp.editToken,
        uploadToken: rsvp.uploadToken,
      }),
    })
  );

  return sendEmail({
    bcc: env.FROM_EMAIL,
    html,
    subject: "Wedding RSVP Confirmation",
    to: rsvp.email,
  });
};

export const resendConfirmationEmail = async (where: { id: string }) => {
  try {
    const rsvp = await db.rsvp.findUniqueOrThrow({
      where,
    });

    await sendRsvpConfirmationEmail({
      rsvp,
    });

    return {
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      error: errorMessage,
      isSuccess: false,
    };
  }
};

export const sendRsvpExistsEmail = async ({ rsvp }: { rsvp: Rsvp }) => {
  const html = await renderToString(
    RsvpExistsEmail(
      getEditLinks({
        editToken: rsvp.editToken,
        uploadToken: rsvp.uploadToken,
      })
    )
  );

  return sendEmail({
    bcc: env.FROM_EMAIL,
    html,
    subject: "Wedding RSVP Confirmation",
    to: rsvp.email,
  });
};

export const sendRsvpUpdateEmail = async ({ rsvp }: { rsvp: Rsvp }) => {
  const html = await renderToString(
    RsvpUpdatedEmail({
      rsvp,
      ...getEditLinks({
        editToken: rsvp.editToken,
        uploadToken: rsvp.uploadToken,
      }),
    })
  );

  return sendEmail({
    html,
    subject: "Wedding RSVP Updated",
    to: rsvp.email,
  });
};

export const sendArbitraryEmail = async ({
  recipient,
  subject,
  text,
}: {
  subject: string;
  recipient: string;
  text: string;
}) => {
  const html = await renderToString(
    ArbitraryEmail({
      text,
    })
  );

  try {
    const result = await sendEmail({
      html,
      subject,
      to: recipient,
    });

    return {
      data: result,
      error: null,
      isSuccess: true,
      recipient,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
      recipient,
    };
  }
};
