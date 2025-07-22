import type { RequestInfo } from "rwsdk/worker";
import { db } from "@/db";
import { RsvpModal } from "../components/RsvpModal";

export type RsvpByTokenRequest = RequestInfo<{
  token?: string;
}>;

export const ByToken = async (request: RequestInfo) => {
  const {
    params: { token },
  } = request as RsvpByTokenRequest;

  // Middleware already calls findUniqueOrThrow so we know we're good here.
  const { photos, ...rsvp } = await db.rsvp.findUniqueOrThrow({
    where: {
      editToken: token,
    },
    include: {
      photos: {},
    },
  });

  return <RsvpModal rsvp={rsvp} photos={photos} />;
};
