// import { db } from "#/db";

import { Link } from "#/app/components/Link";

export const Index = () => {
  // const rsvpCount = await db.rsvp.count();
  // const photoCount = await db.photo.count();

  // const recentRsvps = await db.rsvp.findMany({
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   take: 5,
  // });

  return (
    <div>
      <h1>Wedding Admin</h1>

      {/* <div>
        <div>
          <h3>RSVPs</h3>
          <p>{rsvpCount}</p>
        </div>

        <div>
          <h3>Photos</h3>
          <p>{photoCount}</p>
        </div>
      </div>

      <div>
        <h2>Recent RSVPs</h2>
        {recentRsvps.length === 0 ? (
          <p>No RSVPs yet</p>
        ) : (
          <div>
            {recentRsvps.map(rsvp => (
              <div key={rsvp.id}>
                <strong>{rsvp.name}</strong> ({rsvp.email})
                {rsvp.plusOne && rsvp.plusOneName && (
                  <span> + {rsvp.plusOneName}</span>
                )}
                <div>{new Date(rsvp.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div> */}

      <Link to="/">Home</Link>
      <Link to="/admin/logout">Logout</Link>
    </div>
  );
};
