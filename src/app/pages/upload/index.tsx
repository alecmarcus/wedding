"use client";

import { PhotoItem } from "@@/components/PhotoItem";
import { useEffect, useState } from "react";
import type { Photo } from "@/db";
import {
  useGetPhotos,
  // useGetRsvpInfo
} from "./hooks";
import { UploadForm } from "./UploadForm";

const PhotoList = ({ photos }: { photos: Photo[] }) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>Your Uploaded Photos ({photos.length})</h3>
      <div>
        {photos.map(photo => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            showUploader={false}
            showDate={true}
          />
        ))}
      </div>
    </div>
  );
};

export const UploadPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from URL search params
    const searchParams = new URLSearchParams(window.location.search);
    const tokenParam = searchParams.get("token");
    setToken(tokenParam);
  }, []);

  return "Wip";
  // const {
  //   rsvpInfo,
  //   isLoading: isLoadingRsvp,
  //   error: rsvpError,
  // } = useGetRsvpInfo(token);
  // const {
  //   photos,
  //   isLoading: isLoadingPhotos,
  //   error: photosError,
  // } = useGetPhotos(token);

  // if (isLoadingRsvp) {
  //   return (
  //     <div>
  //       <h1>Loading...</h1>
  //     </div>
  //   );
  // }

  // if (rsvpError || !rsvpInfo || !token) {
  //   return (
  //     <div>
  //       <h1>Upload Photos</h1>
  //       <p>Please RSVP first before uploading photos.</p>
  //       <p>
  //         {rsvpError ||
  //           "Invalid or expired link. Please check your email for the correct upload link."}
  //       </p>
  //       <a href="/">Go to RSVP</a>
  //     </div>
  //   );
  // }

  // return (
  //   <div>
  //     <h1>Upload Wedding Photos</h1>
  //     <p>Welcome, {rsvpInfo.name}!</p>

  //     <UploadForm uploadToken={token} />

  //     {isLoadingPhotos ? (
  //       <p>Loading your photos...</p>
  //     ) : photosError ? (
  //       <p>Error loading photos: {photosError}</p>
  //     ) : (
  //       <PhotoList photos={photos} />
  //     )}
  //   </div>
  // );
};
