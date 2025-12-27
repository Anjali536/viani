import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Diagnosis from "./components/Diagnosis";
import LearnMore from "./components/learnMore";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Homepage Route */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <HowItWorks />
              <About />
              <Footer />
            </>
          }
        />

        {/* Diagnosis Page Route */}
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/learnMore" element={<LearnMore />} />
      </Routes>
    </Router>
  );
}

export default App;
