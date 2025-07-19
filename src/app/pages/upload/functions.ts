"use server";

import { db } from "@/db";

export const getRsvpByUploadToken = async (token: string) => {
  if (!token) {
    return {
      success: false,
      error: "Invalid token",
    };
  }

  try {
    const rsvp = await db.rsvp.findUnique({
      where: {
        uploadToken: token,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!rsvp) {
      return {
        success: false,
        error: "RSVP not found",
      };
    }

    return {
      success: true,
      data: rsvp,
    };
  } catch (error) {
    console.error("Failed to fetch RSVP:", error);
    return {
      success: false,
      error: "Failed to fetch RSVP",
    };
  }
};

export const uploadPhoto = async (uploadToken: string, formData: FormData) => {
  const file = formData.get("photo") as File;

  if (!file) {
    return {
      success: false,
      error: "No file provided",
    };
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
    return {
      success: false,
      error: "Invalid file type. Please upload an image file.",
    };
  }

  // Validate file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: "File too large. Maximum size is 10MB.",
    };
  }

  try {
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
      return {
        success: false,
        error: "Invalid upload token",
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // TODO: Upload to storage service (R2, etc.)
    // For now, we'll just save the metadata
    // In production, you would upload the file to R2 here
    // const { env } = requestInfo;
    // await env.BUCKET.put(filename, file);

    // Save photo metadata
    const photo = await db.photo.create({
      data: {
        filename,
        uploaderName: rsvp.name,
        uploaderEmail: rsvp.email,
        rsvpId: rsvp.id,
      },
    });

    return {
      success: true,
      data: {
        id: photo.id,
        filename: photo.filename,
      },
    };
  } catch (error) {
    console.error("Failed to upload photo:", error);
    return {
      success: false,
      error: "Failed to upload photo. Please try again.",
    };
  }
};

export const getPhotosByRsvp = async (uploadToken: string) => {
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
      return {
        success: false,
        error: "Invalid upload token",
      };
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
      success: true,
      data: photos,
    };
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return {
      success: false,
      error: "Failed to fetch photos",
    };
  }
};
