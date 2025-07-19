import { mib } from "@@/constants";

export const MAX_FILE_SIZE = mib(10);
export const MAX_PHOTOS_PER_RSVP = 50;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const UPLOAD_PHOTO_FIELDS = {
  photo: {
    name: "photo",
  },
} as const;
