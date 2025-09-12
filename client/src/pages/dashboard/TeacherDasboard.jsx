import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Welcome card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600">Role: <span className="font-semibold">{user.role}</span></p>
          <p className="text-gray-600">Email: <span className="font-semibold">{user.email}</span></p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 cursor-pointer text-center"
            onClick={() => navigate("/attendance")}
          >
            <h2 className="text-xl font-bold mb-2">Attendance</h2>
            <p>Mark & view student attendance</p>
          </div>

          <div
            className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 cursor-pointer text-center"
            onClick={() => navigate("/tasks")}
          >
            <h2 className="text-xl font-bold mb-2">Tasks / Challenges</h2>
            <p>Assign tasks to students</p>
          </div>

          <div
            className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 cursor-pointer text-center"
            onClick={() => navigate("/timetable")}
          >
            <h2 className="text-xl font-bold mb-2">Timetable</h2>
            <p>View class schedule</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
