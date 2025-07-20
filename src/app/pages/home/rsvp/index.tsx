import type { RequestInfo } from "rwsdk/worker";
import { RsvpModal } from "../components/RsvpModal";

export type RsvpTokenRequest = RequestInfo<{
  token?: string;
}>;

export const Rsvp = (request: RequestInfo) => {
  const {
    params: { token },
  } = request as RsvpTokenRequest;
  return <RsvpModal token={token} />;
};
