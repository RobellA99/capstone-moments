import "./Footer.scss";
import Logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

export default function () {
  return (
    <section className="footer">
      <Link to="/" className="footer__header">
        <h3 className="footer__title">Moments</h3>
      </Link>
      <div className="footer__container">
        <img src={Logo} alt="Moments Logo" className="footer__image" />
      </div>
    </section>
  );
}
