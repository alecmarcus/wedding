"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ONE_KiB, ONE_MiB, sec } from "@/app/constants";

import type { ActionState } from "../actions";
import { RSVP_FIELDS } from "../fields";
import { useRsvpAction } from "../hooks";

const getFileSize = (size: number) => {
  if (size < ONE_KiB) {
    return {
      mib: size / ONE_MiB,
      labelled: `${size} bytes`,
    };
  }
  if (size >= ONE_KiB && size < ONE_MiB) {
    return {
      mib: size / ONE_MiB,
      labelled: `${(size / ONE_KiB).toFixed(1)} KiB`,
    };
  }
  return {
    mib: size / ONE_MiB,
    labelled: `${(size / ONE_MiB).toFixed(1)} MiB`,
  };
};

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
  error: initialError,
  onDoneEditing,
  // onCancelUpdating,
}: {
  rsvp: ActionState["data"];
  onDoneEditing?: () => void;
  // onCancelUpdating?: () => void;
  error: string | null;
}) => {
  const ref = useRef<HTMLFormElement>(null);

  const [rsvpAction, { isSuccess, isPending, error, data: rsvp }] =
    useRsvpAction({
      data: initialRsvp,
      error: null,
      isSuccess: null,
    });

  const [isEditing, setIsEditing] = useState(true);
  const [submissionType, setSubmissionType] = useState<
    RsvpFormSuccessProps["submissionType"]
  >(initialRsvp ? "update" : "create");

  const [shownError, setShownError] = useState<string | null>(null);
  useEffect(() => {
    if (error || initialError) {
      setShownError(error || initialError);
      const timeout = setTimeout(() => {
        setShownError(null);
      }, sec(3));

      return () => clearTimeout(timeout);
    }
  }, [
    error,
    initialError,
  ]);

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

  const [hasPlusOne, setHasPlusOne] = useState(initialRsvp?.plusOne ?? true);
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

  const [filesTooLarge, setFilesTooLarge] = useState(false);
  // const [tooManyFiles, setTooManyFiles] = useState(false);
  const onPhotosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) {
        return;
      }

      for (const file of files) {
        const tooBig = getFileSize(file.size).mib > RSVP_FIELDS.photos.maxSize;
        if (tooBig) {
          setFilesTooLarge(true);
          break;
        }
      }
    },
    []
  );

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
        <label htmlFor={RSVP_FIELDS.plusOne.name}>
          <input
            checked={hasPlusOne}
            defaultChecked={rsvp?.plusOne}
            disabled={isPending}
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
          display: hasPlusOne ? "block" : "none",
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

      <div>
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

      <div>
        <label htmlFor={RSVP_FIELDS.photos.name}>
          Upload photos
          <input
            type="file"
            multiple={true}
            accept={RSVP_FIELDS.photos.mimeType.join(", ")}
            disabled={isPending}
            id={RSVP_FIELDS.photos.name}
            name={RSVP_FIELDS.photos.name}
            max={RSVP_FIELDS.photos.maxLength}
            onChange={onPhotosChange}
          />
        </label>
        {filesTooLarge && "Must be smaller than 10 MiB"}
      </div>

      {/* {onCancelUpdating && submissionType === "update" && (
        <button type="button" disabled={isPending} onClick={onCancelUpdating}>
          Cancel
        </button>
      )} */}
      <button type="submit" disabled={isPending || filesTooLarge}>
        {buttonText}
      </button>
    </form>
  );
};
