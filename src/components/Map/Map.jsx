import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9iZWxsYSIsImEiOiJjbThvYnRvajIwMHV2Mm1zYnh2bXo2a3RuIn0.25KNcBy5b9rKGa-4yvHKJA";

export default function Map({ handleMapClick, waypoints }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    if (!mapContainer.current) {
      console.error("Map container is not available");
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [0, 51.5],
        zoom: 9,
      });

      map.current.on("click", handleMapClick);

      waypoints.forEach((waypoint) => {
        new mapboxgl.Marker()
          .setLngLat([waypoint.lng, waypoint.lat])
          .addTo(map.current);
      });
    } catch (error) {
      console.error("Error initializing the map:", error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [handleMapClick, waypoints]);

  return <div ref={mapContainer} className="map-container"></div>;
}
