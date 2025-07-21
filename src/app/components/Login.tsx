"use client";

import { useLoginRequest } from "@@/features/auth/hooks";
import { useEffect } from "react";

export const Login = ({
  automatic,
  children,
  redirect,
}: {
  children?: ({
    error,
    isPending,
    isSuccess,
    login,
  }: {
    error: string | null;
    isPending: boolean;
    isSuccess: boolean;
    login: () => void;
  }) => React.ReactNode;
  automatic?: boolean;
} & Parameters<typeof useLoginRequest>[0]) => {
  const [login, { isPending, isSuccess, error }] = useLoginRequest({
    redirect,
  });

  useEffect(() => {
    if (automatic) {
      login();
    }
  }, [
    login,
    automatic,
  ]);

  return (
    children?.({
      error,
      isPending,
      isSuccess,
      login,
    }) || (
      <div>
        <button onClick={login} disabled={isPending} type="button">
          {isPending ? "Logging in..." : "Login with Passkey"}
        </button>

        {isSuccess && !redirect && <div>You are now logged in.</div>}
        {!isSuccess && error && <div>{error}</div>}
      </div>
    )
  );
};
