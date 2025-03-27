import { NavLink } from "react-router-dom";
import "./SideBar.scss";

export default function SideBar() {
  return (
    <section className="bar">
      <h2></h2>

      <div className="bar__container">
        <NavLink to="/" className="bar__link">
          Map
        </NavLink>
        <NavLink to="/profile" className="bar__link">
          Profile
        </NavLink>
      </div>
    </section>
  );
}
