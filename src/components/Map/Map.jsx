import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";
import axios from "axios";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9iZWxsYSIsImEiOiJjbThvYnRvajIwMHV2Mm1zYnh2bXo2a3RuIn0.25KNcBy5b9rKGa-4yvHKJA";

export default function Map({ resetTrigger }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const routeSource = useRef(null);
  const [activeFeature, setActiveFeature] = useState("");
  const [currentRoute, setCurrentRoute] = useState(null);

  const fetchRoute = async () => {
    if (markersRef.current.length < 2) return;

    const coords = markersRef.current
      .map((marker) => {
        const { lng, lat } = marker.getLngLat();
        return `${lng},${lat}`;
      })
      .join(";");

    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${coords}?access_token=${mapboxgl.accessToken}&geometries=geojson`
      );

      const data = response.data;
      if (data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry;
        setCurrentRoute(routeGeometry);

        if (map.current.getSource("route")) {
          map.current.getSource("route").setData({
            type: "Feature",
            geometry: routeGeometry,
          });
        } else {
          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: routeGeometry,
            },
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#ff7e5f",
              "line-width": 5,
            },
          });

          routeSource.current = map.current.getSource("route");
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const resetRoute = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (map.current.getLayer("route")) {
      map.current.removeLayer("route");
    }
    if (map.current.getSource("route")) {
      map.current.removeSource("route");
    }

    setActiveFeature("");
  };

  const fetchPlaceName = async (lng, lat) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );

      return response.data.features.length > 0
        ? response.data.features[0].place_name
        : "Unknown Location";
    } catch (error) {
      console.error("Error fetching place name:", error);
      return "Unknown Location";
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

      map.current.on("click", handleMapClick);
    } catch (error) {
      console.error("Error initializing the map:", error);
    }
  }, []);

  useEffect(() => {
    resetRoute();
  }, [resetTrigger]);

  const handleMapClick = async (e) => {
    const { lng, lat } = e.lngLat;

    const placeName = await fetchPlaceName(lng, lat);
    setActiveFeature(placeName);

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${placeName}</h3><p>Coordinates:<br>Lng: ${lng.toFixed(
          4
        )}<br>Lat: ${lat.toFixed(4)}</p>`
      )
      .addTo(map.current);

    const newMarker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current)
      .setPopup(popup);

    markersRef.current.push(newMarker);

    fetchRoute();
  };

  return (
    <div className="map-box">
      <div ref={mapContainer} className="map-box__container"></div>
      {activeFeature && <p>Selected Location: {activeFeature}</p>}
    </div>
  );
}
