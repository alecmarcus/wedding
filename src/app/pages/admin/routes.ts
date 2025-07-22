import {
  logoutInterruptor,
  requireAuth,
  requireNoAuth,
  requireNoSetup,
  requireSetup,
} from "@@/features/auth/middleware";
import { prefix, route } from "rwsdk/router";
import { Admin } from ".";
import { Login } from "./login";
import { Setup } from "./setup";

const setup = route("/setup", [
  requireNoSetup,
  Setup,
]);

const login = route("/login", [
  requireSetup,
  requireNoAuth,
  Login,
]);

const logout = route("/logout", logoutInterruptor);

const index = route("/", [
  requireAuth,
  Admin,
]);

export const adminRoutes = prefix("/admin", [
  index,
  login,
  logout,
  setup,
]);
