"use client";

import { useActionState, useCallback, useState, useTransition } from "react";

import { rsvp } from "./actions";
import { deleteRsvp } from "./functions";

export const useDeleteRsvpRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(async ({ id }: { id: string }) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await deleteRsvp({
        id,
      });

      if (result.isSuccess) {
        setIsSuccess(true);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete RSVP";
      setError(errorMessage);
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

export const useRsvpAction = (initial: Parameters<typeof rsvp>[0]) => {
  const [state, action, isPending] = useActionState(rsvp, initial);

  return [
    action,
    {
      ...state,
      isPending,
    },
  ] as const;
};
