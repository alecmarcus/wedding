import { PhotoForm } from "@@/features/rsvp/photo/components/Form";
import type { RequestInfo } from "rwsdk/worker";
import { db } from "@/db";

export type UploadsByTokenRequest = RequestInfo<{
  token: string;
}>;

export const ByToken = async (request: RequestInfo) => {
  const {
    params: { token },
  } = request as UploadsByTokenRequest;

  // Middleware already calls findUniqueOrThrow so we know we're good here.
  const { photos } = await db.rsvp.findUniqueOrThrow({
    where: {
      uploadToken: token,
    },
    include: {
      photos: {},
    },
  });

  return <PhotoForm uploadToken={token} uploadedPhotos={photos} />;
};
