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

/** @deprecated Convert to useActionState */
export const useUploadPhoto = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<{
    id: string;
    fileName: string;
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
  const [data, setData] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(
    async ({ uploadToken }: { uploadToken: string | null }) => {
      try {
        setIsSuccess(false);
        setError(null);

        if (!uploadToken) {
          throw new Error("No upload token provided");
        }

        const result = await getPhotosByRsvp({
          uploadToken,
        });

        if (result.isSuccess && result.data) {
          setData(result.data);
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

  const request = useCallback(
    ({ uploadToken }: { uploadToken: string | null }) => {
      startTransition(async () => {
        await action({
          uploadToken,
        });
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

  const action = useCallback(async ({ id }: { id: string }) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await deletePhoto({
        id,
      });

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
  }, []);

  const request = useCallback(
    ({ id }: { id: string }) => {
      startTransition(async () => {
        await action({
          id,
        });
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
