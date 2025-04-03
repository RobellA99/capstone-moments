import { Link, NavLink } from "react-router-dom";
import "./Navigation.scss";

export default function Navigation() {
  return (
    <section className="nav">
      <Link to="/" className="nav__title">
        <h1 className="nav__header">Moments</h1>
      </Link>
      <div className="nav__container">
        <NavLink to="/map" className="nav__link">
          Map
        </NavLink>
        <NavLink to="/profile" className="nav__link">
          Profile
        </NavLink>
      </div>
    </section>
  );
}
