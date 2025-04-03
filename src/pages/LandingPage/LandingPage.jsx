import { useEffect, useState } from "react";
import "./LandingPage.scss";
import ArrowSvg from "../../components/ArrowSvg/ArrowSvg";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../../assets/images/london.jpg";

export default function LandingPage() {
  const [categories, setCategories] = useState(null);
  const [clickedCardId, setClickedCardId] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);

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
    setSelectedCategories([category, ...selectedCategories]);
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
              className="card__container-box"
              // onClick={(e) => {
              //   handleClick(category.id);
              //   // }
              // }}
              key={category.id}
            >
              <div className="card__container-side">
                <img className="card__container-side-image"></img>
                <div className="card__container-sid-info">
                  <h2 className="card__container-side-title">
                    {category.category}
                  </h2>
                </div>
              </div>

              <h2 className="card__container-side-header">Landmarks</h2>
              <div className="card__container-side-text">
                <h3 className="card__container-side-text-header">
                  Description of Houses of Parliament
                </h3>

                <ul className="card__container-side-text-list">
                  <li>Big Ben</li>
                  <li>The Shard</li>
                  <li>Tower Bridge</li>
                  <li>The gherkin</li>
                </ul>
                <button
                  className="card__container-side-button"
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
          className="journey"
          to={{
            pathname: "/map",
            ...(selectedCategories.length > 0 && {
              search: `?categories=${selectedCategories.map((cat) => {
                return cat.replace(/&/g, "%26");
              })}`,
              // .replace(/&/g, "%26")}`,
              // .find((category) => category.id === setSelectedCategoriesCardId)
              // .category.
            }),
            // )
          }}
        >
          <button className="journey__button">Create Your Journey</button>
        </Link>
      </div>
    </div>
  );
}
