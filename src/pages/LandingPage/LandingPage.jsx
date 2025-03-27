import { useState } from "react";
import Map from "../../components/Map/Map";
import CustomRoute from "../../components/CustomRoute/CustomRoute";
import "./LandingPage.scss";

export default function LandingPage() {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);

  const saveRoute = (routeName) => {
    setSavedRoutes((prevRoutes) => [...prevRoutes, routeName]);
    console.log("Saved Routes:", routeName);
    setResetTrigger();
  };

  return (
    <div>
      <div className="map">
        <Map resetTrigger={resetTrigger} />
      </div>
      <CustomRoute saveRoute={saveRoute} />

      {savedRoutes && (
        <div className="saved-routes">
          <h2>Saved Routes</h2>
          {savedRoutes.map((route, index) => (
            <p key={index}>{route}</p>
          ))}
        </div>
      )}
    </div>
  );
}
