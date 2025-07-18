import { photoRoutes } from "@@/api/photos/routes";
import { adminRoutes } from "@@/pages/admin/routes";
import { homeRoutes } from "@@/pages/home/routes";
import { uploadRoutes } from "@@/pages/upload/routes";
import { prefix } from "rwsdk/router";

export const routes = [
  homeRoutes,
  prefix("/admin", adminRoutes),
  prefix("/upload", uploadRoutes),
  prefix("/api/photos", photoRoutes),
];
