import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentRegister from './pages/register/StudentRegister';
import FacultyRegister from './pages/register/FacultyRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/student" element={<StudentRegister />} />
        <Route path="/register/faculty" element={<FacultyRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
