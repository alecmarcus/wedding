import { Image } from "@@/components/Image";
import { link } from "@/app/navigation";
import type { Photo } from "@/db";

type Props = {
  photo: Photo;
  showUploader?: boolean;
  showDate?: boolean;
};

export const PhotoItem = ({
  photo,
  showUploader = true,
  showDate = true,
}: Props) => {
  const src = link("/photo/:fileName", {
    fileName: photo.fileName,
  });

  const created = new Date(photo.createdAt).toLocaleDateString();
  const alt = `Uploaded${
    photo.uploaderName ? ` by ${photo.uploaderName}` : ""
  } on ${created}`;

  return (
    <div>
      <Image src={src} alt={alt} />
      {showUploader && photo.uploaderName && (
        <p>Uploaded by: {photo.uploaderName}</p>
      )}
      {showDate && <p>Uploaded: {created}</p>}
    </div>
  );
};
