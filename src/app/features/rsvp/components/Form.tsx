"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { Image } from "@/app/components/Image";
import { ONE_KiB, ONE_MiB, sec } from "@/app/constants";
import { link } from "@/app/navigation";
import type { Photo } from "@/db";
import type { ActionState } from "../actions";
import { RSVP_FIELDS } from "../fields";
import { useRsvpAction } from "../hooks";
import { deletePhoto } from "../photo/functions";

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

  const [selectedPhotos, setSelectedPhotos] = useState<
    {
      src: string;
      size: number;
      id: null;
      name: string;
    }[]
  >([]);
  const [existingPhotos, removeExistingPhoto] = useReducer(
    (
      state,
      {
        id,
      }: {
        id: string;
      }
    ) => {
      void deletePhoto({
        id,
      });
      return state.filter(item => item.id !== id);
    },
    initialRsvp?.photos?.successes,
    (photos: Photo[] | undefined) =>
      (photos || []).map(({ fileName, id }) => ({
        src: link("/photo/:fileName", {
          fileName,
        }),
        size: null,
        name: fileName,
        id,
      }))
  );
  const allPhotos = [
    ...(existingPhotos || []),
    ...selectedPhotos,
  ];
  const tooManyFiles = allPhotos.length > RSVP_FIELDS.photos.maxLength;
  const aFileIsTooLarge = allPhotos.some(
    ({ size }) => size && size > RSVP_FIELDS.photos.maxSize
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) {
        return;
      }

      const selected: typeof selectedPhotos = [];
      for (const file of files) {
        selected.push({
          src: URL.createObjectURL(file),
          // src: file.webkitRelativePath,
          size: getFileSize(file.size).mib,
          name: file.name,
          id: null,
        });
      }

      setSelectedPhotos(existing => {
        // Must be done manually when no longer needed
        // @see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#memory_management
        for (const { src } of existing) {
          URL.revokeObjectURL(src);
        }

        return selected;
      });
    },
    []
  );

  const removePhoto = useCallback(
    ({ name, id }: { name: string | null; id: string | null }) => {
      if (id) {
        removeExistingPhoto({
          id,
        });
      } else {
        const input = fileInputRef.current;

        if (name && input?.files) {
          const remaining = new DataTransfer();
          for (const existingFile of input.files) {
            if (name !== existingFile.name) {
              remaining.items.add(existingFile);
            }
          }
          input.files = remaining.files;
          setSelectedPhotos(existing => {
            const remaining: typeof existing = [];
            // Must be done manually when no longer needed
            // @see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#memory_management
            for (const existingFile of existing) {
              if (name !== existingFile.name) {
                remaining.push(existingFile);
              }
              URL.revokeObjectURL(existingFile.src);
            }

            return remaining;
          });
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
        {allPhotos?.map(({ src, size, id, name }) => {
          const tooLarge = size && size > RSVP_FIELDS.photos.maxSize;
          const remove = () =>
            removePhoto({
              name,
              id,
            });
          return (
            <div key={src}>
              <button type="button" onClick={remove}>
                Remove
              </button>
              <Image src={src} alt="Uploaded photo" />
              {tooLarge && (
                <span>
                  File size {size} exceeds limit of {RSVP_FIELDS.photos.maxSize}
                </span>
              )}
            </div>
          );
        })}
        <label htmlFor={RSVP_FIELDS.photos.name}>
          Upload photos
          <input
            type="file"
            accept={RSVP_FIELDS.photos.mimeType.join(", ")}
            disabled={isPending}
            id={RSVP_FIELDS.photos.name}
            max={RSVP_FIELDS.photos.maxLength}
            multiple={true}
            name={RSVP_FIELDS.photos.name}
            onChange={onFileInputChange}
            ref={fileInputRef}
          />
        </label>
      </div>

      {/* {onCancelUpdating && submissionType === "update" && (
        <button type="button" disabled={isPending} onClick={onCancelUpdating}>
          Cancel
        </button>
      )} */}
      <button
        type="submit"
        disabled={isPending || aFileIsTooLarge || tooManyFiles}
      >
        {buttonText}
      </button>
    </form>
  );
};
