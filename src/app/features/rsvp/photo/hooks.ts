"use client";

import { link } from "@@/navigation";
import {
  useActionState,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useState,
  useTransition,
} from "react";
import type { Photo } from "@/db";
import { getFileSize } from "@/util/getFileSize";
import { uploadPhotos, uploadPhotosAdmin } from "./actions";
import { UPLOAD_PHOTOS_FIELDS } from "./fields";
import { deletePhoto, getPhotosByRsvp } from "./functions";

export const useUploadPhotosAction = (
  initial: Parameters<typeof uploadPhotos>[0]
) => {
  const [state, action, isPending] = useActionState(uploadPhotos, initial);

  return [
    action,
    {
      ...state,
      isPending,
    },
  ] as const;
};

export const useAdminUploadPhotosAction = (
  initial: Parameters<typeof uploadPhotosAdmin>[0]
) => {
  const [state, action, isPending] = useActionState(uploadPhotosAdmin, initial);

  return [
    action,
    {
      ...state,
      isPending,
    },
  ] as const;
};

export const useGetPhotosByRsvpRequest = () => {
  const [data, setData] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(
    async (where: Parameters<typeof getPhotosByRsvp>[0]) => {
      try {
        setIsSuccess(false);
        setError(null);

        const result = await getPhotosByRsvp(where);

        if (result.isSuccess && result.data) {
          setData(result.data);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setError(`Failed to load photos: ${errorMessage}`);
      }
    },
    []
  );

  const request = useCallback(
    (where: Parameters<typeof getPhotosByRsvp>[0]) => {
      startTransition(async () => {
        await action(where);
      });
    },
    [
      action,
    ]
  );

  return [
    request,
    {
      data,
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useDeletePhotoRequest = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const action = useCallback(
    async ([identifier, authorization]: Parameters<typeof deletePhoto>) => {
      try {
        setError(null);
        setIsSuccess(false);

        const result = await deletePhoto(identifier, authorization);

        if (result.isSuccess) {
          setIsSuccess(true);
        } else {
          throw new Error(result.error || "Unknown error");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : JSON.stringify(error);
        setError(`Failed to delete photo: ${errorMessage}`);
      }
    },
    []
  );

  const request = useCallback(
    ([identifier, authorization]: Parameters<typeof deletePhoto>) => {
      startTransition(async () => {
        await action([
          identifier,
          authorization,
        ]);
      });
    },
    [
      action,
    ]
  );

  return [
    request,
    {
      error,
      isPending,
      isSuccess,
    },
  ] as const;
};

export const useManagePhotos = ({
  uploadedPhotos,
}: {
  uploadedPhotos: Photo[];
}) => {
  const [existingPhotos, removeExistingPhoto] = useReducer(
    (
      state,
      {
        id,
        ...authorization
      }: {
        id: string;
      } & (
        | {
            uploadToken: string;
          }
        | {
            editToken: string;
          }
      )
    ) => {
      void deletePhoto(
        {
          id,
        },
        authorization
      );
      return state.filter(item => item.id !== id);
    },
    uploadedPhotos,
    (photos: Photo[]) =>
      photos.map(({ fileName, id }) => ({
        src: link("/photo/:fileName", {
          fileName,
        }),
        size: null,
        name: fileName,
        id,
      }))
  );
  const [selectedPhotos, setSelectedPhotos] = useState<
    {
      src: string;
      size: number;
      id: null;
      name: string;
    }[]
  >([]);
  const allPhotos = useMemo(
    () => [
      ...existingPhotos,
      ...selectedPhotos,
    ],
    [
      existingPhotos,
      selectedPhotos,
    ]
  );

  const tooManyFiles = allPhotos.length > UPLOAD_PHOTOS_FIELDS.photos.maxLength;
  const someFileIsTooLarge = allPhotos.some(
    ({ size }) => size && size > UPLOAD_PHOTOS_FIELDS.photos.maxSize
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const inputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      return;
    }

    const selected: typeof selectedPhotos = [];
    for (const file of files) {
      selected.push({
        src: URL.createObjectURL(file),
        size: getFileSize(file.size).mib,
        name: file.name,
        id: null,
      });
    }

    setSelectedPhotos(existing => {
      // Must be done manually when no longer needed
      // @see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#memory_management
      for (const { src } of existing) {
        URL.revokeObjectURL(src);
      }

      return selected;
    });
  }, []);

  const removePhoto = useCallback(
    (
      where:
        | {
            name: string;
          }
        | ({
            id: string;
          } & (
            | {
                uploadToken: string;
              }
            | {
                editToken: string;
              }
          ))
    ) => {
      if ("id" in where && where.id) {
        return removeExistingPhoto(where);
      }

      const input = inputRef.current;

      if ("name" in where && where.name && input?.files) {
        const { name } = where;
        const remaining = new DataTransfer();
        for (const existingFile of input.files) {
          if (name !== existingFile.name) {
            remaining.items.add(existingFile);
          }
        }
        input.files = remaining.files;
        setSelectedPhotos(existing => {
          const remaining: typeof existing = [];
          // Must be done manually when no longer needed
          // @see https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static#memory_management
          for (const existingFile of existing) {
            if (name !== existingFile.name) {
              remaining.push(existingFile);
            }
            URL.revokeObjectURL(existingFile.src);
          }

          return remaining;
        });
      }
    },
    []
  );

  return {
    inputRef,
    state: {
      allPhotos,
      existingPhotos,
      selectedPhotos,
    },
    handlers: {
      inputChange,
      removePhoto,
    },
    errors: {
      someFileIsTooLarge,
      tooManyFiles,
    },
  };
};
