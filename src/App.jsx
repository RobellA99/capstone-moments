import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import Menu from "./components/MenuSvg/MenuSvg";
import MapPage from "./pages/MapPage/MapPage";
import LandingPage from "./pages/LandingPage/LandingPage";

export default function App() {
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setMenuDrawerOpen(!menuDrawerOpen);
    setIsClicked(!isClicked);
  };
  return (
    <BrowserRouter>
      <div className="container">
        <button
          onClick={handleClick}
          className={`container__button ${
            !isClicked ? "" : "container__button--inverted"
          }`}
        >
          <Menu isClicked={isClicked} />
        </button>
        <Navigation
          menuDrawerOpen={menuDrawerOpen}
          setMenuDrawerOpen={setMenuDrawerOpen}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
        />
      </div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/map"
          element={
            <MapPage menuDrawerOpen={menuDrawerOpen} isClicked={isClicked} />
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
