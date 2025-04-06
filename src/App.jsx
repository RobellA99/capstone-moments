import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import Footer from "./components/Footer/Footer";
import { useState } from "react";
// import Menu from "./components/MenuSvg/MenuSvg";
import MapPage from "./pages/MapPage/MapPage";
import LandingPage from "./pages/LandingPage/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
