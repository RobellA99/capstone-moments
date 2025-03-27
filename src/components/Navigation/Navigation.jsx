import { Link } from "react-router-dom";
import "./Navigation.scss";

export default function Navigation({}) {
  return (
    <section className="nav">
      <Link to="/" className="nav__title">
        <h1 className="nav__header">Moments</h1>
      </Link>
    </section>
  );
}
