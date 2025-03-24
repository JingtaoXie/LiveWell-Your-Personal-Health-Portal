import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Analysis from './pages/analysis'; 
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import BasicInfo from './pages/basicInfoCollection';
import ModifyInfo from './pages/modifyInfo';
import Scanning from './pages/scanning';
import Diets from './pages/dietStats';
import DiabetesPrediction from './pages/diabetesPrediction';
import LiverDiseasePrediction from './pages/liverDiseasePrediction';
import HeartDiseasePrediction from './pages/heartDiseasePrediction';
import YourReport from './pages/yourReport';
import ContactUs from './pages/contactUs'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/basicInfo" element={<BasicInfo />} />
        <Route path="/modifyInfo" element={<ModifyInfo />} />
        <Route path="/scanning" element={<Scanning />} />
        <Route path="/dietStats" element={<Diets />} />
        <Route path="/diabetesPrediction" element={<DiabetesPrediction />} />
        <Route path="/liverDiseasePrediction" element={<LiverDiseasePrediction />} />
        <Route path="/heartDiseasePrediction" element={<HeartDiseasePrediction />} />
        <Route path="/yourHealthReport" element={<YourReport />} />
        <Route path="/contactUs" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
