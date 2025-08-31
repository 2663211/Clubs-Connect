import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/homepage';
import Auth from './components/Auth';
import AddCSO from './components/addCSO';
import CSO from './components/CSO';
import SGO from './components/SGODashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/addCSO" element={<AddCSO />} />
        <Route path="/CSO" element={<CSO />} />
        <Route path="/SGO" element={<SGO />} />
        {/* Redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
