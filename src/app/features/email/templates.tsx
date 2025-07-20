import { requestInfo } from "rwsdk/worker";
import type { Rsvp } from "@/db";

const createEmailEditLinks = ({
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

export const rsvpConfirmationTemplate = ({ rsvp }: { rsvp: Rsvp }) => {
  const { editLink, uploadLink } = createEmailEditLinks({
    editToken: rsvp.editToken,
    uploadToken: rsvp.uploadToken,
  });

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

  return {
    html,
    text,
  };
};

export const rsvpExistsTemplate = ({ rsvp }: { rsvp: Rsvp }) => {
  const { editLink, uploadLink } = createEmailEditLinks({
    editToken: rsvp.editToken,
    uploadToken: rsvp.uploadToken,
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      An RSVP was submitted with this email, but we already have an existing one. If you want to make changes, use the link below.
      <ul>
        <li><a href="${editLink}">Edit your RSVP</a></li>
        <li><a href="${uploadLink}">Upload photos for the wedding</a></li>
      </ul>
    </div>
  `;

  const text = `
An RSVP was submitted with this email, but we already have an existing one. If you want to make changes, use the link below.
- Edit your RSVP: ${editLink}
- Upload photos: ${uploadLink}
  `;

  return {
    html,
    text,
  };
};

export const rsvpUpdateTemplate = ({ rsvp }: { rsvp: Rsvp }) => {
  const { editLink, uploadLink } = createEmailEditLinks({
    editToken: rsvp.editToken,
    uploadToken: rsvp.uploadToken,
  });

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
  return {
    html,
    text,
  };
};
