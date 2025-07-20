import { STATUS } from "@@/constants";
import { prefix, route } from "rwsdk/router";
import { db } from "@/db";
import { sessions } from "@/session/store";
import { Admin } from ".";
import { Login } from "./login";
import { Setup } from "./setup";

const isSetupNeeded = async () => {
  const userCount = await db.user.count();
  return userCount === 0;
};

const setup = route("/setup", [
  async () => {
    if (!(await isSetupNeeded())) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/admin/login",
        },
      });
    }
  },
  Setup,
]);

const login = route("/login", [
  async ({ ctx }) => {
    if (await isSetupNeeded()) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/admin/setup",
        },
      });
    }
    if (ctx.user) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/admin",
        },
      });
    }
  },
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
  async ({ ctx: { user } }) => {
    if (await isSetupNeeded()) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/admin/setup",
        },
      });
    }
    if (!user) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location: "/admin/login",
        },
      });
    }
  },
  Admin,
]);

export const adminRoutes = prefix("/admin", [
  index,
  login,
  logout,
  setup,
]);
