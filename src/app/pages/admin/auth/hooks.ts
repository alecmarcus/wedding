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

export const useLoginAction = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const transition = useCallback(async () => {
    try {
      setError(null);
      setIsSuccess(false);

      const options = await startPasskeyLogin();
      const authentication = await startAuthentication({
        optionsJSON: options,
      });
      const success = await finishPasskeyLogin(authentication);

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

  const action = useCallback(() => {
    startTransition(async () => {
      await transition();
    });
  }, [
    transition,
  ]);

  return [
    action,
    {
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useSetupAction = () => {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transition = useCallback(async () => {
    try {
      setError(null);
      setIsSuccess(false);

      const options = await startPasskeyRegistration("admin");
      const registration = await startRegistration({
        optionsJSON: options,
      });

      const success = await finishPasskeyRegistration("admin", registration);

      if (success) {
        setIsSuccess(true);
        const link = document.createElement("a");
        link.href = "/admin";
        link.click();
      } else {
        throw new Error("Unknown error");
      }
    } catch (error) {
      setError(
        `Setup failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      );
    }
  }, []);

  const action = useCallback(() => {
    startTransition(async () => {
      await transition();
    });
  }, [
    transition,
  ]);

  return [
    action,
    {
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};
