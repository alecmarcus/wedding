import { defineLinks } from "rwsdk/router";

export const link = defineLinks([
  "/",
  "/admin/",
  "/admin/setup",
  "/admin/login",
  "/admin/logout",
]);

export type Href = Parameters<typeof link>;

export const navigate = (...to: Href) => {
  window.history.pushState({}, "", link(...to));
  window.dispatchEvent(new PopStateEvent("popstate"));
};
