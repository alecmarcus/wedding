import type { RequestInfo } from "rwsdk/worker";
import { RsvpModal } from "../components/RsvpModal";

type RsvpByTokenRequest = RequestInfo<{
  token?: string;
}>;

export const Rsvp = (request: RequestInfo) => {
  const {
    params: { token },
  } = request as RsvpByTokenRequest;
  return <RsvpModal token={token} />;
};
