import { defineLinks } from "rwsdk/router";

export const link = defineLinks([
  "/",
  "/admin",
  "/admin/login",
  "/admin/logout",
  "/admin/setup",
  "/photo/:fileName",
  "/photos/:token",
  "/rsvp",
  "/rsvp/:token",
  "/upload/:token",
  "/upload/admin",
  "/upload/login",
]);

export type Href = Parameters<typeof link>;

export const navigate = (...to: Href) => {
  window.history.pushState({}, "", link(...to));
  window.dispatchEvent(new PopStateEvent("popstate"));
};
