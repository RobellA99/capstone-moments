import "./Footer.scss";
import Logo from "../../assets/logo.jpg";

export default function () {
  return (
    <section className="footer">
      <img src={Logo} alt="Moments Logo" className="footer__image" />
    </section>
  );
}
