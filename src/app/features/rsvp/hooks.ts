"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import type { Rsvp } from "@/db";
import { rsvp } from "./actions";
import { deleteRsvp, getRsvpByToken } from "./functions";

export const useGetRsvpByTokenRequest = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Rsvp | null>(null);

  const transition = useCallback(async ({ token }: { token: string }) => {
    try {
      setError(null);
      setIsSuccess(false);
      setData(null);

      const result = await getRsvpByToken({
        token,
      });

      if (!result.isSuccess) {
        throw new Error(result.error || "Unknown error");
      }

      setIsSuccess(true);
      setData(result.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : error;
      setError(`Failed to get RSVP: ${errorMessage}`);
    }
  }, []);

  const request = useCallback(
    ({ token }: { token: string }) => {
      startTransition(async () => {
        await transition({
          token,
        });
      });
    },
    [
      transition,
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

export const useDeleteRsvpRequest = () => {
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

export const useRsvpAction = (initial: Parameters<typeof rsvp>[0]) => {
  const [state, request, isPending] = useActionState(rsvp, initial);

  return [
    request,
    {
      ...state,
      isPending,
    },
  ] as const;
};
