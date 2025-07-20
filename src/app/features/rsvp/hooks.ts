"use client";

import { useActionState, useCallback, useState, useTransition } from "react";
// import type { Rsvp } from "@/db";
import { rsvp } from "./actions";
import {
  deleteRsvp,
  // getRsvpByEditToken
} from "./functions";

// export const useGetRsvpByEditTokenRequest = () => {
//   const [data, setData] = useState<Rsvp | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();
//   const [isSuccess, setIsSuccess] = useState(false);

//   const action = useCallback(async ({ editToken }: { editToken: string }) => {
//     try {
//       setError(null);
//       setIsSuccess(false);
//       setData(null);

//       const result = await getRsvpByEditToken({
//         editToken,
//       });

//       if (result.isSuccess && result.data) {
//         setIsSuccess(true);
//         setData(result.data);
//       } else {
//         throw new Error(result.error || "Unknown error");
//       }
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : error;
//       setError(`Failed to get RSVP: ${errorMessage}`);
//     }
//   }, []);

//   const request = useCallback(
//     ({ editToken }: { editToken: string }) => {
//       startTransition(async () => {
//         await action({
//           editToken,
//         });
//       });
//     },
//     [
//       action,
//     ]
//   );

//   return [
//     request,
//     {
//       data,
//       error,
//       isPending,
//       isSuccess,
//     },
//   ] as const;
// };

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
