"use client";

import { useRef } from "react";
import type { Photo } from "@/db";
import { useUploadPhotosAction } from "../hooks";
import { PhotoInput, type PhotoInputHandle } from "./Input";

export const PhotoForm = ({
  uploadedPhotos,
  uploadToken,
}: {
  uploadedPhotos: Photo[];
  uploadToken: string;
}) => {
  const [action, { isPending }] = useUploadPhotosAction({
    error: null,
    isSuccess: null,
    uploadToken,
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
