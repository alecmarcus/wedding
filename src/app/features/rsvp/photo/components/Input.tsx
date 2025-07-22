import { Image } from "@@/components/Image";
import { useImperativeHandle } from "react";
import type { Photo } from "@/db";
import { UPLOAD_PHOTOS_FIELDS } from "../fields";
import { useManagePhotos } from "../hooks";

export type PhotoInputHandle = ReturnType<typeof useManagePhotos>;

export const PhotoInput = ({
  uploadedPhotos,
  isPending,
  ref,
}: {
  uploadedPhotos: Photo[];
  isPending: boolean;
  ref?: React.Ref<PhotoInputHandle>;
}) => {
  const photoMgmt = useManagePhotos({
    uploadedPhotos,
  });

  useImperativeHandle(ref, () => photoMgmt, [
    photoMgmt,
  ]);

  return (
    <div>
      {photoMgmt.state.allPhotos.map(({ src, size, id, name }) => {
        const tooLarge = size && size > UPLOAD_PHOTOS_FIELDS.photos.maxSize;
        const remove = () =>
          photoMgmt.handlers.removePhoto(
            id
              ? {
                  id,
                }
              : {
                  name,
                }
          );
        return (
          <div key={src}>
            <button type="button" onClick={remove}>
              Remove
            </button>
            <Image src={src} alt="Uploaded photo" />
            {tooLarge && (
              <span>
                File size {size} exceeds limit of{" "}
                {UPLOAD_PHOTOS_FIELDS.photos.maxSize}
              </span>
            )}
          </div>
        );
      })}
      <label htmlFor={UPLOAD_PHOTOS_FIELDS.photos.name}>
        Upload photos
        <input
          type="file"
          accept={UPLOAD_PHOTOS_FIELDS.photos.mimeType.join(", ")}
          disabled={isPending}
          id={UPLOAD_PHOTOS_FIELDS.photos.name}
          max={UPLOAD_PHOTOS_FIELDS.photos.maxLength}
          multiple={true}
          name={UPLOAD_PHOTOS_FIELDS.photos.name}
          onChange={photoMgmt.handlers.inputChange}
          ref={photoMgmt.inputRef}
        />
      </label>
    </div>
  );
};
