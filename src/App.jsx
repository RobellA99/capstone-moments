import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
import Menu from "./components/MenuSvg/MenuSvg";

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
        <Route
          path="/"
          element={
            <LandingPage
              menuDrawerOpen={menuDrawerOpen}
              isClicked={isClicked}
            />
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
