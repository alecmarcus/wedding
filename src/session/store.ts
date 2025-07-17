import { defineDurableSession } from "rwsdk/auth";

export let sessions: ReturnType<typeof defineDurableSession>;

export const setupSessionStore = ({ SESSION_DURABLE_OBJECT }: Env) => {
  if (!sessions) {
    sessions = defineDurableSession({
      sessionDurableObject: SESSION_DURABLE_OBJECT,
    });
  }

  return sessions;
};
