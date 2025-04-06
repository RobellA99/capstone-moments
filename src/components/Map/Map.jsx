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

export default function Map({ resetTrigger, selectedCategories }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const formRef = useRef(null);
  const mapContainerRef = useRef(null);
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
  const [savedRoutes, setSavedRoutes] = useState(
    JSON.parse(localStorage.getItem("SAVED_ROUTES")) || []
  );
  const [viewJourney, setViewJourney] = useState(false);
  const [startingMarker, setStartingMarker] = useState(null);
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);

  const saveRoute = (routeName, tags) => {
    const newRoute = {
      name: routeName,
      tags: tags.split(",").map((tag) => tag.trim()),
      route: currentRoute,
    };

    const updatedRoutes = [...savedRoutes, newRoute];
    setSavedRoutes(updatedRoutes);

    localStorage.setItem("SAVED_ROUTES", JSON.stringify(updatedRoutes));
    alert("Route saved successfully!");
  };

  let query = useQuery();

  useEffect(() => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    monuments.forEach((monument) => {
      const marker = new mapboxgl.Marker({ color: "orange" })
        .setLngLat([monument.longitude, monument.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${monument.name}</h3>`))
        .addTo(map.current);

      // marker.getElement().addEventListener("mouseenter", () => {
      //   const popup = new mapboxgl.Popup({ offset: 25 })
      //     .setHTML(`<h3>${monument.name}</h3>`)
      //     .addTo(map.current);
      //   marker.setPopup(popup);
      // });

      // marker.getElement().addEventListener("mouseleave", () => {
      //   marker.getPopup().remove();
      // });

      marker.getElement().addEventListener("click", () => {
        const { lng, lat } = marker.getLngLat();
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true,
        });
        marker.togglePopup();
      });

      markersRef.current.push(marker);
    });
  }, [monuments]);

  const fetchMonuments = async (useQueryParams) => {
    try {
      let requestUrl;

      if (useQueryParams) {
        const categories = query.get("categories");
        if (!categories) {
          requestUrl = `http://localhost:5050/monuments`;
        } else {
          requestUrl = `http://localhost:5050/monuments?categories=${encodeURIComponent(
            categories
          )}`;
        }
      }

      const response = await axios.get(requestUrl);
      const monuments = response.data;

      if (!monuments.length) {
        console.warn("No monuments found for the selected categories.");
        return;
      }

      setMonuments(monuments);
    } catch (error) {
      console.error("Error fetching monuments:", error);
    }
  };

  useEffect(() => {
    fetchMonuments(true);
  }, [selectedCategories]);

  const fetchRoute = async () => {
    if (!startingMarker) {
      alert("Please select a starting marker!");
      return;
    }

    const orderedMonuments = monuments.map((monument) => ({
      id: monument.id,
      coordinates: `${monument.longitude},${monument.latitude}`,
    }));

    const startMonument = orderedMonuments.find(
      (monument) => monument.id === startingMarker
    );

    if (!startMonument) {
      console.error("Starting marker not found.");
      return;
    }

    const remainingMonuments = orderedMonuments.filter(
      (monument) => monument.id !== startingMarker
    );
    const allCoordinates = [
      startMonument.coordinates,
      ...remainingMonuments.map((monument) => monument.coordinates),
    ];

    if (allCoordinates.length < 2) {
      console.error("Not enough coordinates to generate a route.");
      return;
    }

    const coords = allCoordinates.join(";");

    try {
      const response = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${
          mapboxgl.accessToken
        }&geometries=geojson&overview=full&steps=true&waypoints=0;${
          allCoordinates.length - 1
        }`
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
        }

        if (map.current.getLayer("routearrows")) {
          map.current.getSource("route").setData({
            type: "Feature",
            geometry: routeGeometry,
          });
        } else {
          map.current.addLayer({
            id: "routearrows",
            type: "symbol",
            source: "route",
            layout: {
              "symbol-placement": "line",
              "symbol-spacing": 50,
              "text-field": "▶",
              "icon-size": 0.8,
            },
            paint: {
              "icon-color": "#ff7e5f",
            },
          });
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

    if (map.current.getLayer("routearrows")) {
      map.current.removeLayer("routearrows");
    }

    setActiveFeature("");
    setCurrentRoute(null);
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

    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  const addMonument = async () => {
    if (
      !monumentData.name ||
      !monumentData.description ||
      !monumentData.category
    ) {
      alert("Please enter a name, description, and category!");
      return;
    }

    try {
      const newMonument = {
        ...monumentData,
        id: Date.now(),
      };

      setMonuments((prevMonuments) => [...prevMonuments, newMonument]);

      const marker = new mapboxgl.Marker({ color: "orange" })
        .setLngLat([newMonument.longitude, newMonument.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${newMonument.name}</h3>`))
        .addTo(map.current);

      markersRef.current.push(marker);

      setShowModal(false);
      setMonumentData({
        name: "",
        description: "",
        latitude: "",
        longitude: "",
        category: "",
        location: "London, UK",
      });

      setTimeout(() => {
        if (mapContainerRef.current) {
          mapContainerRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    } catch (error) {
      console.error("Error adding monument:", error);
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
    <div className="map-container" ref={mapContainerRef}>
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
                  setStartingMarker={setStartingMarker}
                  startingMarker={startingMarker}
                />
              ))}
            </div>
          )}
          <div
            className={`map-container-wrapper ${
              viewJourney ? "map-container-wrapper--view" : ""
            }`}
          >
            <div className="map-container-wrapper__box">
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
            </div>
            <CustomRoute saveRoute={saveRoute} />
          </div>
        </div>
        {/* {showSavedRoutes && (
          <div className="saved-routes-container">
            <h2>Saved Routes</h2>
            {savedRoutes.length > 0 ? (
              savedRoutes.map((route, index) => (
                <div key={index} className="saved-route">
                  <h3>{route.name}</h3>
                  <p>Tags: {route.tags.join(", ")}</p>
                  <button
                    onClick={() => {
                      setCurrentRoute(route.route);
                      alert(`Loaded route: ${route.name}`);
                    }}
                  >
                    Load Route
                  </button>
                </div>
              ))
            ) : (
              <p>No saved routes available.</p>
            )}
          </div>
        )} */}
      </div>
      {showModal && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="modal">
            <button
              className="modal__close-button"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <form onSubmit={submitForm} className="modal__form">
              <div className="modal__form-container">
                <h2 className="modal__form-container-header">Add a Marker</h2>
                <fieldset className="modal__form-container-fieldset">
                  <div className="modal__form-container-container">
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
                  </div>
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
                    <option value="Historic Landmarks">
                      Historic Landmarks
                    </option>
                    <option value="Royal Residences">Royal Residences</option>
                    <option value="Modern Attractions">
                      Modern Attractions
                    </option>
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
        </>
      )}
    </div>
  );
}
