"use client";

import { useCallback, useState, useTransition } from "react";
import { submitRsvp, updateRsvp } from "./actions";

export const useSubmitRsvp = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async (formData: FormData) => {
    try {
      setError(null);
      const result = await submitRsvp(formData);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Something went wrong");
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit RSVP";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const action = useCallback(
    (formData: FormData) => {
      startTransition(async () => {
        await transition(formData);
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
      isSuccess,
      error,
      reset,
    },
  ] as const;
};

export const useUpdateRsvp = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(
    async (editToken: string, formData: FormData) => {
      try {
        setError(null);
        const result = await updateRsvp(editToken, formData);

        if (result.success) {
          setIsSuccess(true);
        } else {
          setError(result.error || "Something went wrong");
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
    (editToken: string, formData: FormData) => {
      startTransition(async () => {
        await transition(editToken, formData);
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
      isSuccess,
      error,
      reset,
    },
  ] as const;
};
