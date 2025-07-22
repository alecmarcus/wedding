import type { RouteMiddleware } from "rwsdk/router";
import { STATUS } from "@/constants";
import { db } from "@/db";
import type { RsvpByTokenRequest } from "./:Token";

export const requireValidEditToken: RouteMiddleware = async request => {
  const {
    params: { token },
  } = request as RsvpByTokenRequest;

  try {
    await db.rsvp.findUniqueOrThrow({
      where: {
        editToken: token,
      },
    });
  } catch {
    return new Response("Invalid token", {
      status: STATUS.BadRequest400.code,
      headers: {
        Location: "/",
      },
    });
  }
};
