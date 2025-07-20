import { photosRoutes } from "@@/api/photos/routes";
import { Document } from "@@/layouts/Document";
import { adminRoutes } from "@@/pages/admin/routes";
import { homeRoutes } from "@@/pages/home/routes";
import { uploadRoutes } from "@@/pages/upload/routes";
import { render } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import type { User } from "@/db";
import type { Session } from "@/session/durableObject";
import { sessionMiddleware } from "@/session/middleware";
import { setCommonHeaders } from "./headers";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export const app = defineApp([
  setCommonHeaders(),
  sessionMiddleware,
  render(Document, [
    homeRoutes,
    adminRoutes,
    uploadRoutes,
    photosRoutes,
  ]),
]);
