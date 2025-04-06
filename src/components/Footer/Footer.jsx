import "./Footer.scss";
import Logo from "../../assets/icons/logo.jpg";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <Link to="/" className="footer__header">
          <h3 className="footer__title">Moments</h3>
        </Link>
        <div className="footer__container">
          <img src={Logo} alt="Moments Logo" className="footer__image" />
        </div>
      </div>

      <div className="footer__container">
        <div className="footer__links">
          <h4 className="footer__links-title">Quick Links</h4>
          <ul className="footer__links-list">
            <li>
              <Link to="/" className="footer__link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/profile" className="footer__link">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/map" className="footer__link">
                Map
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer__link">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="footer__contact">
          <h4 className="footer__contact-title">Contact Us</h4>
          <ul className="footer__contact-list">
            <li>
              <a
                href="mailto:robellasfaaw@gmail.com"
                className="footer__contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaEnvelope className="footer__icon" /> robellasfaw@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/RobellA99"
                className="footer__contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="footer__icon" /> GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/robell-asfaw"
                className="footer__contact-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="footer__icon" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
