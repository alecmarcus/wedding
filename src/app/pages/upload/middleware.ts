import type { RouteMiddleware } from "rwsdk/router";
import { STATUS } from "@/constants";
import { db } from "@/db";
import type { UploadsByTokenRequest } from "./:Token";

export const requireValidUploadToken: RouteMiddleware = async request => {
  const {
    params: { token },
  } = request as UploadsByTokenRequest;

  try {
    await db.rsvp.findUniqueOrThrow({
      where: {
        uploadToken: token,
      },
    });
  } catch {
    return new Response("Invalid token", {
      status: STATUS.Found302.code,
      // status: STATUS.BadRequest400.code,
      headers: {
        Location: "/upload",
      },
    });
  }
};
