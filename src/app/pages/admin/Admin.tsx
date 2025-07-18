import { Link } from "@@/components/Link";
import { Suspense } from "react";
import { AdminActions } from "./components/AdminActions";
import { RsvpList } from "./components/RsvpList";
import { getAllRsvps, getRsvpStats } from "./rsvp/data";

const AdminStats = async () => {
  const stats = await getRsvpStats();

  return (
    <div>
      <h2>Overview</h2>
      <div>
        <div>
          <h3>RSVPs</h3>
          <p>{stats.rsvpCount}</p>
        </div>
        <div>
          <h3>Total Guests</h3>
          <p>{stats.totalGuests}</p>
        </div>
        <div>
          <h3>Plus Ones</h3>
          <p>{stats.plusOneCount}</p>
        </div>
        <div>
          <h3>Photos</h3>
          <p>{stats.photoCount}</p>
        </div>
      </div>
    </div>
  );
};

const AdminRsvps = async () => {
  const rsvps = await getAllRsvps();

  return (
    <div>
      <h2>All RSVPs ({rsvps.length})</h2>
      <RsvpList rsvps={rsvps} />
    </div>
  );
};

export const Admin = () => {
  return (
    <div>
      <h1>Wedding Admin</h1>

      <Suspense
        fallback={
          <div>
            <h2>Overview</h2>
            <p>Loading stats...</p>
          </div>
        }
      >
        <AdminStats />
      </Suspense>

      <AdminActions />

      <Suspense
        fallback={
          <div>
            <h2>All RSVPs</h2>
            <p>Loading RSVPs...</p>
          </div>
        }
      >
        <AdminRsvps />
      </Suspense>

      <div>
        <Link to="/">Home</Link>
        <Link to="/admin/logout">Logout</Link>
      </div>
    </div>
  );
};
