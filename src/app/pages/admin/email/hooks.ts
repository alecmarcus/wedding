import { useCallback, useState, useTransition } from "react";
import { resendConfirmationEmail, sendBulkEmailToGuests } from "./functions";

export const useResendConfirmation = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const transition = useCallback(async (rsvpId: string) => {
    try {
      setError(null);
      setIsSuccess(false);
      const result = await resendConfirmationEmail(rsvpId);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Failed to resend email");
      }

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend email";
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

export const useSendBulkEmail = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<{
    totalSent: number;
    successCount: number;
    failureCount: number;
  } | null>(null);

  const transition = useCallback(async (subject: string, content: string) => {
    try {
      setError(null);
      setIsSuccess(false);
      const response = await sendBulkEmailToGuests(subject, content);

      if (response.success && response.data) {
        setIsSuccess(true);
        setResult({
          totalSent: response.data.totalSent,
          successCount: response.data.successCount,
          failureCount: response.data.failureCount,
        });
      } else {
        setError(response.error || "Failed to send bulk email");
      }

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send bulk email";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const action = useCallback(
    ({ subject, content }: { subject: string; content: string }) => {
      startTransition(async () => {
        await transition(subject, content);
      });
    },
    [
      transition,
    ]
  );

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setResult(null);
  }, []);

  return [
    action,
    {
      isPending,
      error,
      isSuccess,
      result,
      reset,
    },
  ] as const;
};
