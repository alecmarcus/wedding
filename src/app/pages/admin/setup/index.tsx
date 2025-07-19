"use client";

import { Link } from "@@/components/Link";
import { useSetupRequest } from "@@/features/auth/hooks";

export const Setup = () => {
  const [setup, { isPending }] = useSetupRequest();

  return (
    <div>
      <h1>Admin Setup</h1>
      <Link to="/">Home</Link>
      <p>
        This is a one-time setup to create the admin account with passkey
        authentication.
      </p>

      <button onClick={setup} disabled={isPending} type="button">
        {isPending ? "Setting up..." : "Setup Admin Account"}
      </button>
    </div>
  );
};
