import { Body, Head, Html } from "@react-email/components";
import type { Rsvp } from "@/db";
import { RenderEmail } from "./RenderEmail";

export const ConfirmationEmail = ({
  rsvp,
  editLink,
  uploadLink,
}: {
  rsvp: Rsvp;
  editLink: string;
  uploadLink: string;
}) => {
  return (
    <RenderEmail>
      <Html>
        <Head />
        <Body>
          Thank you for your RSVP! Hi ${rsvp.name}, We've received your RSVP for
          our wedding. Here are the details: Name: ${rsvp.name}$
          {rsvp.plusOne ? `Plus One: ${rsvp.plusOneName || "Yes"}` : ""}$
          {rsvp.dietaryRestrictions
            ? `Dietary Restrictions: ${rsvp.dietaryRestrictions}`
            : ""}
          ${rsvp.message ? `Message: ${rsvp.message}` : ""}
          You can use the following links to: - Edit your RSVP: ${editLink}-
          Upload photos: ${uploadLink}
          Please save this email as you'll need these links to make changes or
          upload photos. We look forward to celebrating with you!
        </Body>
      </Html>
    </RenderEmail>
  );
};

export const RsvpExistsEmail = ({
  editLink,
  uploadLink,
}: {
  editLink: string;
  uploadLink: string;
}) => {
  return (
    <RenderEmail>
      <Html>
        <Head />
        <Body>
          An RSVP was submitted with this email, but we already have an existing
          one. If you want to make changes, use the link below. - Edit your
          RSVP: ${editLink}- Upload photos: ${uploadLink}
        </Body>
      </Html>
    </RenderEmail>
  );
};

export const RsvpUpdatedEmail = ({
  rsvp,
  editLink,
  uploadLink,
}: {
  rsvp: Rsvp;
  editLink: string;
  uploadLink: string;
}) => {
  return (
    <RenderEmail>
      <Html>
        <Head />
        <Body>
          Your RSVP has been updated Hi ${rsvp.name}, Your RSVP has been
          successfully updated. Here are your current details: Name: $
          {rsvp.name}$
          {rsvp.plusOne ? `Plus One: ${rsvp.plusOneName || "Yes"}` : ""}$
          {rsvp.dietaryRestrictions
            ? `Dietary Restrictions: ${rsvp.dietaryRestrictions}`
            : ""}
          ${rsvp.message ? `Message: ${rsvp.message}` : ""}
          You can still use these links to: - Make further changes: ${editLink}-
          Upload photos: ${uploadLink}
          We look forward to celebrating with you!
        </Body>
      </Html>
    </RenderEmail>
  );
};

export const ArbitraryEmail = ({ text }: { text: string }) => {
  return (
    <RenderEmail>
      <Html>
        <Head />
        <Body>${text}</Body>
      </Html>
    </RenderEmail>
  );
};
