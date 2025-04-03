import { useEffect, useState } from "react";
import "./LandingPage.scss";
import ArrowSvg from "../../components/ArrowSvg/ArrowSvg";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../../assets/images/london.jpg";

export default function LandingPage() {
  const [categories, setCategories] = useState(null);
  const [clickedCardId, setClickedCardId] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/") {
      localStorage.removeItem("selectedCategories");
    }
  }, []);

  const handleClick = (id) => {
    setClickedCardId((prevId) => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".card__container-box")) {
        setClickedCardId(null);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSelectCategory = (e, category) => {
    e.stopPropagation();
    setSelectedCategories((prevSelected) => {
      const updatedSelectedCategories = [...prevSelected];
      if (updatedSelectedCategories.includes(category)) {
        return updatedSelectedCategories.filter((cat) => cat !== category);
      } else {
        updatedSelectedCategories.push(category);
        return updatedSelectedCategories;
      }
    });
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

  if (!categories) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <section className="hero">
        <div className="hero__container">
          <img className="hero__image" src={Image} alt="Picture of London" />
          <h2 className="hero__text">Discover London</h2>
        </div>
      </section>
      <div className="card">
        <h1 className="card__header">Category</h1>
        <div className="card__container">
          {categories.map((category) => (
            <article
              className={`card__container-box ${
                clickedCardId === category.id ? "card__container-box--flip" : ""
              }`}
              onClick={(e) => {
                // e.stopPropagation();
                // if (clickedCardId === category.id) {
                handleClick(category.id);
                // }
              }}
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
                <button
                  className="card__container-side card__container-side-button--back"
                  onClick={(e) => handleSelectCategory(e, category.category)}
                >
                  {categories.includes(category.category)
                    ? "Deselect Category"
                    : "Select Category"}
                  <ArrowSvg />
                </button>
              </div>
            </article>
          ))}
        </div>
        <Link
          to={{
            pathname: "/map",
            ...(clickedCardId && {
              search: `?categories=${categories
                .find((category) => category.id === clickedCardId)
                .category.replace(/ /g, "")
                .replace(/&/g, "%26")}`,
            }),
          }}
        >
          <button className="button">Create Your Journey</button>
        </Link>
      </div>
    </div>
  );
}
