import { Suspense } from "react";
import { PhotoForm } from "@/app/features/rsvp/photo/components/Form";
import { db } from "@/db";
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
      uploadToken: true,
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
      <PhotoForm uploadedPhotos={adminPhotos} uploadToken="" />
      {allPhotos.map(({ name, uploadToken, photos }) => {
        return (
          <div key={name}>
            <h1>{name}</h1>
            <PhotoGroup photos={photos} uploadToken={uploadToken} />
          </div>
        );
      })}
    </Suspense>
  );
};
