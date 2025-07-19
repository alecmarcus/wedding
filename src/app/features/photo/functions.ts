"use server";

import { env } from "cloudflare:workers";
import { db } from "@/db";
import { MAX_FILE_SIZE } from "./fields";

export const getAllPhotos = async () => {
  const photos = await db.photo.findMany({
    include: {
      rsvp: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return photos;
};

export const deletePhoto = async ({ id }: { id: string }) => {
  try {
    const photo = await db.photo.findUnique({
      where: {
        id,
      },
    });

    if (!photo) {
      throw new Error("Photo not found");
    }

    await env.PHOTOS.delete(photo.fileName);

    await db.photo.delete({
      where: {
        id,
      },
    });

    return {
      isSuccess: true,
      error: null,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getRsvpByUploadToken = async ({
  uploadToken,
}: {
  uploadToken: string;
}) => {
  try {
    if (!uploadToken) {
      throw new Error("Invalid upload token");
    }

    const rsvp = await db.rsvp.findUnique({
      where: {
        uploadToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!rsvp) {
      throw new Error("RSVP not found");
    }

    return {
      isSuccess: true,
      data: rsvp,
      error: null,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
};

// to do: convert to action
export const uploadPhoto = async (uploadToken: string, formData: FormData) => {
  try {
    const file = formData.get("photo") as File;

    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload an image file.");
    }

    // Validate file size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File too large. Maximum size is 10MB.");
    }

    // Verify the RSVP exists
    const rsvp = await db.rsvp.findUnique({
      where: {
        uploadToken,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!rsvp) {
      throw new Error("Invalid upload token");
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = crypto.randomUUID();
    const extension = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;

    // TODO: Upload to storage service (R2, etc.)
    // For now, we'll just save the metadata
    // In production, you would upload the file to R2 here
    // const { env } = requestInfo;
    // await env.BUCKET.put(fileName, file);

    // Save photo metadata
    const photo = await db.photo.create({
      data: {
        fileName,
        uploaderName: rsvp.name,
        uploaderEmail: rsvp.email,
        rsvpId: rsvp.id,
      },
    });

    return {
      isSuccess: true,
      error: null,
      data: {
        id: photo.id,
        fileName: photo.fileName,
      },
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
};

export const getPhotosByRsvp = async ({
  uploadToken,
}: {
  uploadToken: string;
}) => {
  try {
    const rsvp = await db.rsvp.findUnique({
      where: {
        uploadToken,
      },
      select: {
        id: true,
      },
    });

    if (!rsvp) {
      throw new Error("Invalid upload token");
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
      isSuccess: true,
      data: photos,
      error: null,
    };
  } catch (error) {
    return {
      isSuccess: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
};
