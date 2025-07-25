import { env } from "cloudflare:workers";
import type { RouteMiddleware } from "rwsdk/router";
import { ErrorResponse } from "rwsdk/worker";
import { STATUS } from "@/constants";
import { db, setupDb } from "@/db";
import { setupSessionStore } from "./store";

export const sessionMiddleware: RouteMiddleware = async ({
  ctx,
  request,
  headers,
}) => {
  await setupDb(env);
  const sessions = setupSessionStore(env);

  try {
    ctx.session = await sessions.load(request);
  } catch (error) {
    if (
      error instanceof ErrorResponse &&
      (
        [
          STATUS.Forbidden403.code,
          STATUS.Unauthorized401.code,
        ] as number[]
      ).includes(error.code)
    ) {
      await sessions.remove(request, headers);
      headers.set("Location", "/");
      return new Response(null, {
        status: STATUS.Found302.code,
        headers,
      });
    }

    throw error;
  }

  if (ctx.session?.userId) {
    ctx.user = await db.user.findUnique({
      where: {
        id: ctx.session.userId,
      },
    });
  }
};
