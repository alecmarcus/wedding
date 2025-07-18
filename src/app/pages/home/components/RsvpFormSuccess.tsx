type RsvpFormSuccessProps = {
  isEditMode: boolean;
  onReset: () => void;
};

export const RsvpFormSuccess = ({
  isEditMode,
  onReset,
}: RsvpFormSuccessProps) => {
  return (
    <div>
      <h2>{isEditMode ? "RSVP Updated!" : "Thank You!"}</h2>
      <p>
        {isEditMode
          ? "Your RSVP has been updated successfully."
          : "Your RSVP has been submitted successfully."}
      </p>
      <p>
        {isEditMode
          ? "A confirmation email has been sent to your email address."
          : "Please check your email for confirmation and important links."}
      </p>
      <button type="button" onClick={onReset}>
        {isEditMode ? "Continue Editing" : "Submit Another RSVP"}
      </button>
    </div>
  );
};
