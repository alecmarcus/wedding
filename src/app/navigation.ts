import { defineLinks } from "rwsdk/router";

export const link = defineLinks([
  "/",
  "/admin",
  "/admin/login",
  "/admin/logout",
  "/admin/setup",
  "/api/photos/:fileName",
  "/rsvp",
  "/rsvp/:token",
  "/upload",
]);

export type Href = Parameters<typeof link>;

export const navigate = (...to: Href) => {
  window.history.pushState({}, "", link(...to));
  window.dispatchEvent(new PopStateEvent("popstate"));
};
