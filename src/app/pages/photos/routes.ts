import {
  requireAuth,
  requireNoAuth,
  requireSetup,
} from "@@/features/auth/middleware";
import { prefix, route } from "rwsdk/router";

import { Photos } from ".";
import { Admin } from "./admin";
import { Login } from "./login";

const login = route("/login", [
  requireSetup,
  requireNoAuth("/photos/admin"),
  Login,
]);

const admin = route("/admin", [
  requireAuth("/photos/login"),
  Admin,
]);

const index = route("/:token", Photos);

export const photosRoutes = prefix("/photos", [
  login,
  admin,
  index,
]);
