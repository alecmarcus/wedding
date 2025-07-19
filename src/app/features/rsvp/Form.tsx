import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RSVP_FIELDS } from "@/app/constants";
import type { Rsvp } from "@/db";
import { useRsvpAction } from "./hooks";

type RsvpFormSuccessProps = {
  submissionType: "update" | "create";
  returnToEditing: () => void;
};

const RsvpFormSuccess = ({
  submissionType,
  returnToEditing,
}: RsvpFormSuccessProps) => {
  const { title, message, confirmationMessage } = useMemo(() => {
    if (submissionType === "update") {
      return {
        title: "RSVP Updated!",
        message: "Your RSVP has been updated successfully.",
        confirmationMessage:
          "A confirmation email has been sent to your email address.",
      };
    }
    return {
      title: "Thank You!",
      message: "Your RSVP has been submitted successfully.",
      confirmationMessage:
        "Please check your email for confirmation and important links.",
    };
  }, [
    submissionType,
  ]);

  return (
    <div>
      <h2>{title}</h2>
      <p>{message}</p>
      <p>{confirmationMessage}</p>
      <button type="button" onClick={returnToEditing}>
        Edit my RSVP
      </button>
    </div>
  );
};

export const RsvpForm = ({
  rsvp: initialRsvp,
  onDoneEditing,
  onCancelUpdating,
}: {
  rsvp: Rsvp | null;
  onDoneEditing?: () => void;
  onCancelUpdating?: () => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);

  const [onSubmit, { isSuccess, isPending, error, data: rsvp }] = useRsvpAction(
    {
      data: initialRsvp,
      error: null,
      isSuccess: null,
    }
  );

  const [isEditing, setIsEditing] = useState(true);
  const [submissionType, setSubmissionType] = useState<
    RsvpFormSuccessProps["submissionType"]
  >(initialRsvp ? "update" : "create");
  const returnToEditing = useCallback(() => {
    setIsEditing(true);
    setSubmissionType("update");
  }, []);
  useEffect(() => {
    if (isPending === false && isSuccess) {
      setIsEditing(false);
      onDoneEditing?.();
    }
  }, [
    isPending,
    isSuccess,
    onDoneEditing,
  ]);

  const [hasPlusOne, setHasPlusOne] = useState(initialRsvp?.plusOne);
  const handlePlusOneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setHasPlusOne(isChecked);
    },
    []
  );

  const buttonText = useMemo(() => {
    if (isPending) {
      return submissionType === "update" ? "Updating..." : "Submitting...";
    }
    return submissionType === "update" ? "Update RSVP" : "Submit RSVP";
  }, [
    isPending,
    submissionType,
  ]);

  const title = submissionType === "update" ? "Edit Your RSVP" : "RSVP";

  if (!isEditing) {
    return (
      <RsvpFormSuccess
        submissionType={submissionType}
        returnToEditing={returnToEditing}
      />
    );
  }

  return (
    <form ref={ref} action={onSubmit}>
      <h2>{title}</h2>

      {error && (
        <div role="alert">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label htmlFor={RSVP_FIELDS.name.name}>Name *</label>
        <input
          type="text"
          id={RSVP_FIELDS.name.name}
          name={RSVP_FIELDS.name.name}
          maxLength={RSVP_FIELDS.name.max}
          minLength={RSVP_FIELDS.name.min}
          defaultValue={rsvp?.name}
          required={true}
          disabled={isPending}
          readOnly={submissionType === "update"}
        />
      </div>

      <div>
        <label htmlFor={RSVP_FIELDS.email.name}>Email *</label>
        <input
          type="email"
          id={RSVP_FIELDS.email.name}
          name={RSVP_FIELDS.email.name}
          maxLength={RSVP_FIELDS.email.max}
          defaultValue={rsvp?.email}
          required={true}
          disabled={isPending}
          readOnly={submissionType === "update"}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name={RSVP_FIELDS.plusOne.name}
            maxLength={RSVP_FIELDS.plusOne.max}
            value="true"
            defaultChecked={rsvp?.plusOne}
            disabled={isPending}
            onChange={handlePlusOneChange}
          />
          Will you be bringing a plus one?
        </label>
      </div>

      {hasPlusOne && (
        <div>
          <label htmlFor={RSVP_FIELDS.plusOneName.name}>Plus One Name</label>
          <input
            type="text"
            id={RSVP_FIELDS.plusOneName.name}
            name={RSVP_FIELDS.plusOneName.name}
            maxLength={RSVP_FIELDS.plusOneName.max}
            defaultValue={rsvp?.plusOneName || ""}
            disabled={isPending}
          />
        </div>
      )}

      <div>
        <label htmlFor={RSVP_FIELDS.dietaryRestrictions.name}>
          Dietary Restrictions
        </label>
        <textarea
          id={RSVP_FIELDS.dietaryRestrictions.name}
          name={RSVP_FIELDS.dietaryRestrictions.name}
          maxLength={RSVP_FIELDS.dietaryRestrictions.max}
          rows={3}
          defaultValue={rsvp?.dietaryRestrictions || ""}
          disabled={isPending}
        />
      </div>

      <div>
        <label htmlFor={RSVP_FIELDS.message.name}>Message for the Couple</label>
        <textarea
          id={RSVP_FIELDS.message.name}
          name={RSVP_FIELDS.message.name}
          maxLength={RSVP_FIELDS.message.max}
          rows={4}
          defaultValue={rsvp?.message || ""}
          disabled={isPending}
        />
      </div>

      {onCancelUpdating && submissionType === "update" && (
        <button type="button" disabled={isPending} onClick={onCancelUpdating}>
          Cancel
        </button>
      )}
      <button type="submit" disabled={isPending}>
        {buttonText}
      </button>
    </form>
  );
};
