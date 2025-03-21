import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

// Components
import Navbar from "./Components/Common/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Home/Footer";
import Dashboard from "./Components/Dashboard/Dashboard";
import About from "./Components/Home/About";

const AppContent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
