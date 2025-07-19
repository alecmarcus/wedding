"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
import { sendBulkEmail } from "./actions";
import { resendConfirmationEmail } from "./functions";

export const useResendConfirmation = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async (rsvpId: string) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await resendConfirmationEmail(rsvpId);

      if (result.success) {
        setIsSuccess(true);
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : JSON.stringify(error);
      setError(`Failed to resend email: ${errorMessage}`);
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

export const useBulkEmailAction = (
  initial: Parameters<typeof sendBulkEmail>[0]
) => {
  const [state, action, isPending] = useActionState(sendBulkEmail, initial);

  return [
    action,
    {
      ...state,
      isPending,
    },
  ] as const;
};
