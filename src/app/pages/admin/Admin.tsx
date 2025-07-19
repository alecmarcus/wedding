import { Link } from "@@/components/Link";
import { Actions } from "./components/Actions";
import { Rsvps } from "./components/Rsvps";
import { Stats } from "./components/Stats";

export const Admin = () => {
  return (
    <div>
      <h1>Wedding Admin</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin/logout">Logout</Link>
        </li>
      </ul>

      <Stats />
      <Actions />
      <Rsvps />
    </div>
  );
};
