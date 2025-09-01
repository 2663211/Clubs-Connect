import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/homepage.js';
import Auth from './components/Auth.js';
import ExecPost from "./components/ExecPost.js";
import ExecDashboard from './components/ExecDashboard.js';
import UpcomingEvents from './components/UpcomingEvents.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/exec-dashboard" element={<ExecDashboard />} />
        <Route path="/exec-post" element={<ExecPost />} />

        <Route path="/addCSO" element={<AddCSO />} />
        <Route path="/CSO" element={<CSO />} />
        <Route path="/SGO" element={<SGO />} />

        {/* Redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/events" element={<UpcomingEvents />} />
      </Routes>
    </BrowserRouter>
  );
}
