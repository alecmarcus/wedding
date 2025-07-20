import { prefix, route } from "rwsdk/router";
import { Rsvp } from "./";

const index = route("/", Rsvp);
const token = route("/:token", Rsvp);

export const rsvpRoutes = prefix("/rsvp", [
  index,
  token,
]);
