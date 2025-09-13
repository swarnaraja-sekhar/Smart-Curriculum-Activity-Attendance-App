// /src/App.jsx  (Simple Prototype Version)

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Import Layout ---
import Navbar from './components/layout/Navbar';

// --- Import Public Pages ---
import HomePage from './pages/public/HomePage';
import StudentLogin from './pages/public/StudentLogin';
import FacultyLogin from './pages/public/FacultyLogin';

// --- Import Student Pages ---
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';
import StudentTimetable from './pages/student/StudentTimetable';

// --- Import Faculty Pages ---
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ClassReports from './pages/faculty/ClassReports';
import TaskManager from './pages/faculty/TaskManager';
import Footer from './components/layout/Footer';

// --- (Import your Admin pages here) ---


function App() {
  return (
    <>
      <Navbar /> 
      
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />

        {/* === ALL OTHER PAGES (Public for Demo) === */}
        {/* These are all public so you can click links to demo them */}
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        <Route path="/student-attendance" element={<StudentAttendancePage />} />
        <Route path="/student-timetable" element={<StudentTimetable />} />
        
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty-reports" element={<ClassReports />} />
        <Route path="/faculty-tasks" element={<TaskManager />} />

        {/* Add your Admin page routes here... */}
        
      </Routes>
      <Footer />
    </>
  );
}

export default App;