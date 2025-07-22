"use client";

import { Image } from "@@/components/Image";
import { deletePhoto } from "@@/features/rsvp/photo/functions";
import { link } from "@@/navigation";
import type { Photo } from "@/db";

const PhotoGroupItem = ({
  id,
  fileName,
  uploadToken,
}: Photo & {
  uploadToken: string;
}) => {
  const remove = () => {
    void deletePhoto(
      {
        id,
      },
      {
        uploadToken,
      }
    );
  };

  const src = link("/photo/:fileName", {
    fileName,
  });

  return (
    <div>
      <button type="button" onClick={remove}>
        Remove
      </button>
      <Image src={src} alt="Uploaded photo" />
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
    <PhotoGroupItem {...photo} key={photo.id} uploadToken={uploadToken} />
  ));
};
