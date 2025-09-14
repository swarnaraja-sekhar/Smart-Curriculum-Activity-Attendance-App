// /src/App.jsx  (Simple Prototype Version)

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import FacultyProfilePage from './pages/faculty/FacultyProfilePage';
import Footer from './components/layout/Footer';

// --- (Import your Admin pages here) ---


function App() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user logs in, navigate to the appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'student' && window.location.pathname === '/student-login') {
        navigate('/student-dashboard');
      } else if (user.role === 'faculty' && window.location.pathname === '/faculty-login') {
        navigate('/faculty-dashboard');
      }
    }
  }, [user, navigate]);

  // Helper for student protected routes
  const ProtectedStudentRoute = ({ children }) => {
    if (!user) return <Navigate to="/student-login" />;
    if (user.role !== 'student') return <Navigate to="/" />;
    return children;
  };

  // Helper for faculty protected routes
  const ProtectedFacultyRoute = ({ children }) => {
    if (!user) return <Navigate to="/faculty-login" />;
    if (user.role !== 'faculty') return <Navigate to="/" />;
    return children;
  };

  return (
    <>
      <Navbar /> 
      <GlobalNotification />
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        {/* === STUDENT PROTECTED ROUTES === */}
        <Route 
          path="/student-tasks" 
          element={<ProtectedStudentRoute><StudentTaskPage /></ProtectedStudentRoute>} 
        />
        <Route 
          path="/student-dashboard" 
          element={<ProtectedStudentRoute><StudentDashboardPage /></ProtectedStudentRoute>} 
        />
        <Route 
          path="/student-attendance" 
          element={<ProtectedStudentRoute><StudentAttendancePage /></ProtectedStudentRoute>} 
        />
        <Route 
          path="/student-timetable" 
          element={<ProtectedStudentRoute><StudentTimetable /></ProtectedStudentRoute>} 
        />
        <Route 
          path="/student-profile"
          element={<ProtectedStudentRoute><StudentProfilePage /></ProtectedStudentRoute>} 
        />
        {/* <Route path="/student-timetable" element={user && user.role === 'student' ? <StudentTimetable /> : <Navigate to="/student-login" />} /> */}

        
        {/* === FACULTY PROTECTED ROUTES === */}
        <Route 
          path="/faculty-dashboard" 
          element={<ProtectedFacultyRoute><FacultyDashboard /></ProtectedFacultyRoute>} 
        />
        <Route 
          path="/faculty-reports" 
          element={<ProtectedFacultyRoute><ClassReports /></ProtectedFacultyRoute>} 
        />
        <Route 
          path="/faculty-tasks" 
          element={<ProtectedFacultyRoute><TaskManager /></ProtectedFacultyRoute>} 
        />
        <Route
          path="/faculty-students"
          element={<ProtectedFacultyRoute><StudentList /></ProtectedFacultyRoute>} 
        />
        <Route
          path="/faculty-attendance"
          element={<ProtectedFacultyRoute><FacultyAttendance /></ProtectedFacultyRoute>} 
        />
        <Route
          path="/faculty-profile"
          element={<ProtectedFacultyRoute><FacultyProfilePage /></ProtectedFacultyRoute>} 
        />
        
        {/* === CATCH-ALL ROUTE === */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;