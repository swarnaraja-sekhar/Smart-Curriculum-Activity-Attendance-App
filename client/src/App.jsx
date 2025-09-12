import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";

// Auth
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";

// Dashboards
import StudentDashboard from "./pages/dashboard/StudentDashboard.jsx";
import TeacherDashboard from "./pages/dashboard/TeacherDasboard.jsx";
import ParentDashboard from "./pages/dashboard/ParentDashboard.jsx";

// Profile
import StudentProfile from "./pages/profile/StudentProfile.jsx";
import TeacherProfile from "./pages/profile/TeacherProfile.jsx";
import ParentProfile from "./pages/profile/ParentProfile.jsx";

// Attendance
import AttendancePage from "./pages/attendace/AttendacePage.jsx";
import MarkAttendance from "./pages/attendace/MarkAttendance.jsx";

// Tasks
import TaskPage from "./pages/tasks/TaskPage.jsx";
import TaskDetail from "./pages/tasks/TaskDetail.jsx";

// Timetable
import TimetablePage from "./pages/timetable/TimetablePage.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute role="student">
              <StudentProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute role="student">
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/mark-attendance"
          element={
            <ProtectedRoute role="student">
              <MarkAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tasks"
          element={
            <ProtectedRoute role="student">
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tasks/:id"
          element={
            <ProtectedRoute role="student">
              <TaskDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/timetable"
          element={
            <ProtectedRoute role="student">
              <TimetablePage />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute role="teacher">
              <TeacherProfile />
            </ProtectedRoute>
          }
        />

        {/* Parent Routes */}
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute role="parent">
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/profile"
          element={
            <ProtectedRoute role="parent">
              <ParentProfile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
