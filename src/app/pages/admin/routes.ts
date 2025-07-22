import {
  requireAuth,
  requireNoAuth,
  requireNoSetup,
  requireSetup,
} from "@@/features/auth/middleware";
import { prefix, route } from "rwsdk/router";
import { STATUS } from "@/constants";
import { sessions } from "@/session/store";
import { Admin } from ".";
import { Login } from "./login";
import { Setup } from "./setup";

const setup = route("/setup", [
  requireNoSetup,
  Setup,
]);

const login = route("/login", [
  requireSetup,
  requireNoAuth("/admin"),
  Login,
]);

const logout = route("/logout", [
  async ({ request, headers }) => {
    await sessions.remove(request, headers);
    return new Response(null, {
      status: STATUS.Found302.code,
      headers: {
        Location: "/",
      },
    });
  },
]);

const index = route("/", [
  requireAuth("/admin/login"),
  Admin,
]);

export const adminRoutes = prefix("/admin", [
  index,
  login,
  logout,
  setup,
]);
