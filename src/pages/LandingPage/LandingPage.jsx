import { useEffect, useState } from "react";
import "./LandingPage.scss";
import ArrowSvg from "../../components/ArrowSvg/ArrowSvg";
import axios from "axios";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [categoryMonuments, setCategoryMonuments] = useState({});

  const fetchMonumentsByCategory = async (category) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACK_END_URL
        }/monuments/category/monuments?category=${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching monuments for category ${category}`, error);
      return [];
    }
  };

  useEffect(() => {
    if (categories) {
      categories.forEach(async (category) => {
        const monuments = await fetchMonumentsByCategory(category.category);
        setCategoryMonuments((prev) => ({
          ...prev,
          [category.category]: monuments,
        }));
      });
    }
  }, [categories]);

  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/") {
      localStorage.removeItem("selectedCategories");
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".card__container-box")) {
        setSelectedCategories([]);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleSelectCategory = (e, category) => {
    e.stopPropagation();

    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) =>
        prev.filter((selectedCategory) => selectedCategory !== category)
      );
    } else {
      setSelectedCategories((prev) => [category, ...prev]);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACK_END_URL}/monuments/category`
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

  const fetchCategoryImages = async (category) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACK_END_URL
        }/monuments/category/images?category=${encodeURIComponent(category)}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching images for category ${category}`, error);
      return [];
    }
  };

  useEffect(() => {
    if (categories) {
      categories.forEach(async (category) => {
        const images = await fetchCategoryImages(category.category);
        setCategoryImages((prev) => ({
          ...prev,
          [category.category]: images,
        }));
        setCurrentImageIndex((prev) => ({
          ...prev,
          [category.category]: 0,
        }));
      });
    }
  }, [categories]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prev) => {
  //       const updatedIndex = { ...prev };
  //       Object.keys(updatedIndex).forEach((category) => {
  //         const images = categoryImages[category];
  //         if (images && images.length > 0) {
  //           updatedIndex[category] =
  //             (updatedIndex[category] + 1) % images.length;
  //         }
  //       });
  //       return updatedIndex;
  //     });
  //   }, 7000);

  //   return () => clearInterval(interval);
  // }, [categoryImages]);

  if (!categories || categories.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <section className="hero">
        <div className="hero__container">
          <h2 className="hero__text">Discover London</h2>
        </div>
      </section>
      <div className="card">
        <h1 className="card__header">Category</h1>
        <div className="card__container">
          {categories.map((category) => (
            <article className="card__container-box" key={category.id}>
              <div className="card__container-side">
                {categoryImages[category.category] &&
                  categoryImages[category.category].length > 0 && (
                    <img
                      className="card__container-side-image"
                      src={`${import.meta.env.VITE_BACK_END_URL}${
                        categoryImages[category.category][
                          currentImageIndex[category.category]
                        ].image_url
                      }`}
                      alt={category.category}
                    />
                  )}
              </div>
              <div className="card__container-sid-info">
                <h2 className="card__container-side-title">
                  {category.category}
                </h2>
              </div>
              <div className="card__container-side-container">
                <h2 className="card__container-side-header">Landmarks</h2>
                <div className="card__container-side-text">
                  <ul className="card__container-side-text-list">
                    {categoryMonuments[category.category] &&
                    categoryMonuments[category.category].length > 0 ? (
                      categoryMonuments[category.category].map(
                        (monument, index) => (
                          <li key={index}>{monument.name}</li>
                        )
                      )
                    ) : (
                      <li>No monuments available</li>
                    )}
                  </ul>
                  <button
                    className={`card__container-side-button ${
                      selectedCategories.includes(category.category)
                        ? "card__container-side-button--selected"
                        : ""
                    }`}
                    onClick={(e) => handleSelectCategory(e, category.category)}
                  >
                    {selectedCategories.includes(category.category)
                      ? "Deselect"
                      : "Select Category"}
                    <ArrowSvg />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <Link
          className="journey"
          to={{
            pathname: "/map",
            ...(selectedCategories.length > 0 && {
              search: `?categories=${selectedCategories.map((cat) =>
                cat.replace(/&/g, "%26")
              )}`,
            }),
          }}
        >
          <button className="journey__button">Create Your Journey</button>
        </Link>
      </div>
    </div>
  );
}
