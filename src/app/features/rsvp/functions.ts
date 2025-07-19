"use server";

import { db, type Rsvp } from "@/db";

export const getAllRsvpsWithPhotos = async () => {
  return await db.rsvp.findMany({
    include: {
      photos: {
        select: {
          id: true,
          fileName: true,
          createdAt: true,
        },
      },
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
}): Promise<{
  isSuccess: boolean;
  error: string | null;
  data: Rsvp | null;
}> => {
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

    return {
      isSuccess: true,
      error: null,
      data: rsvp,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : JSON.stringify(error) || "Failed to fetch RSVP.",
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
    rsvpCount,
    photoCount,
    plusOneCount,
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
