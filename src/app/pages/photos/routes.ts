import { prefix, route } from "rwsdk/router";

import { Photos } from ".";

const index = route("/:token", Photos);

export const photosRoutes = prefix("/photos", [
  index,
]);
