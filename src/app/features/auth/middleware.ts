import type { RouteMiddleware } from "rwsdk/router";
import { STATUS } from "@/constants";
import { sessions } from "@/session/store";
import { isSetupNeeded } from "./functions";

export const requireAuth: RouteMiddleware = ({ ctx: { user } }) => {
  if (!user) {
    return new Response(null, {
      status: STATUS.Found302.code,
      headers: {
        Location: "/admin/login",
      },
    });
  }
};

export const requireNoAuth: RouteMiddleware = ({ ctx: { user } }) => {
  if (user) {
    return new Response(null, {
      status: STATUS.Found302.code,
      headers: {
        Location: "/admin",
      },
    });
  }
};

export const requireSetup: RouteMiddleware = async () => {
  if (await isSetupNeeded()) {
    return new Response(null, {
      status: STATUS.Found302.code,
      headers: {
        Location: "/admin/setup",
      },
    });
  }
};

export const requireNoSetup: RouteMiddleware = async () => {
  if (!(await isSetupNeeded())) {
    return new Response(null, {
      status: STATUS.Found302.code,
      headers: {
        Location: "/admin/login",
      },
    });
  }
};

export const logoutInterruptor = (async ({ request, headers }) => {
  await sessions.remove(request, headers);
  return new Response(null, {
    status: STATUS.Found302.code,
    headers: {
      Location: "/",
    },
  });
}) satisfies RouteMiddleware;
