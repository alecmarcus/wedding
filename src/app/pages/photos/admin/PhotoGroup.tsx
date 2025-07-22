"use client";

import { Image } from "@@/components/Image";
import { deletePhotoAdmin } from "@@/features/rsvp/photo/functions";
import { link } from "@@/navigation";
import type { Photo } from "@/db";

const PhotoGroupItem = ({ id, fileName }: Photo) => {
  const remove = () => {
    void deletePhotoAdmin({
      id,
    });
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

export const PhotoGroup = ({ photos }: { photos: Photo[] }) => {
  return photos.map(photo => <PhotoGroupItem {...photo} key={photo.id} />);
};
