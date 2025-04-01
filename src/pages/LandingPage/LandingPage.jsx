import { useState } from "react";
import "./LandingPage.scss";
import ArrowSvg from "../../components/ArrowSvg/ArrowSvg";

export default function LandingPage() {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className="card">
      <h1 className="card__header">Category</h1>
      <div
        onClick={handleClick}
        className={`card__container ${
          isClicked ? "card__container--active" : ""
        }`}
      >
        <article className="card__container-box" onClick={handleClick}>
          {!isClicked ? (
            <div className="card__container-side card__container-side--front">
              <div className="card__container-side card__container-side-image--front"></div>
              <div className="card__container-side card__container-side-info--front">
                <h2 className="card__container-side card__container-side-title--front">
                  Monument Catgeory
                </h2>
              </div>
            </div>
          ) : (
            <div className="card__container-side card__container-side--back">
              <h2 className="card__container-side card__container-side-title--back">
                Landmarks
              </h2>
              <div className="card__container-side card__container-side-info--back">
                <h3 className="card__container-side card__container-side-info-title--back">
                  Description of Houses of Parliament
                </h3>
                <p className="card__container-side card__container-side-info-text--back">
                  Address
                </p>
              </div>
              <button className="card__container-side card__container-side-button--back">
                Learn More
                <ArrowSvg />
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
