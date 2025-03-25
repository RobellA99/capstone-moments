import { useState, useCallback } from "react";
import Map from "../../components/Map/Map";

export default function LandingPage() {
  const [waypoints, setWaypoints] = useState([]);

  const handleMapClick = useCallback((e) => {
    const { lng, lat } = e.lngLat;
    setWaypoints((prevWaypoints) => [...prevWaypoints, { lng, lat }]);
  }, []);

  return <Map waypoints={waypoints} handleMapClick={handleMapClick} />;
}
