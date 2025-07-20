import type { AppContext } from "./src/app";

declare module "rwsdk/worker" {
  interface DefaultAppContext extends AppContext {}
}
