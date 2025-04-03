import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import CustomRoute from "../../components/CustomRoute/CustomRoute";
import "./MapPage.scss";

export default function MapPage() {
  const [resetTrigger, setResetTrigger] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const selectedCategories =
      JSON.parse(localStorage.getItem("selectedCategories")) || [];
    setSelectedCategory(selectedCategories);
  }, []);

  return (
    <div className="section">
      <div className="section__map">
        <Map
          resetTrigger={resetTrigger}
          selectedCategories={selectedCategory}
          setResetTrigger={setResetTrigger}
        />
      </div>
    </div>
  );
}
