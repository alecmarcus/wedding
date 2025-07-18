import { setCommonHeaders } from "@@/headers";
import { Document } from "@@/layouts/Document";
import { routes } from "@@/routes";
import { render } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import type { User } from "@/db";
import type { Session } from "@/session/durableObject";
import { sessionMiddleware } from "@/session/middleware";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

// biome-ignore lint/performance/noBarrelFile: Module structure is subject to CF's design.
export { SessionDurableObject } from "./session/durableObject";

export default defineApp([
  setCommonHeaders(),
  sessionMiddleware,
  render(Document, routes),
]);
