"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import type { Photo } from "@/db";
import { uploadPhotos } from "./actions";
import { deletePhoto, getPhotosByRsvp } from "./functions";

export const useUploadPhotosAction = (
  initial: Parameters<typeof uploadPhotos>[0]
) => {
  const [state, action, isPending] = useActionState(uploadPhotos, initial);

  return [
    action,
    {
      ...state,
      isPending,
    },
  ] as const;
};

export const useGetPhotosByRsvpRequest = () => {
  const [data, setData] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(
    async (where: Parameters<typeof getPhotosByRsvp>[0]) => {
      try {
        setIsSuccess(false);
        setError(null);

        const result = await getPhotosByRsvp(where);

        if (result.isSuccess && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setError(`Failed to load photos: ${errorMessage}`);
      }
    },
    []
  );

  const request = useCallback(
    (where: Parameters<typeof getPhotosByRsvp>[0]) => {
      startTransition(async () => {
        await action(where);
      });
    },
    [
      action,
    ]
  );

  return [
    request,
    {
      data,
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useDeletePhotoRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(
    async (where: Parameters<typeof deletePhoto>[0]) => {
      try {
        setError(null);
        setIsSuccess(false);

        const result = await deletePhoto(where);

        if (result.isSuccess) {
          setIsSuccess(true);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setError(`Failed to delete photo: ${errorMessage}`);
      }
    },
    []
  );

  const request = useCallback(
    (where: Parameters<typeof deletePhoto>[0]) => {
      startTransition(async () => {
        await action(where);
      });
    },
    [
      action,
    ]
  );

  return [
    request,
    {
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};
