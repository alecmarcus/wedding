import { Link } from "@@/components/Link";
import { PhotoGallery } from "@@/pages/home/components/PhotoGallery";
import type { LayoutProps } from "rwsdk/router";
import { db } from "@/db";

const PhotoSection = async () => {
  const photos = await db.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return <PhotoGallery photos={photos} />;
};

export const HomeLayout = ({ children }: LayoutProps) => {
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

      <Link to="/rsvp">RSVP</Link>

      {children}

      <PhotoSection />
    </div>
  );
};
