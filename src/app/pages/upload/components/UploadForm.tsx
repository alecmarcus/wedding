// "use client";

// import { PHOTO_UPLOAD_FIELDS } from "@/app/features/rsvp/photo/fields";
// import { useUploadPhoto } from "@/app/features/rsvp/photo/hooks";
// import { useRef } from "react";

// type UploadFormProps = {
//   uploadToken: string;
// };

export const UploadForm = (
  // { uploadToken }: UploadFormProps
) => {
  return <div>wip</div>;
  // const formRef = useRef<HTMLFormElement>(null);
  // const [uploadPhoto, { isPending, isSuccess, error, uploadedPhoto, reset }] =
  //   useUploadPhoto();

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   uploadPhoto(uploadToken, formData);
  // };

  // const handleReset = () => {
  //   formRef.current?.reset();
  //   reset();
  // };

  // if (isSuccess && uploadedPhoto) {
  //   return (
  //     <div>
  //       <h3>Photo Uploaded Successfully!</h3>
  //       <p>Your photo has been uploaded.</p>
  //       <button type="button" onClick={handleReset}>
  //         Upload Another Photo
  //       </button>
  //     </div>
  //   );
  // }

  // return (
  //   <form ref={formRef} onSubmit={handleSubmit}>
  //     <h3>Upload a Photo</h3>
  //     <p>Share your memories from our special day!</p>

  //     {error && (
  //       <div role="alert">
  //         <p>{error}</p>
  //       </div>
  //     )}

  //     <div>
  //       <label htmlFor={PHOTO_UPLOAD_FIELDS.photo.name}>Select Photo *</label>
  //       <input
  //         type="file"
  //         id={PHOTO_UPLOAD_FIELDS.photo.name}
  //         name={PHOTO_UPLOAD_FIELDS.photo.name}
  //         accept="image/*"
  //         required={true}
  //         disabled={isPending}
  //       />
  //       <p>Maximum file size: 10MB. Supported formats: JPEG, PNG, GIF, WebP</p>
  //     </div>

  //     <button type="submit" disabled={isPending}>
  //       {isPending ? "Uploading..." : "Upload Photo"}
  //     </button>
  //   </form>
  // );
};
