import { env } from "cloudflare:workers";
import { route } from "rwsdk/router";
import type { RequestInfo } from "rwsdk/worker";

export type PhotosApiRequest = RequestInfo<{
  fileName: string;
}>;

export const photoRoutes = [
  route<PhotosApiRequest>("/:fileName", async ({ params: { fileName } }) => {
    try {
      const object = await env.PHOTOS.get(fileName);

      if (!object) {
        return new Response("Photo not found", {
          status: 404,
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
        status: 500,
      });
    }
  }),
];
