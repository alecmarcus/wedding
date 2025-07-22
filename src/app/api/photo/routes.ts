import { STATUS } from "@@/constants";
import { env } from "cloudflare:workers";
import { route } from "rwsdk/router";
import type { RequestInfo } from "rwsdk/worker";

type PhotoByFileNameRequest = RequestInfo<{
  fileName: string;
}>;

const photoByFileName = route("/photo/:fileName", async request => {
  const {
    params: { fileName },
  } = request as PhotoByFileNameRequest;
  try {
    const object = await env.PHOTOS.get(fileName);

    if (!object) {
      return new Response("Photo not found", {
        status: STATUS.NotFound404.code,
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Content-Type", object.httpMetadata?.contentType || "image/*");
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

export const apiPhotoRoutes = photoByFileName;
