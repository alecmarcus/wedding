"use client";

import { Image } from "@@/components/Image";
import { useState } from "react";
import type { Photo, Rsvp } from "@/db";
import { useResendConfirmation } from "../email/hooks";
import { useDeletePhoto } from "../photo/hooks";
import { useDeleteRsvp, useUpdateRsvp } from "../rsvp/hooks";

type RsvpWithPhotos = Rsvp & {
  photos: Pick<Photo, "id" | "filename" | "createdAt">[];
};

type RsvpListProps = {
  rsvps: RsvpWithPhotos[];
};

type RsvpItemProps = {
  rsvp: RsvpWithPhotos;
};

const RsvpItem = ({ rsvp }: RsvpItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [editData, setEditData] = useState({
    name: rsvp.name,
    email: rsvp.email,
    plusOne: rsvp.plusOne,
    plusOneName: rsvp.plusOneName || "",
    dietaryRestrictions: rsvp.dietaryRestrictions || "",
    message: rsvp.message || "",
  });

  const [deleteRsvp, { isPending: isDeleting }] = useDeleteRsvp();
  const [resendConfirmation, { isPending: isResending }] =
    useResendConfirmation();
  const [updateRsvp, { isPending: isUpdating }] = useUpdateRsvp();
  const [deletePhoto, { isPending: isDeletingPhoto }] = useDeletePhoto();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this RSVP?")) {
      deleteRsvp({
        rsvpId: rsvp.id,
      });
    }
  };

  const handleResend = () => {
    resendConfirmation({
      rsvpId: rsvp.id,
    });
  };

  const handleUpdate = () => {
    updateRsvp({
      rsvpId: rsvp.id,
      data: {
        name: editData.name,
        email: editData.email,
        plusOne: editData.plusOne,
        plusOneName: editData.plusOne ? editData.plusOneName : null,
        dietaryRestrictions: editData.dietaryRestrictions || null,
        message: editData.message || null,
      },
    });
    setIsEditing(false);
  };

  const handleDeletePhoto = (photoId: string) => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      deletePhoto({
        photoId,
      });
    }
  };

  const guestCount = rsvp.plusOne ? 2 : 1;

  return (
    <div>
      <div>
        <h3>
          {rsvp.name} ({guestCount} {guestCount === 1 ? "guest" : "guests"})
        </h3>
        <p>Email: {rsvp.email}</p>
        {rsvp.plusOne && <p>Plus One: {rsvp.plusOneName || "Yes"}</p>}
        {rsvp.dietaryRestrictions && (
          <p>Dietary Restrictions: {rsvp.dietaryRestrictions}</p>
        )}
        {rsvp.message && <p>Message: {rsvp.message}</p>}
        <p>RSVP Date: {new Date(rsvp.createdAt).toLocaleDateString()}</p>
        <p>Photos Uploaded: {rsvp.photos.length}</p>

        <div>
          <button type="button" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>
          <button type="button" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button type="button" onClick={handleResend} disabled={isResending}>
            {isResending ? "Sending..." : "Resend Confirmation"}
          </button>
          <a href={`mailto:${rsvp.email}`}>Send Email</a>
          {rsvp.photos.length > 0 && (
            <button type="button" onClick={() => setShowPhotos(!showPhotos)}>
              {showPhotos ? "Hide Photos" : "View Photos"}
            </button>
          )}
        </div>
      </div>

      {isEditing && (
        <div>
          <h4>Edit RSVP</h4>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={editData.name}
                onChange={e =>
                  setEditData({
                    ...editData,
                    name: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                value={editData.email}
                onChange={e =>
                  setEditData({
                    ...editData,
                    email: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={editData.plusOne}
                onChange={e =>
                  setEditData({
                    ...editData,
                    plusOne: e.target.checked,
                  })
                }
              />
              Plus One
            </label>
          </div>
          {editData.plusOne && (
            <div>
              <label>
                Plus One Name:
                <input
                  type="text"
                  value={editData.plusOneName}
                  onChange={e =>
                    setEditData({
                      ...editData,
                      plusOneName: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          )}
          <div>
            <label>
              Dietary Restrictions:
              <textarea
                value={editData.dietaryRestrictions}
                onChange={e =>
                  setEditData({
                    ...editData,
                    dietaryRestrictions: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div>
            <label>
              Message:
              <textarea
                value={editData.message}
                onChange={e =>
                  setEditData({
                    ...editData,
                    message: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <button type="button" onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Save Changes"}
          </button>
        </div>
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

export const RsvpList = ({ rsvps }: RsvpListProps) => {
  if (rsvps.length === 0) {
    return <p>No RSVPs yet.</p>;
  }

  return (
    <div>
      {rsvps.map(rsvp => (
        <RsvpItem key={rsvp.id} rsvp={rsvp} />
      ))}
    </div>
  );
};
