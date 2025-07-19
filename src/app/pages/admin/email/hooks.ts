import { useCallback, useState, useTransition } from "react";
import { resendConfirmationEmail, sendBulkEmailToGuests } from "./functions";

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

export const useSendBulkEmail = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] =
    useState<Awaited<ReturnType<typeof sendBulkEmailToGuests>>["data"]>(null);

  const reset = useCallback(() => {
    setIsSuccess(false);
    setError(null);
    setData(null);
  }, []);

  const transition = useCallback(
    async (subject: string, content: string) => {
      try {
        reset();

        const response = await sendBulkEmailToGuests(subject, content);

        if (response.success && response.data) {
          setIsSuccess(true);
          setData(response.data);
        } else {
          throw new Error(response.error || "Unknown error");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setError(`"Failed to send bulk email": ${errorMessage}`);
      }
    },
    [
      reset,
    ]
  );

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

  return [
    action,
    {
      data,
      error,
      isPending,
      isSuccess,
      reset,
    },
  ] as const;
};
