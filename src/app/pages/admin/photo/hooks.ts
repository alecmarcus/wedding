import { useCallback, useState, useTransition } from "react";
import { deletePhoto } from "./functions";

export const useDeletePhoto = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async (photoId: string) => {
    try {
      setError(null);
      const result = await deletePhoto(photoId);

      if (!result.success) {
        setError(result.error || "Failed to delete photo");
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete photo";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const action = useCallback(
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
    action,
    {
      isPending,
      error,
    },
  ] as const;
};
