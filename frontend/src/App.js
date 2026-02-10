import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentRegister from './pages/register/StudentRegister';
import FacultyRegister from './pages/register/FacultyRegister';
import Dashboard from './pages/Dashboard';
import CreateTest from './pages/CreateTest';
import AdminDashboard from './admin/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';
import TestPage from './pages/TestPage';
import Home from './pages/Home';
import StudentHome from './pages/StudentHome';

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/faculty" element={<FacultyRegister />} />

        {/* Student Home Route */}
        <Route path="/student-home" element={<StudentHome />} />

        {/* Protected Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-test" element={<CreateTest />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/progresspage" element={<ProgressPage />} />
        <Route path="/test/:id" element={<TestPage />} />

        {/* Catch-all: Redirect unknown URLs back to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;