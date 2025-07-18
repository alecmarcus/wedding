"use server";

import { db } from "@/db";

export const deleteRsvp = async (rsvpId: string) => {
  try {
    // Photos will be deleted automatically due to cascade delete
    await db.rsvp.delete({
      where: {
        id: rsvpId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete RSVP:", error);
    return {
      success: false,
      error: "Failed to delete RSVP",
    };
  }
};

export const updateRsvpData = async (
  rsvpId: string,
  data: {
    name?: string;
    email?: string;
    plusOne?: boolean;
    plusOneName?: string | null;
    dietaryRestrictions?: string | null;
    message?: string | null;
  }
) => {
  try {
    const updatedRsvp = await db.rsvp.update({
      where: {
        id: rsvpId,
      },
      data,
    });

    return {
      success: true,
      data: updatedRsvp,
    };
  } catch (error) {
    console.error("Failed to update RSVP:", error);
    return {
      success: false,
      error: "Failed to update RSVP",
    };
  }
};
