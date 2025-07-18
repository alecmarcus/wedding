"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import type { Photo, Rsvp } from "@/db";
import { getPhotosByRsvp, getRsvpByUploadToken, uploadPhoto } from "./actions";

type RsvpInfo = Pick<Rsvp, "id" | "name" | "email">;

export const useGetRsvpInfo = (token: string | null) => {
  const [rsvpInfo, setRsvpInfo] = useState<RsvpInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRsvp = async () => {
      if (!token) {
        setError("No token provided");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getRsvpByUploadToken(token);
        if (result.success && result.data) {
          setRsvpInfo(result.data);
          setError(null);
        } else {
          setError(result.error || "Failed to verify upload token");
        }
      } catch {
        setError("Failed to verify upload token");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRsvp();
  }, [
    token,
  ]);

  return {
    rsvpInfo,
    isLoading,
    error,
  };
};

export const useUploadPhoto = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<{
    id: string;
    filename: string;
  } | null>(null);

  const transition = useCallback(
    async (uploadToken: string, formData: FormData) => {
      try {
        setError(null);
        const result = await uploadPhoto(uploadToken, formData);

        if (result.success && result.data) {
          setIsSuccess(true);
          setUploadedPhoto(result.data);
        } else {
          setError(result.error || "Failed to upload photo");
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload photo";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  const action = useCallback(
    (uploadToken: string, formData: FormData) => {
      startTransition(async () => {
        await transition(uploadToken, formData);
      });
    },
    [
      transition,
    ]
  );

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setUploadedPhoto(null);
  }, []);

  return [
    action,
    {
      isPending,
      isSuccess,
      error,
      uploadedPhoto,
      reset,
    },
  ] as const;
};

export const useGetPhotos = (uploadToken: string | null) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    if (!uploadToken) {
      setError("No token provided");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await getPhotosByRsvp(uploadToken);
      if (result.success && result.data) {
        setPhotos(result.data);
        setError(null);
      } else {
        setError(result.error || "Failed to load photos");
      }
    } catch (err) {
      setError("Failed to load photos");
    } finally {
      setIsLoading(false);
    }
  }, [
    uploadToken,
  ]);

  useEffect(() => {
    void fetchPhotos();
  }, [
    fetchPhotos,
  ]);

  return {
    photos,
    isLoading,
    error,
    refetch: fetchPhotos,
  };
};
