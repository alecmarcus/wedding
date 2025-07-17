/** biome-ignore-all lint/style/useNamingConvention: "optionsJSON" vendor property name */
"use client";

import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { useCallback, useState, useTransition } from "react";
import { navigate } from "#/app/util/navigation";
import { IS_DEV } from "#constants";
import {
  finishPasskeyLogin,
  finishPasskeyRegistration,
  startPasskeyLogin,
  startPasskeyRegistration,
} from "./actions";

export const useLoginAction = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

  const transition = useCallback(async () => {
    try {
      const options = await startPasskeyLogin();
      const authentication = await startAuthentication({
        optionsJSON: options,
      });
      const success = await finishPasskeyLogin(authentication);

      if (success) {
        navigate("/admin/");
      } else {
        IS_DEV && console.log("Login failed");
      }
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
      IS_DEV &&
        console.log(
          `Login failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
  }, []);

  const action = useCallback(() => {
    startTransition(transition);
  }, [
    transition,
  ]);

  return [
    action,
    {
      isError,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useSetupAction = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  const transition = useCallback(async () => {
    try {
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
      }
    } catch (error) {
      setIsSuccess(false);
      setIsError(true);
      IS_DEV &&
        console.log(
          `Setup failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`
        );
    }
  }, []);

  const action = useCallback(() => {
    startTransition(transition);
  }, [
    transition,
  ]);

  return [
    action,
    {
      isError,
      isPending,
      isSuccess,
    },
  ] as const;
};
