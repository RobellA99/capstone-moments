import { Link, NavLink } from "react-router-dom";
import "./Navigation.scss";
import Logo from "../../assets/logo.jpg";

export default function Navigation() {
  return (
    <section className="nav">
      <Link to="/" className="nav__title">
        <h1>Moments</h1>
      </Link>
      <div className="nav__container">
        <NavLink to="/" className="nav__link">
          Profile
        </NavLink>
        <NavLink to="/" className="nav__link">
          Create
        </NavLink>
      </div>
    </section>
  );
}
