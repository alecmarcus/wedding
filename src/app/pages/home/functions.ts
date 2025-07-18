"use server";

import { db } from "@/db";

export const getAllPhotos = async () => {
  const photos = await db.photo.findMany({
    include: {
      rsvp: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return photos;
};

export const getPhotoCount = async () => {
  const count = await db.photo.count();
  return count;
};
