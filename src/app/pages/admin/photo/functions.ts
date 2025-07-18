"use server";

import { db } from "@/db";

export const deletePhoto = async (photoId: string) => {
  try {
    const photo = await db.photo.findUnique({
      where: {
        id: photoId,
      },
    });

    if (!photo) {
      return {
        success: false,
        error: "Photo not found",
      };
    }

    // TODO: Delete from storage service (R2, etc.)
    // const { env } = requestInfo;
    // await env.BUCKET.delete(photo.filename);

    await db.photo.delete({
      where: {
        id: photoId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete photo:", error);
    return {
      success: false,
      error: "Failed to delete photo",
    };
  }
};
