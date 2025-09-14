// /src/App.jsx  (Simple Prototype Version)

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; 
// --- Import Layout ---
import Navbar from './components/layout/Navbar';
import GlobalNotification from './components/layout/GlobalNotification';
// --- Import Public Pages ---
import HomePage from './pages/public/HomePage';
import StudentLogin from './pages/public/StudentLogin';
import FacultyLogin from './pages/public/FacultyLogin';

// --- Import Student Pages ---
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentAttendancePage from './pages/student/StudentAttendancePage';
import StudentTimetable from './pages/student/StudentTimetable';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentTaskPage from './pages/student/StudentTaskPage';
// --- Import Faculty Pages ---
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ClassReports from './pages/faculty/ClassReports';
import TaskManager from './pages/faculty/TaskManager';
import StudentList from './pages/faculty/StudentList';
import FacultyAttendance from './pages/faculty/FacultyAttendance';
import Footer from './components/layout/Footer';

// --- (Import your Admin pages here) ---


function App() {
  const { user } = useAuth();
  return (
    <>
      <Navbar /> 
       <GlobalNotification />
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<HomePage />} />
 <Route 
          path="/student-login" 
          element={!user ? <StudentLogin /> : <Navigate to="/student-dashboard" />} 
        />
        <Route 
          path="/faculty-login" 
          element={!user ? <FacultyLogin /> : <Navigate to="/faculty-dashboard" />} 
        />
                <Route 
          path="/student-tasks"  /* <-- 4. ADD THE NEW ROUTE */
          element={user && user.role === 'student' ? <StudentTaskPage /> : <Navigate to="/student-login" />}
        />

        {/* === STUDENT PROTECTED ROUTES === */}
        <Route 
          path="/student-dashboard" 
          element={user && user.role === 'student' ? <StudentDashboardPage /> : <Navigate to="/student-login" />}
        />
        <Route 
          path="/student-attendance" 
          element={user && user.role === 'student' ? <StudentAttendancePage /> : <Navigate to="/student-login" />}
        />
          <Route 
          path="/student-timetable" 
          element={user && user.role === 'student' ? <StudentTimetable /> : <Navigate to="/student-login" />}
        />
        <Route 
          path="/student-profile"
          element={user && user.role === 'student' ? <StudentProfilePage /> : <Navigate to="/student-login" />}
        />
        {/* <Route path="/student-timetable" element={user && user.role === 'student' ? <StudentTimetable /> : <Navigate to="/student-login" />} /> */}

        
        {/* === FACULTY PROTECTED ROUTES === */}
        <Route 
          path="/faculty-dashboard" 
          element={user && user.role === 'faculty' ? <FacultyDashboard /> : <Navigate to="/faculty-login" />}
        />
        <Route 
          path="/faculty-reports" 
          element={user && user.role === 'faculty' ? <ClassReports /> : <Navigate to="/faculty-login" />}
        />
         <Route 
          path="/faculty-tasks" 
          element={user && user.role === 'faculty' ? <TaskManager /> : <Navigate to="/faculty-login" />}
        />
        <Route
          path="/faculty-students"
          element={user && user.role === 'faculty' ? <StudentList /> : <Navigate to="/faculty-login" />}
        />
        <Route
          path="/faculty-attendance"
          element={user && user.role === 'faculty' ? <FacultyAttendance /> : <Navigate to="/faculty-login" />}
        />
        
        {/* === CATCH-ALL ROUTE === */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;