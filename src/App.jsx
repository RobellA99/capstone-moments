import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import Navigation from "./components/Navigation/Navigation";
import "./App.scss";
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
