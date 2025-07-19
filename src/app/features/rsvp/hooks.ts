"use client";

import { useActionState } from "react";
import { rsvp } from "./functions";

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
