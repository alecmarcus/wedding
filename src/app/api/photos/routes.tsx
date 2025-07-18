import { route } from "rwsdk/router";

export const photoRoutes = [
  route(
    "/:filename",
    (
      // { params }
    ) => {
      // const { filename } = params;

      // TODO: Implement actual photo retrieval from R2 or other storage service
      // For now, return a placeholder response

      // Example implementation once storage is set up:
      // const { env } = requestInfo;
      // try {
      //   const object = await env.BUCKET.get(filename);
      //   if (!object) {
      //     return new Response("Photo not found", { status: 404 });
      //   }
      //
      //   const headers = new Headers();
      //   object.writeHttpMetadata(headers);
      //   headers.set("Cache-Control", "public, max-age=31536000");
      //
      //   return new Response(object.body, { headers });
      // } catch (error) {
      //   console.error("Failed to retrieve photo:", error);
      //   return new Response("Failed to retrieve photo", { status: 500 });
      // }

      // Placeholder response for now
      return new Response("Photo storage not yet implemented", {
        status: 501,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }
  ),
];
