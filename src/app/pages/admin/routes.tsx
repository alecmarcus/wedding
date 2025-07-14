import { type RouteDefinition, route } from "rwsdk/router"
import { sessions } from "#/session/store"
import { serverRedirect } from "#/utils/serverRedirect"
import { isSetupNeeded } from "./functions"
import { Index } from "./Index"
import { Login } from "./Login"
import { Setup } from "./Setup"

const setup: RouteDefinition = route("/setup", [
  async () => {
    if (!(await isSetupNeeded())) {
      return serverRedirect("/admin/login")
    }
  },
  Setup,
])

const login: RouteDefinition = route("/login", [
  async ({ ctx }) => {
    if (await isSetupNeeded()) {
      return serverRedirect("/admin/setup")
    }

    if (ctx.user) {
      return serverRedirect("/admin")
    }
  },
  Login,
])

const logout: RouteDefinition = route("/logout", async ({ request }) => {
  const headers = new Headers()
  await sessions.remove(request, headers)
  return serverRedirect("/", {
    status: "Found302",
    headers,
  })
})

const index: RouteDefinition = route("/", [
  async ({ ctx: { user } }) => {
    if (await isSetupNeeded()) {
      return serverRedirect("/admin/setup")
    }

    if (!user) {
      return serverRedirect("/admin/login")
    }
  },
  Index,
])

export const adminRoutes = [
  setup,
  login,
  logout,
  index,
]
