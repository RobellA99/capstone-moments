import { useEffect, useState } from "react";
import "./LandingPage.scss";
import ArrowSvg from "../../components/ArrowSvg/ArrowSvg";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isClicked, setIsClicked] = useState(false);
  const [categories, setCategories] = useState([]);

  const [clickedCardId, setClickedCardId] = useState(null);

  const handleClick = (id) => {
    // setIsClicked(!isClicked);
    // event.target;
    console.log(id);
    // event.target.classList.add(click);

    setClickedCardId(id);
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5050/monuments/category"
      );
      const category = response.data;
      if (!category.length) return;
      if (category.length > 0) {
        setCategories(
          category.map((item, key) => {
            console.log(item);
            return { ...item, clicked: false, id: key };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching category", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // return <p>testing</p>;

  return (
    <div>
      <div className="card">
        <h1 className="card__header">Category</h1>
        <div className="card__container">
          {categories.map((category) => (
            <article
              className={`card__container-box ${
                clickedCardId === category.id ? "card__container-box--flip" : ""
              }`}
              onClick={() => handleClick(category.id)}
              key={category.id}
            >
              <div
                className={`card__container-side card__container-side--front ${
                  clickedCardId === category.id
                    ? "card__container-side--hide"
                    : ""
                }`}
              >
                <div className="card__container-side card__container-side-image--front"></div>
                <div className="card__container-side card__container-side-info--front">
                  <h2 className="card__container-side card__container-side-title--front">
                    {category.category}
                  </h2>
                </div>
              </div>

              <div
                className={`card__container-side "  ${
                  clickedCardId === category.id
                    ? "card__container-side--show"
                    : "card__container-side--back"
                }`}
              >
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
            </article>
          ))}
        </div>
        <Link to={"/map"}>
          <button className="button">Create Your Journey</button>
        </Link>
      </div>
    </div>
  );
}
