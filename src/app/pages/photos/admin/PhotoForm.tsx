"use client";

import { useAdminUploadPhotosAction } from "@@/features/rsvp/photo/hooks";
import { useRef } from "react";
import {
  PhotoInput,
  type PhotoInputHandle,
} from "@/app/features/rsvp/photo/components/Input";
import type { Photo } from "@/db";

export const AdminPhotoForm = ({
  uploadedPhotos,
}: {
  uploadedPhotos: Photo[];
}) => {
  const [action, { isPending }] = useAdminUploadPhotosAction({
    error: null,
    isSuccess: null,
    data: {
      failureCount: 0,
      failures: [],
      successCount: uploadedPhotos.length,
      successes: uploadedPhotos,
      total: uploadedPhotos.length,
    },
  });

  const photoInputRef = useRef<PhotoInputHandle>(null);
  const hasError = Object.entries(photoInputRef.current?.errors || []).some(
    e => e
  );

  return (
    <form action={action}>
      <PhotoInput isPending={isPending} uploadedPhotos={uploadedPhotos} />
      <button type="submit" disabled={hasError}>
        Upload
      </button>
    </form>
  );
};
