import { useCallback, useState, useTransition } from "react";
import { deleteRsvp, updateRsvpData } from "./actions";

export const useDeleteRsvp = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async (rsvpId: string) => {
    try {
      setError(null);
      const result = await deleteRsvp(rsvpId);

      if (!result.success) {
        setError(result.error || "Failed to delete RSVP");
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete RSVP";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
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
      isPending,
      error,
    },
  ] as const;
};

export const useUpdateRsvp = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const transition = useCallback(
    async (rsvpId: string, data: Parameters<typeof updateRsvpData>[1]) => {
      try {
        setError(null);
        setIsSuccess(false);
        const result = await updateRsvpData(rsvpId, data);

        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.error || "Failed to update RSVP");
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update RSVP";
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
    ({
      rsvpId,
      data,
    }: {
      rsvpId: string;
      data: Parameters<typeof updateRsvpData>[1];
    }) => {
      startTransition(async () => {
        await transition(rsvpId, data);
      });
    },
    [
      transition,
    ]
  );

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
  }, []);

  return [
    action,
    {
      isPending,
      error,
      isSuccess,
      reset,
    },
  ] as const;
};
