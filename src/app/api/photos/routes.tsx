import { env } from "cloudflare:workers";
import { route } from "rwsdk/router";
import type { RequestInfo } from "rwsdk/worker";
import { STATUS } from "@/app/constants";

export type PhotosFileNameRequest = RequestInfo<{
  fileName: string;
}>;

export const photosRoutes = route("/api/photos/:fileName", async request => {
  const {
    params: { fileName },
  } = request as PhotosFileNameRequest;
  try {
    const object = await env.PHOTOS.get(fileName);

    if (!object) {
      return new Response("Photo not found", {
        status: STATUS.NotFound404.code,
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: STATUS.InternalServerError500.code,
    });
  }
});
