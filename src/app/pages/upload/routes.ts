import { STATUS } from "@@/constants";
import { isSetupNeeded } from "@@/features/auth/functions";
import { prefix, route } from "rwsdk/router";
import { UploadPage } from ".";
import { Login } from "./login";

const login = route("/login", [
  async ({ ctx: { user } }) => {
    if (await isSetupNeeded()) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/admin/setup",
        },
      });
    }

    if (user) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/upload/admin",
        },
      });
    }
  },
  Login,
]);

const admin = route("/admin", [
  ({ ctx: { user } }) => {
    if (!user) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/upload/login",
        },
      });
    }
  },
  UploadPage,
]);

const index = route("/:token", UploadPage);

export const uploadRoutes = prefix("/upload", [
  login,
  admin,
  index,
]);
