import { Image } from "@@/components/Image";
import type { Photo } from "@/db";

type PhotoItemProps = {
  photo: Photo;
  showUploader?: boolean;
  showDate?: boolean;
};

export const PhotoItem = ({
  photo,
  showUploader = true,
  showDate = true,
}: PhotoItemProps) => {
  return (
    <div>
      <Image
        src={`/api/photos/${photo.filename}`}
        alt={`Uploaded${
          photo.uploaderName ? ` by ${photo.uploaderName}` : ""
        } on ${new Date(photo.createdAt).toLocaleDateString()}`}
      />
      {showUploader && photo.uploaderName && (
        <p>Uploaded by: {photo.uploaderName}</p>
      )}
      {showDate && (
        <p>Uploaded: {new Date(photo.createdAt).toLocaleDateString()}</p>
      )}
    </div>
  );
};
