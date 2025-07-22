import { Suspense } from "react";
import { db } from "@/db";
import { AdminPhotoForm } from "./PhotoForm";
import { PhotoGroup } from "./PhotoGroup";

export const Admin = async () => {
  const adminPhotos = await db.photo.findMany({
    where: {
      rsvpId: null,
    },
  });

  const allPhotos = await db.rsvp.findMany({
    select: {
      name: true,
      photos: true,
    },
    where: {
      photos: {
        some: {},
      },
    },
    orderBy: {
      name: "desc",
    },
  });

  return (
    <Suspense fallback="Loading all photos...">
      <h1>Admin</h1>
      <AdminPhotoForm uploadedPhotos={adminPhotos} />
      {allPhotos.map(({ name, photos }) => {
        return (
          <div key={name}>
            <h1>{name}</h1>
            <PhotoGroup photos={photos} />
          </div>
        );
      })}
    </Suspense>
  );
};
