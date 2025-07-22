import { PhotoItem } from "@@/features/rsvp/photo/components/Item";
import type { Photo } from "@/db";

type PhotoGalleryProps = {
  photos: Photo[];
};

export const PhotoGallery = ({ photos }: PhotoGalleryProps) => {
  if (photos.length === 0) {
    return (
      <div>
        <h2>Wedding Photos</h2>
        <p>No photos have been uploaded yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Wedding Photos</h2>
      <div>
        {photos.map(photo => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            showUploader={true}
            showDate={false}
          />
        ))}
      </div>
    </div>
  );
};
