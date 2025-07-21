"use server";

import { db } from "@/db";
import type { ActionState } from "./actions";

export const getAllRsvpsWithPhotos = async () => {
  return await db.rsvp.findMany({
    include: {
      photos: {},
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getRsvpByEditToken = async ({
  editToken,
}: {
  editToken: string;
}): Promise<ActionState> => {
  try {
    if (!editToken) {
      throw new Error("Invalid edit token");
    }

    const rsvp = await db.rsvp.findUnique({
      where: {
        editToken,
      },
    });

    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    const photos = await db.photo.findMany({
      where: {
        rsvpId: rsvp.id,
      },
    });

    return {
      data: {
        ...rsvp,
        photos: {
          failureCount: 0,
          failures: [],
          successCount: photos.length,
          total: photos.length,
          successes: photos,
        },
      },
      error: null,
      isSuccess: true,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : JSON.stringify(error) || "Failed to fetch RSVP.";

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
    };
  }
};

export const getRsvpStats = async () => {
  const rsvpCount = await db.rsvp.count();
  const photoCount = await db.photo.count();
  const plusOneCount = await db.rsvp.count({
    where: {
      plusOne: true,
    },
  });

  const totalGuests = rsvpCount + plusOneCount;

  return {
    photoCount,
    plusOneCount,
    rsvpCount,
    totalGuests,
  };
};

export const deleteRsvp = async ({ id }: { id: string }) => {
  try {
    // Photos will be deleted automatically due to cascade delete
    await db.rsvp.delete({
      where: {
        id,
      },
    });

    return {
      isSuccess: true,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      error: errorMessage,
      isSuccess: false,
    };
  }
};
