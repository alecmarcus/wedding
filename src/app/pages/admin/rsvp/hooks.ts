import { useCallback, useState, useTransition } from "react";
import { deleteRsvp } from "./functions";

export const useDeleteRsvp = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async (rsvpId: string) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await deleteRsvp(rsvpId);

      if (!result.isSuccess) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete RSVP";
      setError(errorMessage);
    }
  }, []);

  const action = useCallback(
    ({ rsvpId }: { rsvpId: string }) => {
      startTransition(async () => {
        await transition(rsvpId);
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
