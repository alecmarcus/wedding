import { getAllRsvpsWithPhotos } from "@@/features/rsvp/functions";
import { RsvpItem } from "./RsvpItem";

export const Rsvps = async () => {
  const rsvps = await getAllRsvpsWithPhotos();

  return (
    <div>
      <h2>All RSVPs ({rsvps.length})</h2>
      {rsvps.length === 0 ? (
        <p>No RSVPs yet.</p>
      ) : (
        rsvps.map(rsvp => <RsvpItem key={rsvp.id} rsvp={rsvp} />)
      )}
    </div>
  );
};
