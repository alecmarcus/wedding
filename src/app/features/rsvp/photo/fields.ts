import { mib } from "@/constants";

const MAX_FILE_SIZE = mib(10);
export const MAX_PHOTOS_PER_RSVP = 20;

export const ALLOWED_IMAGE_TYPES = [
  "image/avif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/tiff",
  "image/webp",
] as const;

export const UPLOAD_PHOTOS_FIELDS = {
  photos: {
    name: "photos",
    maxSize: MAX_FILE_SIZE,
    maxLength: MAX_PHOTOS_PER_RSVP,
    mimeType: ALLOWED_IMAGE_TYPES,
  },
} as const;
