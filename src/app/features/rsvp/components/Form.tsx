"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sec } from "@/constants";
import type { Photo, Rsvp } from "@/db";
import { RSVP_FIELDS } from "../fields";
import { useRsvpAction } from "../hooks";
import { PhotoInput, type PhotoInputHandle } from "../photo/components/Input";

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
        message: "Your RSVP has been updated successfully.",
        confirmationMessage:
          "A confirmation email has been sent to your email address.",
        title: "RSVP Updated!",
      };
    }
    return {
      message: "Your RSVP has been submitted successfully.",
      confirmationMessage:
        "Please check your email for confirmation and important links.",
      title: "Thank You!",
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
  photos: initialPhotos,
  onDoneEditing,
  onCancelUpdating,
}: {
  rsvp: Rsvp | null;
  photos: Photo[];
  onDoneEditing?: () => void;
  onCancelUpdating?: () => void;
}) => {
  const ref = useRef<HTMLFormElement>(null);

  const [rsvpAction, { isSuccess, isPending, error, data: rsvp }] =
    useRsvpAction({
      data: initialRsvp
        ? {
            ...initialRsvp,
            photos: {
              failureCount: 0,
              failures: [],
              successCount: initialPhotos.length,
              successes: initialPhotos,
              total: initialPhotos.length,
            },
          }
        : null,
      error: null,
      isSuccess: null,
    });

  const [isEditing, setIsEditing] = useState(true);
  const [submissionType, setSubmissionType] = useState<
    RsvpFormSuccessProps["submissionType"]
  >(initialRsvp ? "update" : "create");

  const [shownError, setShownError] = useState<string | null>(null);
  useEffect(() => {
    if (error) {
      setShownError(error);
      const timeout = setTimeout(() => {
        setShownError(null);
      }, sec(3));

      return () => clearTimeout(timeout);
    }
  }, [
    error,
  ]);

  const returnToEditing = useCallback(() => {
    if (rsvp?.editToken) {
      setIsEditing(true);
      setSubmissionType("update");
    }
  }, [
    rsvp?.editToken,
  ]);

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

  const [attending, setAttending] = useState(!!initialRsvp?.attending);
  const handleAttendingChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setAttending(isChecked);
    },
    []
  );

  const [hasPlusOne, setHasPlusOne] = useState(!!initialRsvp?.plusOne);
  const handlePlusOneChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      setHasPlusOne(isChecked);
    },
    []
  );

  const buttonText = useMemo(() => {
    const pendingText =
      submissionType === "update" ? "Updating..." : "Submitting...";
    const actionText =
      submissionType === "update" ? "Update RSVP" : "Submit RSVP";

    return isPending ? pendingText : actionText;
  }, [
    isPending,
    submissionType,
  ]);

  const title = submissionType === "update" ? "Edit Your RSVP" : "RSVP";

  const photoInputHandle = useRef<PhotoInputHandle>(null);

  if (!isEditing) {
    return (
      <RsvpFormSuccess
        submissionType={submissionType}
        returnToEditing={returnToEditing}
      />
    );
  }

  return (
    <form ref={ref} action={rsvpAction}>
      <h2>{title}</h2>

      {shownError && (
        <div role="alert">
          <p>{shownError}</p>
        </div>
      )}

      <div>
        <label htmlFor={RSVP_FIELDS.name.name}>
          Name *
          <input
            autoComplete="name"
            defaultValue={rsvp?.name}
            disabled={isPending}
            id={RSVP_FIELDS.name.name}
            maxLength={RSVP_FIELDS.name.max}
            name={RSVP_FIELDS.name.name}
            readOnly={submissionType === "update"}
            required={true}
            type="text"
          />
        </label>
      </div>

      <div>
        <label htmlFor={RSVP_FIELDS.email.name}>
          Email *
          <input
            autoComplete="email"
            defaultValue={rsvp?.email}
            disabled={isPending}
            id={RSVP_FIELDS.email.name}
            maxLength={RSVP_FIELDS.email.max}
            name={RSVP_FIELDS.email.name}
            readOnly={submissionType === "update"}
            required={true}
            type="email"
          />
        </label>
      </div>

      <div>
        <label htmlFor={RSVP_FIELDS.attending.name}>
          <input
            defaultChecked={rsvp?.attending ?? false}
            disabled={isPending}
            id={RSVP_FIELDS.attending.name}
            name={RSVP_FIELDS.attending.name}
            onChange={handleAttendingChange}
            type="checkbox"
          />
          Will you be joining us?
        </label>
      </div>

      <div
        style={{
          display: attending ? "block" : "none",
        }}
      >
        <label htmlFor={RSVP_FIELDS.plusOne.name}>
          <input
            defaultChecked={rsvp?.plusOne ?? false}
            disabled={isPending || attending === false}
            id={RSVP_FIELDS.plusOne.name}
            name={RSVP_FIELDS.plusOne.name}
            onChange={handlePlusOneChange}
            type="checkbox"
          />
          Will you be bringing a plus one?
        </label>
      </div>

      <div
        style={{
          display: attending && hasPlusOne ? "block" : "none",
        }}
      >
        <label htmlFor={RSVP_FIELDS.plusOneName.name}>
          Plus One Name *
          <input
            autoComplete="name"
            defaultValue={rsvp?.plusOneName || undefined}
            disabled={isPending}
            id={RSVP_FIELDS.plusOneName.name}
            maxLength={RSVP_FIELDS.plusOneName.max}
            name={RSVP_FIELDS.plusOneName.name}
            required={hasPlusOne}
            type="text"
          />
        </label>
      </div>

      <div
        style={{
          display: attending ? "block" : "none",
        }}
      >
        <label htmlFor={RSVP_FIELDS.dietaryRestrictions.name}>
          Dietary Restrictions
          <textarea
            defaultValue={rsvp?.dietaryRestrictions || undefined}
            disabled={isPending}
            id={RSVP_FIELDS.dietaryRestrictions.name}
            maxLength={RSVP_FIELDS.dietaryRestrictions.max}
            name={RSVP_FIELDS.dietaryRestrictions.name}
            rows={3}
          />
        </label>
      </div>

      <div>
        <label htmlFor={RSVP_FIELDS.message.name}>
          Message for the Couple
          <textarea
            defaultValue={rsvp?.message || undefined}
            disabled={isPending}
            id={RSVP_FIELDS.message.name}
            maxLength={RSVP_FIELDS.message.max}
            name={RSVP_FIELDS.message.name}
            rows={4}
          />
        </label>
      </div>

      <PhotoInput
        isPending={isPending}
        uploadedPhotos={rsvp?.photos?.successes || initialPhotos || []}
        editToken={rsvp?.editToken}
        ref={photoInputHandle}
      />

      {onCancelUpdating && submissionType === "update" && (
        <button type="button" disabled={isPending} onClick={onCancelUpdating}>
          Cancel
        </button>
      )}
      <button
        type="submit"
        disabled={
          isPending ||
          Object.values(photoInputHandle.current?.errors || []).some(e => e)
        }
      >
        {buttonText}
      </button>
    </form>
  );
};
