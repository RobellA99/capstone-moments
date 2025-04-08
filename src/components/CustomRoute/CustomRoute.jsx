import { useState } from "react";
import { FaSave } from "react-icons/fa";
import "./CustomRoute.scss";

export default function CustomRoute({ saveRoute }) {
  const [routeName, setRouteName] = useState("");
  const [tags, setTags] = useState("");
  const [showInputs, setShowInputs] = useState(false);

  const handleSave = () => {
    if (!routeName) {
      alert("Please enter a route name!");
      return;
    }
    saveRoute(routeName, tags);
    setRouteName("");
    setTags("");
    setShowInputs(false);
  };

  return (
    <div className="custom-route">
      <button
        className="custom-route__button"
        onClick={() => setShowInputs((prev) => !prev)}
      >
        <FaSave style={{ marginRight: "0.5rem" }} /> Save Custom Route
      </button>
      {showInputs && (
        <div className="custom-route__inputs">
          <input
            type="text"
            placeholder="Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            className="custom-route__input"
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="custom-route__input"
          />
          <button className="custom-route__button" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
