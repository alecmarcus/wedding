import { getRsvpStats } from "../rsvp/functions";

export const Stats = async () => {
  const stats = await getRsvpStats();

  return (
    <table>
      <thead>
        <tr>
          <th>RSVPs</th>
          <th>Total Guests</th>
          <th>Plus Ones</th>
          <th>Photos</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{stats.rsvpCount}</td>
          <td>{stats.totalGuests}</td>
          <td>{stats.plusOneCount}</td>
          <td>{stats.photoCount}</td>
        </tr>
      </tbody>
    </table>
  );
};
