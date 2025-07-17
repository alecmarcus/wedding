/** biome-ignore-all lint/style/useNamingConvention: "Location" in Response headers */

import { type RouteDefinition, route } from "rwsdk/router";
import { db } from "#/db";
import { sessions } from "#/session/store";
import { RESPONSE_STATUS } from "#constants";
import { Index } from "./Index";
import { Login } from "./Login";
import { Setup } from "./Setup";

const isSetupNeeded = async () => {
  const userCount = await db.user.count();
  return userCount === 0;
};

const setup: RouteDefinition = route("/setup", [
  async () => {
    if (!(await isSetupNeeded())) {
      return new Response(null, {
        status: RESPONSE_STATUS.Found302.code,
        headers: {
          Location: "/admin/login",
        },
      });
    }
  },
  Setup,
]);

const login: RouteDefinition = route("/login", [
  async ({ ctx }) => {
    if (await isSetupNeeded()) {
      return new Response(null, {
        status: RESPONSE_STATUS.Found302.code,
        headers: {
          Location: "/admin/setup",
        },
      });
    }
    if (ctx.user) {
      return new Response(null, {
        status: RESPONSE_STATUS.Found302.code,
        headers: {
          Location: "/admin",
        },
      });
    }
  },
  Login,
]);

const logout: RouteDefinition = route("/logout", [
  async ({ request, headers }) => {
    await sessions.remove(request, headers);
    return new Response(null, {
      status: RESPONSE_STATUS.Found302.code,
      headers: {
        Location: "/",
      },
    });
  },
]);

const index: RouteDefinition = route("/", [
  async ({ ctx: { user } }) => {
    if (await isSetupNeeded()) {
      return new Response(null, {
        status: RESPONSE_STATUS.Found302.code,
        headers: {
          Location: "/admin/setup",
        },
      });
    }
    if (!user) {
      return new Response(null, {
        status: RESPONSE_STATUS.Found302.code,
        headers: {
          Location: "/admin/login",
        },
      });
    }
  },
  Index,
]);

export const adminRoutes = [
  setup,
  login,
  index,
  logout,
];
