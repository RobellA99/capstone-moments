import Map from "../../components/Map/Map";
import CustomRoute from "../../components/CustomRoute/CustomRoute";
import "./LandingPage.scss";

export default function LandingPage() {
  return (
    <div>
      <div className="map">
        <Map />
      </div>
      <CustomRoute />
    </div>
  );
}
