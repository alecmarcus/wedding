import { defineDurableSession } from "rwsdk/auth"

const createSessionStore = (env: Env) =>
  defineDurableSession({
    sessionDurableObject: env.SESSION_DURABLE_OBJECT,
  })

export let sessions: ReturnType<typeof createSessionStore>

export const setupSessionStore = (env: Env) => {
  sessions = createSessionStore(env)
  return sessions
}
