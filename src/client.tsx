import type { CallServerCallback } from "react-server-dom-webpack/client.browser";
import {
  type ActionResponse,
  initClient,
  initClientNavigation,
  type Transport,
} from "rwsdk/client";

const transport: Transport = transportContext => {
  const fetchCallServer = (async <Result,>(
    id: string,
    args: unknown[] | null
  ): Promise<Result | undefined> => {
    const { createFromFetch, encodeReply } = await import(
      "react-server-dom-webpack/client.browser"
    );

    try {
      const fetchData = async (): Promise<Response> => {
        const url = new URL(window.location.href);
        url.searchParams.set("__rsc", "");
        if (id != null) {
          url.searchParams.set("__rsc_action_id", id);
        }

        return fetch(url, {
          method: "POST",
          body: args == null ? null : await encodeReply(args),
        }).then(response => {
          if (response.redirected) {
            window.history.replaceState(window.history.state, "", response.url);
            return fetchData();
          }

          return response;
        });
      };

      const streamData = createFromFetch(fetchData(), {
        callServer: fetchCallServer,
      }) as Promise<ActionResponse<Result>>;

      transportContext.setRscPayload(streamData);
      const result = await streamData;
      return result.actionResult;
    } catch {
      window.location.replace(window.location.href);
    }
  }) as CallServerCallback;

  return fetchCallServer;
};

void initClient({
  transport,
});
initClientNavigation();
