import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import CustomRoute from "../../components/CustomRoute/CustomRoute";
import "./MapPage.scss";

export default function MapPage() {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const selectedCategories =
      JSON.parse(localStorage.getItem("selectedCategories")) || [];
    setSelectedCategory(selectedCategories);
  }, []);

  const saveRoute = (routeName) => {
    setSavedRoutes((prevRoutes) => [...prevRoutes, routeName]);
    setResetTrigger((prev) => !prev);
  };

  return (
    <div className="section">
      <div className="section__map">
        <Map
          resetTrigger={resetTrigger}
          selectedCategories={selectedCategory}
        />

        <CustomRoute saveRoute={saveRoute} />
        {savedRoutes.length > 0 && (
          <div className="section__saved-routes">
            <h2>Saved Routes</h2>
            {savedRoutes.map((route, index) => (
              <p key={index}>{route}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
