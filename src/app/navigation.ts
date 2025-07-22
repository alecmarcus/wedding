/** biome-ignore-all lint/correctness/noUnusedVariables: Generated types */
import { defineLinks } from "rwsdk/router";

/**
 * See node_modules/rwsdk/dist/runtime/lib/links.d.ts
 * Recreating because we can't get the exact same overloads with just the Paramaters<>
 * utility; it distributes across all unions to allow routes to be paired with params they don't accept.
 */
type ParseRoute<T extends string> =
  T extends `${infer Start}:${infer Param}/${infer Rest}`
    ? {
        [K in Param]: string;
      } & ParseRoute<Rest>
    : T extends `${infer Start}:${infer Param}`
      ? {
          [K in Param]: string;
        }
      : T extends `${infer Start}*${infer Rest}`
        ? {
            $0: string;
          } & ParseRoute<Rest>
        : T extends `${infer Start}*`
          ? {
              $0: string;
            }
          : Record<string, never>;

// Same as LinkFunction from rwsdk but without return string
type Navigate<T extends readonly string[]> = <Path extends T[number]>(
  path: Path,
  params?: ParseRoute<Path> extends Record<string, never>
    ? undefined
    : ParseRoute<Path>
) => void;

/**
 * Generic type for navigate args as a tuple. Use for creating a `<Link />` component with a `to` prop
 * whose type matches the parameters of `navigate()`
 */
type NavigateArgs<
  Routes extends readonly string[],
  Path extends Routes[number],
> = ParseRoute<Path> extends Record<string, never>
  ? [
      path: Path,
    ]
  : [
      path: Path,
      params: ParseRoute<Path>,
    ];

/** Typed tuples for every route in the provided list plus strings for those without params */
type NavigateTuples<Routes extends readonly string[]> = {
  [K in Routes[number]]: ParseRoute<K> extends Record<string, never>
    ? K | NavigateArgs<Routes, K> // Allow both string and tuple for paramless routes
    : NavigateArgs<Routes, K>; // Only tuple for routes with params
}[Routes[number]];

const routes = [
  "/",
  "/admin",
  "/admin/login",
  "/admin/logout",
  "/admin/setup",
  "/photo/:fileName",
  "/photos/:token",
  "/photos/:token",
  "/photos/admin",
  "/photos/login",
  "/rsvp",
  "/rsvp/:token",
] as const;

type Routes = typeof routes;

export const link = defineLinks(routes);

/**
 * Generic type for navigate args as a tuple. Use for creating a `<Link />` component with a `to` prop
 * whose type matches the parameters of `navigate()`
 */
export type Route = NavigateTuples<Routes>;

/** Routes which do not accept params */
export type StaticRoute = Exclude<
  Route,
  | [
      string,
    ]
  | [
      string,
      object,
    ]
>;

/**
 * Given a route as a path or path + params, will execute client side navigation event to that destination.
 * Combined with spaMode, will use RSC to fetch the payload from the server and only render the diff,
 * avoiding a full reload while still hitting the server as though you had.
 */
export const navigate: Navigate<Routes> = (...to) => {
  window.history.pushState({}, "", link(...to));
  window.dispatchEvent(new PopStateEvent("popstate"));
};
