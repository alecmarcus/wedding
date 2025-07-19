import { useCallback, useState, useTransition } from "react";
import { deletePhoto } from "./functions";

export const useDeletePhoto = () => {
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
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};
