import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
import ParentDashboard from "./pages/dashboard/ParentDashboard";
import StudentProfile from "./pages/profile/StudentProfile";
import TeacherProfile from "./pages/profile/TeacherProfile";
import ParentProfile from "./pages/profile/ParentProfile";
import AttendancePage from "./pages/attendance/AttendancePage";
import TaskPage from "./pages/tasks/TaskPage";
import TimetablePage from "./pages/timetable/TimetablePage";
import NotFound from "./pages/NotFound";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/student"
          element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/teacher"
          element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>}
        />
        <Route
          path="/dashboard/parent"
          element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>}
        />

        <Route
          path="/profile/student"
          element={<ProtectedRoute><StudentProfile /></ProtectedRoute>}
        />
        <Route
          path="/profile/teacher"
          element={<ProtectedRoute><TeacherProfile /></ProtectedRoute>}
        />
        <Route
          path="/profile/parent"
          element={<ProtectedRoute><ParentProfile /></ProtectedRoute>}
        />

        <Route
          path="/attendance"
          element={<ProtectedRoute><AttendancePage /></ProtectedRoute>}
        />
        <Route
          path="/tasks"
          element={<ProtectedRoute><TaskPage /></ProtectedRoute>}
        />
        <Route
          path="/timetable"
          element={<ProtectedRoute><TimetablePage /></ProtectedRoute>}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
