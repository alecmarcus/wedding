"use server";

import { env } from "cloudflare:workers";
import { db } from "@/db";

export const getAllPhotos = async () => {
  const photos = await db.photo.findMany({
    include: {
      rsvp: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return photos;
};

export const getPhotosByRsvp = async (
  where:
    | {
        uploadToken: string;
      }
    | {
        editToken: string;
      }
) => {
  try {
    const rsvp = await db.rsvp.findUnique({
      where,
      select: {
        id: true,
      },
    });

    if (!rsvp) {
      throw new Error("Invalid token");
    }

    const photos = await db.photo.findMany({
      where: {
        rsvpId: rsvp.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data: photos,
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
    };
  }
};

export const deletePhoto = async (
  where:
    | {
        id: string;
      }
    | {
        fileName: string;
      }
) => {
  try {
    const photo = await db.photo.findUnique({
      where,
    });

    if (!photo) {
      throw new Error("Photo not found");
    }

    await Promise.allSettled([
      env.PHOTOS.delete(photo.fileName),
      db.photo.delete({
        where,
      }),
    ]);

    return {
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      error: errorMessage,
      isSuccess: false,
    };
  }
};

export const deleteAllPhotosByRsvp = async (
  where:
    | {
        editToken: string;
      }
    | {
        uploadToken: string;
      }
) => {
  try {
    const rsvp = await db.rsvp.findUnique({
      where,
    });

    if (!rsvp) {
      throw new Error("Invalid token");
    }

    const photos = await db.photo.findMany({
      where: {
        rsvpId: rsvp.id,
      },
    });

    await Promise.allSettled([
      ...photos.map(photo => env.PHOTOS.delete(photo.fileName)),
      db.photo.deleteMany({
        where: {
          rsvpId: rsvp.id,
        },
      }),
    ]);

    return {
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      error: errorMessage,
      isSuccess: false,
    };
  }
};
