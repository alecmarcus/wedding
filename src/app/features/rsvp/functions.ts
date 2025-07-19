"use server";

import { db, type Rsvp } from "@/db";

export const getAllRsvpsWithPhotos = async () => {
  return await db.rsvp.findMany({
    include: {
      photos: {
        select: {
          id: true,
          filename: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getRsvpByEditToken = async (
  token: string
): Promise<{
  isSuccess: boolean;
  error: string | null;
  data: Rsvp | null;
}> => {
  try {
    if (!token) {
      throw new Error("Invalid token");
    }

    const rsvp = await db.rsvp.findUnique({
      where: {
        editToken: token,
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
