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
    rsvpCount,
    photoCount,
    plusOneCount,
    totalGuests,
  };
};

export const deleteRsvp = async (rsvpId: string) => {
  try {
    // Photos will be deleted automatically due to cascade delete
    await db.rsvp.delete({
      where: {
        id: rsvpId,
      },
    });

    return {
      isSuccess: true,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Unknown error",
    };
  }
};
