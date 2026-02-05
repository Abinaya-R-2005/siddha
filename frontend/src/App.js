import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentRegister from './pages/register/StudentRegister';
import FacultyRegister from './pages/register/FacultyRegister';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route: Redirects to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/faculty" element={<FacultyRegister />} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Catch-all: Redirect unknown URLs back to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;