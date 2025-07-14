"use client"

import { useLoginAction } from "./hooks"

export const Login = () => {
  const [login, { isPending, isSuccess }] = useLoginAction()

  return (
    <div>
      <h1>Admin Login</h1>

      <button onClick={login} disabled={isPending} type="button">
        {isPending ? "Logging in..." : "Login with Passkey"}
      </button>

      {isSuccess && <div>{isSuccess}</div>}
    </div>
  )
}
