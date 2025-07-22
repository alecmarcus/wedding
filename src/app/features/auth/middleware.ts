import type { RouteMiddleware } from "rwsdk/router";
import type { StaticRoute } from "@/app/navigation";
import { STATUS } from "@/constants";
import { isSetupNeeded } from "./functions";

export const requireAuth =
  (Location: StaticRoute): RouteMiddleware =>
  ({ ctx: { user } }) => {
    if (!user) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location,
        },
      });
    }
  };

export const requireNoAuth =
  (Location: StaticRoute): RouteMiddleware =>
  ({ ctx: { user } }) => {
    if (user) {
      return new Response(null, {
        status: STATUS.Found302.code,
        headers: {
          Location,
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
