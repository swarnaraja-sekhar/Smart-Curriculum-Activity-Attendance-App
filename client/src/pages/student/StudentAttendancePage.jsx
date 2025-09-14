// /src/pages/student/StudentAttendance.jsx

import React, { useState } from 'react';
import { CheckBadgeIcon, QrCodeIcon } from '@heroicons/react/24/solid';
import QRScanner from '../../components/common/QRScanner';

// --- MOCK DATA FOR PROTOTYPE ---
// This data array lists the student's attendance per subject.
const attendanceData = [
  { code: "CS301", name: "Data Structures & Algorithms", total: 30, attended: 28 },
  { code: "CS302", name: "Database Management Systems", total: 28, attended: 27 },
  { code: "CS303", name: "Operating Systems Lab", total: 25, attended: 20 }, // This one is 80%
  { code: "HS401", name: "Professional Ethics", total: 15, attended: 15 },
  { code: "MA205", name: "Statistics & Probability", total: 22, attended: 16 }, // This one is < 75%
];

// --- Helper component for the progress bars ---
const SubjectAttendanceCard = ({ subject }) => {
  const percent = Math.round((subject.attended / subject.total) * 100);

  // Set the color based on the percentage
  const isDanger = percent < 75;
  const barColor = isDanger ? 'bg-red-600' : 'bg-blue-600';
  const textColor = isDanger ? 'text-red-600' : 'text-blue-600';

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-gray-800">{subject.name}</h3>
        <span className="text-sm font-medium text-gray-500">{subject.code}</span>
      </div>
      <div className="flex justify-between items-end mb-1">
        <p className="text-sm text-gray-600">Attended {subject.attended} of {subject.total} classes</p>
        <span className={`text-2xl font-bold ${textColor}`}>{percent}%</span>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};


export default function StudentAttendance() {
  const [showScanner, setShowScanner] = useState(false);
  
  // Calculate overall attendance stats for the summary card
  const totalAttended = attendanceData.reduce((acc, subject) => acc + subject.attended, 0);
  const totalClasses = attendanceData.reduce((acc, subject) => acc + subject.total, 0);
  const overallPercent = Math.round((totalAttended / totalClasses) * 100);
  const overallIsDanger = overallPercent < 75;

  const handleScan = (result) => {
    // Handle the QR code result here
    console.log('QR Code scanned:', result);
    setShowScanner(false);
    // TODO: Implement attendance marking logic
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header with Scan Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Attendance Report</h1>
          <button
            onClick={() => setShowScanner(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <QrCodeIcon className="w-6 h-6" />
            <span className="font-medium">Scan Attendance QR</span>
          </button>
          
          {showScanner && (
            <QRScanner
              onClose={() => setShowScanner(false)}
              onScan={handleScan}
            />
          )}
        </div>

        {/* --- Overall Summary Card --- */}
        <div className={`bg-white rounded-xl shadow-lg p-6 mb-8 border-l-8 ${overallIsDanger ? 'border-red-500' : 'border-green-500'}`}>
          <div className="flex items-center space-x-4">
            <CheckBadgeIcon className={`w-16 h-16 ${overallIsDanger ? 'text-red-500' : 'text-green-500'}`} />
            <div>
              <p className="text-sm font-medium text-gray-500">Overall Attendance</p>
              <p className={`text-5xl font-extrabold ${overallIsDanger ? 'text-red-600' : 'text-green-600'}`}>
                {overallPercent}%
              </p>
              <p className="text-gray-600 mt-1">
                You have attended a total of <strong>{totalAttended}</strong> out of <strong>{totalClasses}</strong> classes.
              </p>
            </div>
          </div>
        </div>

        {/* --- Subject Breakdown Cards --- */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Subject Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attendanceData.map((subject) => (
            <SubjectAttendanceCard key={subject.code} subject={subject} />
          ))}
        </div>

      </div>
    </div>
  );
}