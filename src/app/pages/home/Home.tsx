import { Link } from "@@/components/Link";
import { PhotoGallery } from "@@/pages/home/components/PhotoGallery";
import { RsvpModalWrapper } from "@@/pages/home/components/RsvpModalWrapper";
import { getAllPhotos } from "@@/pages/home/functions";
import { Suspense } from "react";

const PhotoSection = async () => {
  const photos = await getAllPhotos();
  return <PhotoGallery photos={photos} />;
};

export const Home = () => {
  return (
    <div>
      <h1>Soyeon & Alec</h1>
      <p>We're getting married! Join us for our special day.</p>

      <div>
        <h2>Event Details</h2>
        <p>Date: [Wedding Date]</p>
        <p>Time: [Wedding Time]</p>
        <p>Location: [Wedding Venue]</p>
      </div>

      <div>
        <a href="/?rsvp">RSVP Now</a>
      </div>

      <RsvpModalWrapper />

      <Suspense
        fallback={
          <div>
            <h2>Wedding Photos</h2>
            <p>Loading photos...</p>
          </div>
        }
      >
        <PhotoSection />
      </Suspense>

      <div>
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
};
