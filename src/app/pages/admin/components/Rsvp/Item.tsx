"use client";

import { useResendConfirmationRequest } from "@@/features/email/hooks";
import { RsvpForm } from "@@/features/rsvp/components/Form";
import { useDeleteRsvpRequest } from "@@/features/rsvp/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { sec } from "@/constants";
import type { Photo, Rsvp } from "@/db";
import { PhotoGroup } from "./Photos";

export const RsvpItem = ({
  rsvp,
  photos,
}: {
  rsvp: Rsvp;
  photos: Photo[] | null;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleIsEditing = useCallback(() => {
    setIsEditing(e => !e);
  }, []);

  const [
    deleteRsvp,
    {
      isPending: isDeletingRsvp,
      isSuccess: isDeletedRsvp,
      error: errorDeletingRsvp,
    },
  ] = useDeleteRsvpRequest();
  const [
    resendConfirmation,
    {
      isPending: isResendPending,
      isSuccess: isResendSuccess,
      error: resendError,
    },
  ] = useResendConfirmationRequest();

  const deleteRsvpText = useMemo(() => {
    if (isDeletingRsvp) {
      return "Deleting...";
    }
    if (isDeletedRsvp) {
      return "Deleted";
    }
    if (errorDeletingRsvp) {
      return "Error deleting";
    }
    return "Delete";
  }, [
    isDeletingRsvp,
    isDeletedRsvp,
    errorDeletingRsvp,
  ]);

  const handleDeleteRsvp = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this RSVP?")) {
      deleteRsvp({
        id: rsvp.id,
      });
    }
  }, [
    deleteRsvp,
    rsvp.id,
  ]);

  const handleResendConfirmation = useCallback(() => {
    resendConfirmation({
      id: rsvp.id,
    });
  }, [
    resendConfirmation,
    rsvp.id,
  ]);

  const [resendConfirmationText, setResendConfirmationText] = useState<
    null | string
  >(null);
  useEffect(() => {
    if (!isResendPending && (isResendSuccess || resendError)) {
      setResendConfirmationText(isResendSuccess ? "Sent" : resendError);
      const timeout = setTimeout(() => {
        setResendConfirmationText(null);
      }, sec(1));

      return () => clearTimeout(timeout);
    }
  }, [
    isResendPending,
    isResendSuccess,
    resendError,
  ]);

  const [showPhotos, setShowPhotos] = useState(false);

  const guestCount = rsvp.plusOne ? 2 : 1;

  return (
    <div>
      <div>
        <h3>
          {rsvp.name} ({guestCount} {guestCount === 1 ? "guest" : "guests"})
        </h3>
        <p>
          Email:
          <a href={`mailto:${rsvp.email}`}>{rsvp.email}</a>
        </p>
        {rsvp.plusOne && <p>Plus One: {rsvp.plusOneName || "Yes"}</p>}
        {rsvp.dietaryRestrictions && (
          <p>Dietary Restrictions: {rsvp.dietaryRestrictions}</p>
        )}
        {rsvp.message && <p>Message: {rsvp.message}</p>}
        <p>RSVP Date: {new Date(rsvp.createdAt).toLocaleDateString()}</p>
        {photos && photos.length > 0 && <p>Photos Uploaded: {photos.length}</p>}

        <div>
          <button type="button" onClick={toggleIsEditing} disabled={isEditing}>
            Edit
          </button>
          <button
            type="button"
            onClick={handleDeleteRsvp}
            disabled={isDeletingRsvp || isEditing}
          >
            {deleteRsvpText}
          </button>
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={isResendPending || isEditing}
          >
            {isResendPending ? "Sending..." : "Resend Confirmation"}
          </button>
          {resendConfirmationText}
          {photos && photos.length > 0 && (
            <button type="button" onClick={() => setShowPhotos(show => !show)}>
              {showPhotos ? "Hide Photos" : "View Photos"}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <RsvpForm
          rsvp={{
            ...rsvp,
            photos: null,
          }}
          onDoneEditing={toggleIsEditing}
          error={null}
          onCancelUpdating={toggleIsEditing}
        />
      )}

      {showPhotos && photos && photos.length > 0 && (
        <PhotoGroup photos={photos} uploadToken={rsvp.uploadToken} />
      )}
    </div>
  );
};
