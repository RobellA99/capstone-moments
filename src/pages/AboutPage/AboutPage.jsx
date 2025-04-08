import "./AboutPage.scss";
import Logo from "../../assets/icons/logo.jpg";

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="about-page__header">About Us</h1>
      <p className="about-page__content">
        Welcome to Moments, where we enable you to discover hidden gems around a
        city by helping you curate routes, by creating custom markers of your
        favourite and most interesting moments throughout your journey.
      </p>
      <img src={Logo} className="about-page__image" />
    </div>
  );
}
