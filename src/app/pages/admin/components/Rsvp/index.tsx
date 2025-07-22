import { db } from "@/db";
import { RsvpItem } from "./Item";

export const Rsvps = async () => {
  const rsvps = await db.rsvp.findMany({
    include: {
      photos: {},
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <h2>All RSVPs ({rsvps.length})</h2>
      {rsvps.length === 0 ? (
        <p>No RSVPs yet.</p>
      ) : (
        rsvps.map(({ photos, ...rsvp }) => (
          <RsvpItem key={rsvp.id} rsvp={rsvp} photos={photos} />
        ))
      )}
    </div>
  );
};
