"use client";

import { Link } from "#/app/components/Link";
import { useSetupAction } from "./hooks";

export const Setup = () => {
  const [setup, { isPending }] = useSetupAction();

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
