import { useState, useEffect } from "react";
import Map from "../../components/Map/Map";
import "./MapPage.scss";
import { ToastContainer, toast } from "react-toastify";

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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
