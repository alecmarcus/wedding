"use server";

import { db } from "@/db";

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
