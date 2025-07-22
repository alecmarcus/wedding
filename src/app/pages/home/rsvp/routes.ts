import { prefix, route } from "rwsdk/router";
import { Rsvp } from "./";
import { ByToken } from "./:Token";
import { requireValidEditToken } from "./middleware";

const index = route("/", Rsvp);

const byToken = route("/:token", [
  requireValidEditToken,
  ByToken,
]);

export const rsvpRoutes = prefix("/rsvp", [
  index,
  byToken,
]);
