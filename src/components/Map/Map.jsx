import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9iZWxsYSIsImEiOiJjbThvYnRvajIwMHV2Mm1zYnh2bXo2a3RuIn0.25KNcBy5b9rKGa-4yvHKJA";

export default function Map({ handleMapClick, waypoints, start, end }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState(null);

  const fetchRoute = async () => {
    if (!start || !end) return;

    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?access_token=${mapboxgl.accessToken}&geometries=geojson`;

    try {
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        setRoutes(data.routes[0].geometry); // Set the route geometry
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

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
        center: [-0.12, 51.5],
        zoom: 11,
      });

      if (start) {
        const startMarker = new mapboxgl.Marker()
          .setLngLat([start.lng, start.lat])
          .addTo(map.current);
        setMarkers((prev) => [...prev, startMarker]);
      }

      if (end) {
        const endMarker = new mapboxgl.Marker()
          .setLngLat([end.lng, end.lat])
          .addTo(map.current);
        setMarkers((prev) => [...prev, endMarker]);
      }

      fetchRoute();

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
  }, [handleMapClick, waypoints, start, end]);

  useEffect(() => {
    if (routes && map.current) {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: routes,
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#ff7e5f", // Line color
          "line-width": 5, // Line width
        },
      });
    }
  }, [routes]);

  return <div ref={mapContainer} className="map-container"></div>;
}
