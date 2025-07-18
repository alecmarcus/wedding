"use server";

import { env } from "cloudflare:workers";
import { Resend } from "resend";
import type { Rsvp } from "@/db";

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const resend = new Resend(env.RESEND_API);

  const { data, error } = await resend.emails.send({
    from: env.FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
};

export const sendRsvpConfirmationEmail = (rsvp: Rsvp, baseUrl: string) => {
  const editLink = `${baseUrl}/rsvp/edit?token=${rsvp.editToken}`;
  const uploadLink = `${baseUrl}/upload?token=${rsvp.uploadToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your RSVP!</h2>
      <p>Hi ${rsvp.name},</p>
      <p>We've received your RSVP for our wedding. Here are the details:</p>

      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p><strong>Name:</strong> ${rsvp.name}</p>
        ${rsvp.plusOne ? `<p><strong>Plus One:</strong> ${rsvp.plusOneName || "Yes"}</p>` : ""}
        ${rsvp.dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${rsvp.dietaryRestrictions}</p>` : ""}
        ${rsvp.message ? `<p><strong>Message:</strong> ${rsvp.message}</p>` : ""}
      </div>

      <p>You can use the following links to:</p>
      <ul>
        <li><a href="${editLink}">Edit your RSVP</a></li>
        <li><a href="${uploadLink}">Upload photos for the wedding</a></li>
      </ul>

      <p>Please save this email as you'll need these links to make changes or upload photos.</p>

      <p>We look forward to celebrating with you!</p>
    </div>
  `;

  const text = `
Thank you for your RSVP!

Hi ${rsvp.name},

We've received your RSVP for our wedding. Here are the details:

Name: ${rsvp.name}
${rsvp.plusOne ? `Plus One: ${rsvp.plusOneName || "Yes"}` : ""}
${rsvp.dietaryRestrictions ? `Dietary Restrictions: ${rsvp.dietaryRestrictions}` : ""}
${rsvp.message ? `Message: ${rsvp.message}` : ""}

You can use the following links to:
- Edit your RSVP: ${editLink}
- Upload photos: ${uploadLink}

Please save this email as you'll need these links to make changes or upload photos.

We look forward to celebrating with you!
  `;

  return sendEmail({
    to: rsvp.email,
    subject: "Wedding RSVP Confirmation",
    html,
    text,
  });
};

export const sendRsvpUpdateEmail = (rsvp: Rsvp, baseUrl: string) => {
  const editLink = `${baseUrl}/rsvp/edit?token=${rsvp.editToken}`;
  const uploadLink = `${baseUrl}/upload?token=${rsvp.uploadToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your RSVP has been updated</h2>
      <p>Hi ${rsvp.name},</p>
      <p>Your RSVP has been successfully updated. Here are your current details:</p>

      <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <p><strong>Name:</strong> ${rsvp.name}</p>
        ${rsvp.plusOne ? `<p><strong>Plus One:</strong> ${rsvp.plusOneName || "Yes"}</p>` : ""}
        ${rsvp.dietaryRestrictions ? `<p><strong>Dietary Restrictions:</strong> ${rsvp.dietaryRestrictions}</p>` : ""}
        ${rsvp.message ? `<p><strong>Message:</strong> ${rsvp.message}</p>` : ""}
      </div>

      <p>You can still use these links to:</p>
      <ul>
        <li><a href="${editLink}">Make further changes to your RSVP</a></li>
        <li><a href="${uploadLink}">Upload photos for the wedding</a></li>
      </ul>

      <p>We look forward to celebrating with you!</p>
    </div>
  `;

  const text = `
Your RSVP has been updated

Hi ${rsvp.name},

Your RSVP has been successfully updated. Here are your current details:

Name: ${rsvp.name}
${rsvp.plusOne ? `Plus One: ${rsvp.plusOneName || "Yes"}` : ""}
${rsvp.dietaryRestrictions ? `Dietary Restrictions: ${rsvp.dietaryRestrictions}` : ""}
${rsvp.message ? `Message: ${rsvp.message}` : ""}

You can still use these links to:
- Make further changes: ${editLink}
- Upload photos: ${uploadLink}

We look forward to celebrating with you!
  `;

  return sendEmail({
    to: rsvp.email,
    subject: "Wedding RSVP Updated",
    html,
    text,
  });
};

export const sendBulkEmail = async (
  recipients: string[],
  subject: string,
  content: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${content}
    </div>
  `;
  return await Promise.allSettled(
    recipients.map(recipient => async () => {
      try {
        const result = await sendEmail({
          to: recipient,
          subject,
          html,
          text: content.replace(/<[^>]*>/g, ""),
        });
        return {
          recipient,
          success: true,
          data: result,
        };
      } catch (error) {
        return {
          recipient,
          success: false,
          data: null,
          error,
        };
      }
    })
  );
};
