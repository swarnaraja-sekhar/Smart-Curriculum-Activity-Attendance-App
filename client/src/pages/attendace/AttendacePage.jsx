import React from "react";

const AttendancePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Attendance</h1>
        <p className="text-gray-600 mb-4">Mark your attendance or view your attendance record.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow text-center cursor-pointer hover:bg-blue-200">
            Mark Attendance
          </div>
          <div className="bg-green-100 p-4 rounded shadow text-center cursor-pointer hover:bg-green-200">
            View Attendance
          </div>
          <div className="bg-purple-100 p-4 rounded shadow text-center cursor-pointer hover:bg-purple-200">
            Attendance Report
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
