import { env } from "cloudflare:workers"
import type { RouteMiddleware } from "rwsdk/router"
import { ErrorResponse } from "rwsdk/worker"
import { db, setupDb } from "#/db"
import { RESPONSE_STATUS } from "#/utils/responseStatus"
import { sessions, setupSessionStore } from "./store"

export const sessionMiddleware: RouteMiddleware = async ({
  ctx,
  request,
  headers,
}) => {
  await setupDb(env)
  setupSessionStore(env)

  try {
    ctx.session = await sessions.load(request)
  } catch (error) {
    if (
      error instanceof ErrorResponse &&
      error.code === RESPONSE_STATUS.Forbidden403.code
    ) {
      await sessions.remove(request, headers)
      headers.set("Location", "/admin/login")

      return new Response(null, {
        status: 302,
        headers,
      })
    }

    throw error
  }

  if (ctx.session?.userId) {
    ctx.user = await db.user.findUnique({
      where: {
        id: ctx.session.userId,
      },
    })
  }
}
