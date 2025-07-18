import { db } from "@/db";

export const getAllRsvps = async () => {
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
