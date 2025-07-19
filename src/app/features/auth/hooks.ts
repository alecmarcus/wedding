"use client";

import { navigate } from "@@/navigation";
import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useCallback, useState, useTransition } from "react";
import {
  finishPasskeyLogin,
  finishPasskeyRegistration,
  startPasskeyLogin,
  startPasskeyRegistration,
} from "./functions";

export const useLoginRequest = () => {
  const [error, setError] = useState<null | string>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(async () => {
    try {
      setError(null);
      setIsSuccess(false);

      const options = await startPasskeyLogin();
      const response = await startAuthentication({
        optionsJSON: options,
      });
      const success = await finishPasskeyLogin({
        response,
      });

      if (success) {
        setIsSuccess(true);
        navigate("/admin");
      } else {
        throw new Error("Unknown error");
      }
    } catch (error) {
      setError(
        `Login failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  }, []);

  const request = useCallback(() => {
    startTransition(action);
  }, [
    action,
  ]);

  return [
    request,
    {
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useSetupRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(async () => {
    try {
      setError(null);
      setIsSuccess(false);

      const options = await startPasskeyRegistration({
        userName: "admin",
      });
      const registration = await startRegistration({
        optionsJSON: options,
      });
      const success = await finishPasskeyRegistration({
        userName: "admin",
        registration,
      });

      if (success) {
        setIsSuccess(true);
        navigate("/admin");
      } else {
        throw new Error("Unknown error");
      }
    } catch (error) {
      setError(
        `Setup failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  }, []);

  const request = useCallback(() => {
    startTransition(action);
  }, [
    action,
  ]);

  return [
    request,
    {
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};
