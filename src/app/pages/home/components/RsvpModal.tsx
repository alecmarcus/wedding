import { RsvpForm } from "@@/features/rsvp/components/Form";
import { Suspense } from "react";
import { Link } from "@/app/components/Link";
import type { Photo, Rsvp } from "@/db";

export const RsvpModal = ({
  rsvp,
  photos,
}: {
  rsvp: Rsvp | null;
  photos: Photo[];
}) => {
  return (
    <Suspense fallback="Loading RSVP...">
      <Link
        to="/"
        style={{
          inset: 0,
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: 30,
          backgroundColor: "white",
        }}
      >
        <RsvpForm rsvp={rsvp} photos={photos} />
      </div>
    </Suspense>
  );
};
