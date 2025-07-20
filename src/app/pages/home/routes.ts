import { layout, route } from "rwsdk/router";
import { Home } from ".";
import { HomeLayout } from "./Layout";
import { rsvpRoutes } from "./rsvp/routes";

const index = route("/", Home);

export const homeRoutes = layout(HomeLayout, [
  index,
  rsvpRoutes,
]);
