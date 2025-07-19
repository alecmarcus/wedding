"use client";

import { Link } from "@@/components/Link";
import { useLoginRequest } from "@@/features/auth/hooks";

export const Login = () => {
  const [login, { isPending, isSuccess }] = useLoginRequest();

  return (
    <div>
      <h1>Admin Login</h1>
      <Link to="/">Home</Link>
      <button onClick={login} disabled={isPending} type="button">
        {isPending ? "Logging in..." : "Login with Passkey"}
      </button>

      {isSuccess && <div>{isSuccess}</div>}
    </div>
  );
};
