"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import type { Rsvp } from "@/db";
import { rsvp } from "./actions";
import { deleteRsvp, getRsvpByEditToken } from "./functions";

export const useGetRsvpByEditTokenRequest = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Rsvp | null>(null);

  const transition = useCallback(
    async ({ editToken }: { editToken: string }) => {
      try {
        setError(null);
        setIsSuccess(false);
        setData(null);

        const result = await getRsvpByEditToken({
          editToken,
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
    },
    []
  );

  const request = useCallback(
    ({ editToken }: { editToken: string }) => {
      startTransition(async () => {
        await transition({
          editToken,
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

  const transition = useCallback(async ({ id }: { id: string }) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await deleteRsvp({
        id,
      });

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
    ({ id }: { id: string }) => {
      startTransition(async () => {
        await transition({
          id,
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
