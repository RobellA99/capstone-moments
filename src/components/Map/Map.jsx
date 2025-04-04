import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.scss";
import axios from "axios";
import { useLocation } from "react-router-dom";
import InfoCard from "../InfoCard/InfoCard";
import CustomRoute from "../CustomRoute/CustomRoute";

mapboxgl.accessToken =
  "pk.eyJ1Ijoicm9iZWxsYSIsImEiOiJjbThvYnRvajIwMHV2Mm1zYnh2bXo2a3RuIn0.25KNcBy5b9rKGa-4yvHKJA";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Map({
  resetTrigger,
  selectedCategories,
  setResetTrigger,
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const routeSource = useRef(null);
  const [activeFeature, setActiveFeature] = useState("");
  const [currentRoute, setCurrentRoute] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [currentClickedAddress, setCurrentClickedAddress] = useState("");

  const [currentLocation, setCurrentLocation] = useState({});
  const [monuments, setMonuments] = useState([]);

  const [monumentData, setMonumentData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    category: "",
    location: "London, UK",
  });

  const [viewInfoCards, setViewInfoCards] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [viewJourney, setViewJourney] = useState(false);

  const saveRoute = (routeName) => {
    setSavedRoutes((prevRoutes) => [...prevRoutes, routeName]);
    setResetTrigger((prev) => !prev);
  };

  let query = useQuery();

  useEffect(() => {
    monuments.forEach((monument) => {
      const marker = new mapboxgl.Marker({ color: "orange" })
        .setLngLat([monument.longitude, monument.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${monument.name}</h3>`))
        .addTo(map.current);

      marker.getElement().addEventListener("mouseenter", () => {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h3>${monument.name}</h3>`)
          .addTo(map.current);
        marker.setPopup(popup);
      });

      marker.getElement().addEventListener("mouseleave", () => {
        marker.getPopup().remove();
      });

      marker.getElement().addEventListener("click", (e) => {
        const { lng, lat } = marker.getLngLat();
        calculateProximity(lat, lng);
        setShowModal(false);
      });
    });
  }, [monuments]);

  const fetchMonuments = async (useQueryParams) => {
    try {
      let requestUrl = null;

      if (useQueryParams) {
        requestUrl = `http://localhost:5050/monuments?categories=${encodeURIComponent(
          query.get("categories")
        )}`;
      } else {
        requestUrl = `http://localhost:5050/monuments`;
      }
      const response = await axios.get(requestUrl);
      const monuments = response.data;

      if (!monuments.length) return;

      setMonuments(monuments);

      monuments.forEach((monument) => {
        const marker = new mapboxgl.Marker({ color: "orange" })
          .setLngLat([monument.longitude, monument.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${monument.name}</h3>`))
          .addTo(map.current);

        markersRef.current.push(marker);

        marker.getElement().addEventListener("mouseenter", () => {
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${monument.name}</h3>`)
            .addTo(map.current);
          marker.setPopup(popup);
        });

        marker.getElement().addEventListener("mouseleave", () => {
          marker.getPopup().remove();
        });

        marker.getElement().addEventListener("click", (e) => {
          const { lng, lat } = marker.getLngLat();
          calculateProximity(lat, lng);
          setShowModal(false);
        });
      });
    } catch (error) {
      console.error("Error fetching monuments:", error);
    }
  };

  useEffect(() => {
    fetchMonuments(true);
  }, [selectedCategories]);

  const fetchRoute = async () => {
    const uniqueCoordinates = Array.from(
      new Set(
        monuments.map((journey) => `${journey.longitude},${journey.latitude}`)
      )
    );

    if (uniqueCoordinates.length < 2) {
      console.error("Not enough unique coordinates to generate a route.");
      return;
    }

    const coords = uniqueCoordinates.join(";");

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
        center: [-0.3, 51.5],
        zoom: 10,
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
    calculateProximity(lng, lat);
  };

  const calculateProximity = async (lng, lat) => {
    const existingMarker = map.current._markers.find((marker) => {
      const { lng: markerLng, lat: markerLat } = marker.getLngLat();
      const distance = Math.sqrt(
        (markerLng - lng) ** 2 + (markerLat - lat) ** 2
      );
      return distance < 0.001;
    });
    if (existingMarker) {
      existingMarker.togglePopup();
      setShowModal(false);
      return;
    }

    setShowModal(true);
    const placeName = await fetchPlaceName(lng, lat);
    setCurrentClickedAddress(placeName);
    setCurrentLocation({ lng, lat });
  };

  const addMonument = async () => {
    if (
      !monumentData.name ||
      !monumentData.description ||
      !monumentData.category
    ) {
      alert("Please enter a name and description and category!");
      return;
    }

    try {
      const journey = [...monuments, monumentData];

      setMonuments(journey);

      localStorage.setItem("JOURNEY", JSON.stringify(journey));

      setShowModal(false);
      setMonumentData({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        category: "",
        location: "London, UK",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    if (currentLocation.lng && currentLocation.lat) {
      setMonumentData((prev) => ({
        ...prev,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
      }));
    }
  }, [currentLocation, currentClickedAddress]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMonumentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    addMonument();
  };

  const handleButtonClick = () => {
    setViewInfoCards(!viewInfoCards);
    setViewJourney((prevState) => !prevState);
  };

  const loadPrevRoute = () => {
    setMonuments([
      ...monuments,
      ...JSON.parse(localStorage.getItem("JOURNEY")),
    ]);
  };

  const handleCardClick = (monument) => {
    if (!map.current) return;

    const { longitude, latitude } = monument;

    const marker = markersRef.current.find(
      (m) =>
        m.getLngLat().lng.toFixed(6) === longitude.toFixed(6) &&
        m.getLngLat().lat.toFixed(6) === latitude.toFixed(6)
    );

    if (marker) {
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 14,
        essential: true,
      });

      marker.togglePopup();
    } else {
      console.log("No marker found for this monument.");
    }
  };
  const handleDeleteMarker = (monument) => {
    console.log("Deleting monument:", monument);

    setMonuments((prevMonuments) => {
      const updatedMonuments = prevMonuments.filter(
        (m) => m.id !== monument.id
      );
      console.log("Updated monuments:", updatedMonuments);
      return updatedMonuments;
    });

    const markerIndex = markersRef.current.findIndex(
      (m) =>
        m.getLngLat().lng.toFixed(6) === monument.longitude.toFixed(6) &&
        m.getLngLat().lat.toFixed(6) === monument.latitude.toFixed(6)
    );

    if (markerIndex !== -1) {
      console.log(
        "Removing marker from Mapbox:",
        markersRef.current[markerIndex]
      );
      markersRef.current[markerIndex].remove();
      markersRef.current.splice(markerIndex, 1);
    } else {
      console.log("Marker not found for deletion");
    }
  };

  useEffect(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    monuments.forEach((monument) => {
      const marker = new mapboxgl.Marker({ color: "orange" })
        .setLngLat([monument.longitude, monument.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${monument.name}</h3>`))
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [monuments]);

  const clearRoute = () => {
    if (map.current.getLayer("route")) {
      map.current.removeLayer("route");
    }

    if (map.current.getSource("route")) {
      map.current.removeSource("route");
    }

    markersRef.current.forEach((marker) => {
      marker.addTo(map.current);
    });
    setActiveFeature("");
    setCurrentRoute(null);
  };

  return (
    <div className="map-container">
      <button onClick={handleButtonClick} className="map-container__button">
        View Journey
      </button>
      <div className="map-box">
        <div ref={mapContainer} className="map-box__container">
          {viewInfoCards && (
            <div className="info-cards-container">
              {monuments.map((monument) => (
                <InfoCard
                  key={monument.id}
                  monument={monument}
                  handleCardClick={handleCardClick}
                  handleDeleteMarker={handleDeleteMarker}
                />
              ))}
            </div>
          )}
          <div
            className={`map-container-wrapper ${
              viewJourney ? "map-container-wrapper--view" : ""
            }`}
          >
            <div className="map-container-wrapper__container">
              <button
                className="map-container-wrapper__button"
                onClick={loadPrevRoute}
              >
                Load Markers
              </button>
              <div className="map-container-wrapper__section">
                <button
                  className="map-container-wrapper__button"
                  onClick={fetchRoute}
                >
                  Generate Route
                </button>

                <button
                  className="map-container-wrapper__button"
                  onClick={clearRoute}
                >
                  Clear Route
                </button>
              </div>
            </div>
            <CustomRoute saveRoute={saveRoute} />
          </div>
        </div>
        <div>
          {/* {savedRoutes.length > 0 && (
            <div className="section__saved-routes">
              <h2>Saved Routes</h2>
              {savedRoutes.map((route, index) => (
                <p key={index}>{route}</p>
              ))}
            </div>
          )} */}
        </div>
        {activeFeature && <p>Selected Location: {activeFeature}</p>}
      </div>
      {showModal && (
        <div className="modal">
          Add new monument for {currentClickedAddress}
          <form onSubmit={submitForm} className="modal__form">
            <div className="modal__form-container">
              <h2 className="modal__form-container-header">Add a Marker</h2>
              <fieldset>
                <label className="modal__form-container-label">
                  <h3>Name:</h3>
                  <input
                    type="text"
                    name="name"
                    value={monumentData.name}
                    onChange={handleInputChange}
                  />
                </label>
                <label className="modal__form-container-label">
                  <h3>Description:</h3>
                  <textarea
                    name="description"
                    value={monumentData.description}
                    onChange={handleInputChange}
                  />
                </label>
                <h3>Category:</h3>
                <select
                  name="category"
                  value={monumentData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Please choose one...</option>

                  <option value="Famous Towers & Structures">
                    Famous Towers & Structures
                  </option>
                  <option value="Historic Landmarks">Historic Landmarks</option>
                  <option value="Royal Residences">Royal Residences</option>
                  <option value="Modern Attractions">Modern Attractions</option>
                  <option value="Religious & Architectural Marvels">
                    Religious & Architectural Marvels
                  </option>
                  <option value="cultural">Cultural & Public Spaces</option>
                </select>
                <button type="submit">Save</button>
              </fieldset>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
