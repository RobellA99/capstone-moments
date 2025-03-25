import { useState, useCallback } from "react";
import Map from "../../components/Map/Map";

export default function LandingPage() {
  const [waypoints, setWaypoints] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const handleMapClick = useCallback(
    (e) => {
      const { lng, lat } = e.lngLat;

      // Set start and end on the first two clicks
      if (!start) {
        setStart({ lat, lng }); // Set start point
      } else if (!end) {
        setEnd({ lat, lng }); // Set end point
      } else {
        // Optionally, add waypoints
        setWaypoints((prevWaypoints) => [...prevWaypoints, { lng, lat }]);
      }
    },
    [start, end]
  );

  return (
    <Map
      waypoints={waypoints}
      handleMapClick={handleMapClick}
      start={start}
      end={end}
    />
  );
}
