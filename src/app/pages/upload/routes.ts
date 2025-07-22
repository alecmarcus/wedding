import { prefix, route } from "rwsdk/router";

import { Upload } from ".";
import { ByToken } from "./:Token";
import { requireValidUploadToken } from "./middleware";

const index = route("/", Upload);

const byToken = route("/:token", [
  requireValidUploadToken,
  ByToken,
]);

export const uploadRoutes = prefix("/upload", [
  index,
  byToken,
]);
