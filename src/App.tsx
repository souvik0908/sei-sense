import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './LandingPage'; // your landing page
import SeiSenseAI from './SeiSenseAI';
const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/sei-sense-ai" element={<SeiSenseAI />} />
      </Routes>
    </Router>
  );
};

export default App;