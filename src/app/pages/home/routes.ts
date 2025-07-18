import { route } from "rwsdk/router";
import { Home } from "./Home";

export const homeRoutes = [
  route("/", Home),
];
