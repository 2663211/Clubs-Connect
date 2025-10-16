import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/homepage';
import Auth from './components/Auth';
import SGODashboard from './components/SGODashboard';
import StudentDashboard from './components/StudentDashboard';
import ExecDashboard from './components/ExecDashboard';
import SGOentities from './components/SGOentities';
import SGOprofile from './components/SGOprofile';
import AddCSO from './components/addCSO';
import StudentProfile from './components/StudentProfile';
import AddMembers from './components/AddMembers';
import UpdateCSO from './components/UpdateCSO';
import CSOMember from './components/CSO_member';
import ExecEvents from './components/ExecEvents';
import Search from './components/Search';
import CSOPage from './components/CSOPage';
import EntityPage from './components/CSOPage';

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
        <Route path="/entities/add" element={<AddCSO />} />
        <Route path="/profile/student" element={<StudentProfile />} />
        <Route path="/cso/member" element={<CSOMember />} />

        <Route path="/events" element={<ExecEvents />} />

        <Route path="/events" element={<ExecEvents />} />

        <Route path="/entities/page" element={<CSOPage />} />
        <Route path="/entities/:entityId" element={<EntityPage />} />
        <Route path="/entities/:id/members/add" element={<AddMembers />} />
        <Route path="/entities/:csoId/update" element={<UpdateCSO />} />

        {/* Redirect unknown routes to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
