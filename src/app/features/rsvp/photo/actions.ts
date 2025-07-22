"use server";

import { env } from "cloudflare:workers";
import {
  array,
  file,
  maxLength,
  maxSize,
  mimeType,
  minLength,
  nullable,
  object,
  parse,
  pipe,
} from "valibot";
import { db, type Photo } from "@/db";
import { UPLOAD_PHOTOS_FIELDS } from "./fields";

const photoUploadSchema = object({
  photos: nullable(
    pipe(
      array(
        pipe(
          file(),
          mimeType(UPLOAD_PHOTOS_FIELDS.photos.mimeType),
          maxSize(UPLOAD_PHOTOS_FIELDS.photos.maxSize)
        )
      ),
      minLength(1),
      maxLength(UPLOAD_PHOTOS_FIELDS.photos.maxLength)
    )
  ),
});

const parseAndValidateFormData = (formData: FormData) => {
  const rawData = {
    photos: formData.getAll(UPLOAD_PHOTOS_FIELDS.photos.name) as File[],
  };

  return parse(photoUploadSchema, rawData);
};

type FailedUpload = {
  error: string | null;
  file: File;
};

type Token =
  | {
      uploadToken: string;
      editToken?: never;
    }
  | {
      uploadToken?: never;
      editToken: string;
    };

type ActionState = {
  isSuccess: boolean | null;
  error: string | null;
  data: UploadPhotosResponse | null;
} & Token;

export type UploadPhotosResponse = {
  failureCount: number;
  failures: FailedUpload[];
  successCount: number;
  successes: Photo[];
  total: number;
};

export const uploadPhotos = async (
  { uploadToken, editToken }: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    if (!(uploadToken || editToken)) {
      throw new Error("No token provided");
    }

    const { photos } = parseAndValidateFormData(formData);

    if (photos === null) {
      throw new Error("No files provided");
    }

    const rsvp = await db.rsvp.findUniqueOrThrow({
      where: {
        uploadToken: uploadToken || undefined,
        editToken: editToken || undefined,
      },
      select: {
        email: true,
        id: true,
        name: true,
      },
    });

    const uploads = photos.map(async file => {
      const randomString = crypto.randomUUID();
      const extension = file.name.split(".").pop();
      const fileName = `${randomString}.${extension}`;

      try {
        await env.PHOTOS.put(fileName, file, {
          httpMetadata: {
            contentType: file.type,
          },
        });
        const photo = await db.photo.create({
          data: {
            fileName,
            rsvpId: rsvp.id,
            uploaderEmail: rsvp.email,
            uploaderName: rsvp.name,
          },
        });

        return {
          error: null,
          isSuccess: true,
          photo,
        };
      } catch (error) {
        void env.PHOTOS.delete(fileName);
        void db.photo.delete({
          where: {
            fileName,
          },
        });

        const errorMessage =
          error instanceof Error ? error.message : String(error);

        return {
          error: errorMessage,
          isSuccess: false,
          photo: null,
        };
      }
    });

    const results = await Promise.allSettled(uploads);

    const successes: UploadPhotosResponse["successes"] = [];
    const failures: UploadPhotosResponse["failures"] = [];

    results.forEach((result, index) => {
      const file = photos[index];

      if (result.status === "fulfilled") {
        if (result.value.photo !== null) {
          successes.push(result.value.photo);
        } else {
          failures.push({
            error: result.value.error,
            file,
          });
        }
      } else {
        const errorMessage =
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason);
        failures.push({
          file,
          error: errorMessage,
        });
      }
    });

    const data = {
      failureCount: failures.length,
      failures,
      successCount: successes.length,
      successes,
      total: photos.length,
    };

    return {
      data,
      error: null,
      isSuccess: true,
      ...({
        editToken,
        uploadToken,
      } as Token),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      data: null,
      error: errorMessage,
      isSuccess: false,
      ...({
        editToken,
        uploadToken,
      } as Token),
    };
  }
};
