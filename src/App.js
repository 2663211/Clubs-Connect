import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/homepage";
import Auth from "./components/Auth";
<<<<<<< HEAD
import SGODashboard from './components/SGODashboard';
import StudentDashboard from './components/StudentDashboard';
import ExecDashboard from './components/ExecDashboard';
import SGOentities from './components/SGOentities';
import SGOprofile from './components/SGOprofile';
import StudentProfile from "./components/StudentProfile";



=======
import SGODashboard from "./components/SGODashboard";
import StudentDashboard from "./components/StudentDashboard";
import ExecDashboard from "./components/ExecDashboard";
import SGOentities from "./components/SGOentities";
import SGOprofile from "./components/SGOprofile";
import AddCSO from "./components/addCSO";
>>>>>>> 7a86cd0049b71a2457039fd7dae9096bb8a00162

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/sgo" element={<SGODashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/exec" element={<ExecDashboard />} />
        <Route path="/entities/sgo" element={<SGOentities />} />
        <Route path="/profile/sgo" element={<SGOprofile />} />
<<<<<<< HEAD
        <Route path="/profile/student" element={<StudentProfile />} />
        
=======
        <Route path="/entities/add" element={<AddCSO />} />
>>>>>>> 7a86cd0049b71a2457039fd7dae9096bb8a00162

        {/* Redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
