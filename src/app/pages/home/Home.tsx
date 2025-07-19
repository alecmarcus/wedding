import { Link } from "@@/components/Link";
import { getAllPhotos } from "@@/features/photo/functions";
import { PhotoGallery } from "@@/pages/home/components/PhotoGallery";
import { RsvpModal } from "@@/pages/home/components/RsvpModal";

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

      <RsvpModal />

      <PhotoSection />

      <div>
        <Link to="/admin">Admin</Link>
      </div>
    </div>
  );
};
