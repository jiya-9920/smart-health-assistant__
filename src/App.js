// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Signup from "./Signup";
import Login from "./Login";
import LandingPage from "./LandingPage";
import LearnMore from "./LearnMore";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import PredictionForm from "./PredictionForm";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <PredictionForm user={user} /> : <LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/learnmore" element={<LearnMore />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
