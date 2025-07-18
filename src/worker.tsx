import { prefix, render, route } from "rwsdk/router";
import { defineApp } from "rwsdk/worker";
import { Document } from "#/app/Document";
import { setCommonHeaders } from "#/app/headers";
import { adminRoutes } from "#/app/pages/admin/routes";
import type { User } from "#/db";
import type { Session } from "#/session/durableObject";
import { sessionMiddleware } from "#/session/middleware";

export type AppContext = {
  session: Session | null;
  user: User | null;
};

// biome-ignore lint/performance/noBarrelFile: Module structure is subject to CF's design.
export { SessionDurableObject } from "./session/durableObject";

export default defineApp([
  setCommonHeaders(),
  sessionMiddleware,
  render(Document, [
    route("/", () => (
      <div>
        <ul>
          <li>
            <a href="/admin">Admin</a>
          </li>
          <li>
            <a href="/admin/login">login</a>
          </li>
          <li>
            <a href="/admin/setup">setup</a>
          </li>
          <li>
            <a href="/admin/logout">logout</a>
          </li>
        </ul>
      </div>
    )),
    prefix("/admin", adminRoutes),
  ]),
]);
