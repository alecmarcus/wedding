import { Suspense } from "react";
import { db } from "@/db";
import { AdminPhotosForm } from "./Form";

export const Photos = async () => {
  const adminPhotos = await db.photo.findMany({
    where: {
      rsvpId: null,
    },
  });

  return (
    <Suspense fallback="Loading all photos...">
      <AdminPhotosForm uploadedPhotos={adminPhotos} />
    </Suspense>
  );
};
