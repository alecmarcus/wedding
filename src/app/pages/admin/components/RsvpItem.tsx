"use client";

import { Image } from "@@/components/Image";
import { useCallback, useMemo, useState } from "react";
import { RsvpForm } from "@/app/features/rsvp/Form";
import type { Photo, Rsvp } from "@/db";
import { useResendConfirmation } from "../email/hooks";
import { useDeletePhoto } from "../photo/hooks";
import { useDeleteRsvp } from "../rsvp/hooks";

type RsvpWithPhotos = Rsvp & {
  photos: Pick<Photo, "id" | "filename" | "createdAt">[];
};

export const RsvpItem = ({ rsvp }: { rsvp: RsvpWithPhotos }) => {
  const [isEditing, setIsEditing] = useState(false);
  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);
  const stopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  const [
    deleteRsvp,
    {
      isPending: isDeletingRsvp,
      isSuccess: isDeletedRsvp,
      error: errorDeletingRsvp,
    },
  ] = useDeleteRsvp();
  const [resendConfirmation, { isPending: isResendingConfirmation }] =
    useResendConfirmation();

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
        rsvpId: rsvp.id,
      });
    }
  }, [
    deleteRsvp,
    rsvp.id,
  ]);

  const handleResendConfirmation = useCallback(() => {
    resendConfirmation({
      rsvpId: rsvp.id,
    });
  }, [
    resendConfirmation,
    rsvp.id,
  ]);

  const [showPhotos, setShowPhotos] = useState(false);
  const [deletePhoto, { isPending: isDeletingPhoto }] = useDeletePhoto();

  const handleDeletePhoto = useCallback(
    (photoId: string) => {
      if (window.confirm("Are you sure you want to delete this photo?")) {
        deletePhoto({
          photoId,
        });
      }
    },
    [
      deletePhoto,
    ]
  );

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
        <p>Photos Uploaded: {rsvp.photos.length}</p>

        <div>
          <button type="button" onClick={startEditing} disabled={isEditing}>
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
            disabled={isResendingConfirmation || isEditing}
          >
            {isResendingConfirmation ? "Sending..." : "Resend Confirmation"}
          </button>
          {rsvp.photos.length > 0 && (
            <button type="button" onClick={() => setShowPhotos(!showPhotos)}>
              {showPhotos ? "Hide Photos" : "View Photos"}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <RsvpForm
          rsvp={rsvp}
          onDoneEditing={stopEditing}
          onCancelUpdating={stopEditing}
        />
      )}

      {showPhotos && rsvp.photos.length > 0 && (
        <div>
          <h4>Uploaded Photos ({rsvp.photos.length})</h4>
          {rsvp.photos.map(photo => (
            <div key={photo.id}>
              <Image
                src={`/api/photos/${photo.filename}`}
                alt={`Uploaded by ${rsvp.name}`}
              />
              <p>Uploaded: {new Date(photo.createdAt).toLocaleDateString()}</p>
              <button
                type="button"
                onClick={() => handleDeletePhoto(photo.id)}
                disabled={isDeletingPhoto}
              >
                {isDeletingPhoto ? "Deleting..." : "Delete Photo"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
