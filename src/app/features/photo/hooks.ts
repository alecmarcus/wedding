"use client";

import {
  useCallback,
  // useEffect,
  useState,
  useTransition,
} from "react";
import type {
  Photo,
  // Rsvp
} from "@/db";
import {
  deletePhoto,
  getPhotosByRsvp,
  // getRsvpByUploadToken,
  uploadPhoto,
} from "./functions";

// type RsvpInfo = Pick<Rsvp, "id" | "name" | "email">;

// export const useGetRsvpInfo = (token: string | null) => {
//   const [rsvpInfo, setRsvpInfo] = useState<RsvpInfo | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchRsvp = async () => {
//       if (!token) {
//         setError("No token provided");
//         setIsLoading(false);
//         return;
//       }

//       try {
//         const result = await getRsvpByUploadToken(token);
//         if (result.success && result.data) {
//           setRsvpInfo(result.data);
//           setError(null);
//         } else {
//           setError(result.error || "Failed to verify upload token");
//         }
//       } catch {
//         setError("Failed to verify upload token");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     void fetchRsvp();
//   }, [
//     token,
//   ]);

//   return {
//     rsvpInfo,
//     isLoading,
//     error,
//   };
// };

//
// Convert to action & useActionState
//
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

        if (result.isSuccess && result.data) {
          setIsSuccess(true);
          setUploadedPhoto(result.data);
        } else {
          throw new Error(result.error || "Unknown error");
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

export const useGetPhotos = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const transition = useCallback(
    async ({ uploadToken }: { uploadToken: string | null }) => {
      setIsSuccess(false);

      if (!uploadToken) {
        setError("No token provided");
        return;
      }

      setError(null);

      try {
        const result = await getPhotosByRsvp(uploadToken);
        if (result.success && result.data) {
          setPhotos(result.data);
        } else {
          throw new Error(result.error || "Failed to load photos");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setError(`Failed to load photos: ${errorMessage}`);
      }
    },
    []
  );

  const action = useCallback(
    ({ uploadToken }: { uploadToken: string | null }) => {
      startTransition(async () => {
        await transition({
          uploadToken,
        });
      });
    },
    [
      transition,
    ]
  );

  return [
    action,
    {
      data: photos,
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useDeletePhotoRequest = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async (photoId: string) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await deletePhoto(photoId);

      if (result.success) {
        setIsSuccess(true);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      setError(`Failed to delete photo: ${errorMessage}`);
    }
  }, []);

  const request = useCallback(
    ({ photoId }: { photoId: string }) => {
      startTransition(async () => {
        await transition(photoId);
      });
    },
    [
      transition,
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
