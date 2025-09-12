import React, { useState } from "react";
import { attendanceService } from "../../services/attendanceService";

const MarkAttendance = () => {
  const [message, setMessage] = useState("");

  const handleMark = async () => {
    const res = await attendanceService.markAttendance("Present");
    setMessage(res.message || "Attendance marked ✅");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow rounded-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
        <button onClick={handleMark} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Mark Attendance
        </button>
        {message && <p className="mt-4 text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default MarkAttendance;
