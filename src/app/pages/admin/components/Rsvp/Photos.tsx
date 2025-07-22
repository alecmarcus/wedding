"use client";

import { Image } from "@@/components/Image";
import { link } from "@@/navigation";
import { useCallback } from "react";
import { useDeletePhotoRequest } from "@/app/features/rsvp/photo/hooks";
import type { Photo } from "@/db";

const PhotoItem = ({
  id,
  fileName,
  createdAt,
  uploaderName,
  uploadToken,
}: Pick<Photo, "id" | "fileName" | "createdAt" | "uploaderName"> & {
  uploadToken: string;
}) => {
  const [deletePhoto, { isPending: isDeletingPhoto }] = useDeletePhotoRequest();

  const handleDeletePhoto = useCallback(() => {
    if (window.confirm("Are you sure you want to delete this photo?")) {
      deletePhoto([
        {
          id,
        },
        {
          uploadToken,
        },
      ]);
    }
  }, [
    deletePhoto,
    id,
    uploadToken,
  ]);

  return (
    <div key={id}>
      <Image
        src={link("/photo/:fileName", {
          fileName,
        })}
        alt={`Uploaded by ${uploaderName}`}
      />
      <p>Uploaded on {new Date(createdAt).toLocaleDateString()}</p>
      <button
        type="button"
        onClick={handleDeletePhoto}
        disabled={isDeletingPhoto}
      >
        {isDeletingPhoto ? "Deleting..." : "Delete Photo"}
      </button>
    </div>
  );
};

export const PhotoGroup = ({
  photos,
  uploadToken,
}: {
  photos: Photo[];
  uploadToken: string;
}) => {
  return photos.map(photo => (
    <PhotoItem {...photo} key={photo.id} uploadToken={uploadToken} />
  ));
};
