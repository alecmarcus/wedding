import { apiPhotoRoutes } from "@@/api/photo/routes";

import { Document } from "@@/layouts/Document";
import { adminRoutes } from "@@/pages/admin/routes";
import { homeRoutes } from "@@/pages/home/routes";
import { render } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { uploadRoutes } from "@/app/pages/upload/routes";
import type { User } from "@/db";
import type { Session } from "@/session/durableObject";
import { sessionMiddleware } from "@/session/middleware";
import { setCommonHeaders } from "./headers";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

export const app = defineApp([
  /** Middlewares */
  setCommonHeaders,
  sessionMiddleware,

  /** APIs */
  apiPhotoRoutes,

  /** Pages */
  render(Document, [
    adminRoutes,
    homeRoutes,
    uploadRoutes,
  ]),
]);
