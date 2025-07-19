"use client";

import { resendConfirmationEmail } from "@@/features/email/functions";
import { useActionState, useCallback, useState, useTransition } from "react";
import { sendBulkEmail } from "./actions";

export const useResendConfirmationRequest = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async ({ id }: { id: string }) => {
    try {
      setError(null);
      setIsSuccess(false);

      const result = await resendConfirmationEmail({
        id,
      });

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

  const request = useCallback(
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
    request,
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
  const [state, request, isPending] = useActionState(sendBulkEmail, initial);

  return [
    request,
    {
      ...state,
      isPending,
    },
  ] as const;
};
