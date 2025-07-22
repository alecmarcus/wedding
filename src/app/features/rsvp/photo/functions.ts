"use server";

import { env } from "cloudflare:workers";
import { db } from "@/db";

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
    const rsvp = await db.rsvp.findUniqueOrThrow({
      where,
      select: {
        id: true,
      },
    });

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

export const deletePhotoAdmin = async (
  where:
    | {
        id: string;
      }
    | {
        fileName: string;
      }
) => {
  try {
    const photo = await db.photo.findUniqueOrThrow({
      where,
    });

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

export const deletePhoto = async (
  identifier:
    | {
        id: string;
      }
    | {
        fileName: string;
      },
  token:
    | {
        uploadToken: string;
      }
    | {
        editToken: string;
      }
) => {
  try {
    const photo = await db.photo.findUniqueOrThrow({
      where: identifier,
      include: {
        rsvp: {
          where: token,
        },
      },
    });

    await Promise.allSettled([
      env.PHOTOS.delete(photo.fileName),
      db.photo.delete({
        where: identifier,
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
    const rsvp = await db.rsvp.findUniqueOrThrow({
      where,
    });

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
