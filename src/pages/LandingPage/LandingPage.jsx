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
      <h1 className="card__header">Moments</h1>
      <div
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
                  Houses of Parliament
                </h2>
                <p className="card__container-info-text">
                  Description of Houses of Parliament
                </p>
              </div>
            </div>
          ) : (
            <div className="card__container-side card__container-side--back">
              <h2 className="card__container-side--back__title">
                More Information
              </h2>
              <p className="card__container-side--back__info">
                More description
              </p>
              <button className="card__container-side--back__button">
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
