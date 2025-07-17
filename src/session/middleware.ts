import { env } from "cloudflare:workers";
import type { RouteMiddleware } from "rwsdk/router";
import { ErrorResponse } from "rwsdk/worker";
import { db, setupDb } from "#/db";
import { RESPONSE_STATUS } from "#constants";
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
          RESPONSE_STATUS.Forbidden403.code,
          RESPONSE_STATUS.Unauthorized401.code,
        ] as number[]
      ).includes(error.code)
    ) {
      await sessions.remove(request, headers);
      headers.set("Location", "/");
      return new Response(null, {
        status: RESPONSE_STATUS.Found302.code,
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
