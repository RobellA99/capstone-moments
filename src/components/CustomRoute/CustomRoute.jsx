import { useState } from "react";
import "./CustomRoute.scss";

export default function CustomRoute({ saveRoute }) {
  const [showInput, setShowInput] = useState(false);
  const [routeName, setRouteName] = useState("");

  const handleSaveClick = () => {
    setShowInput(true);
  };

  const handleSubmit = () => {
    if (!routeName || routeName.length < 5) {
      alert("Please enter a name with at least 5 characters");
      return;
    }
    if (routeName) {
      saveRoute(routeName);
      setShowInput(false);
      setRouteName("");
    }
  };

  return (
    <div className="custom-route">
      <button className="custom-route__button" onClick={handleSaveClick}>
        Save Custom Route
      </button>

      {showInput && (
        <div className="custom-route__input-container">
          <input
            type="text"
            className="custom-route__input"
            placeholder="Enter Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
          <button className="custom-route__submit" onClick={handleSubmit}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
