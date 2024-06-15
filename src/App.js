import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import "./assets/styles/App.css";
import About from "./pages/AboutPage";
import Faq from "./pages/FaqPage";
import RulesPage from "./pages/RulesPage";
import SchedulePage from "./pages/SchedulePage";

const App = () => {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
