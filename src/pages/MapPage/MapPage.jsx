import { useState } from "react";
import Map from "../../components/Map/Map";
import CustomRoute from "../../components/CustomRoute/CustomRoute";
import "./MapPage.scss";
import SideBar from "../../components/SideBar/SideBar";

export default function MapPage({ isClicked }) {
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(false);

  const saveRoute = (routeName) => {
    setSavedRoutes((prevRoutes) => [...prevRoutes, routeName]);
    console.log("Saved Routes:", routeName);
    setResetTrigger((prev) => !prev);
  };

  return (
    <div className="section">
      <div className="section__drawer">{isClicked && <SideBar />}</div>
      <div className="section__map">
        <Map resetTrigger={resetTrigger} />
        <CustomRoute saveRoute={saveRoute} />
        {savedRoutes && (
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
