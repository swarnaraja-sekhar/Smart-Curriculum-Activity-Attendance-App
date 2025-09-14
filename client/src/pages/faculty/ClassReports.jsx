import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentData from '../../data/studentData.json';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Mock function to generate attendance data
const generateMockAttendance = (classIds) => {
  const attendance = {};
  classIds.forEach(classId => {
    attendance[classId] = studentData
      .filter(s => s.classId === classId)
      .map(s => ({
        ...s,
        attendancePercentage: Math.floor(Math.random() * (100 - 70 + 1)) + 70, // Random % between 70-100
      }));
  });
  return attendance;
};

const ClassReports = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState(user?.classIds?.[0] || '');

  const attendanceData = useMemo(() => generateMockAttendance(user.classIds || []), [user.classIds]);

  const studentsForSelectedClass = attendanceData[selectedClass] || [];

  // Data for Bar Chart (Average attendance per class)
  const barChartData = {
    labels: user.classIds,
    datasets: [
      {
        label: 'Average Attendance %',
        data: user.classIds.map(classId => {
          const students = attendanceData[classId] || [];
          if (students.length === 0) return 0;
          const total = students.reduce((sum, s) => sum + s.attendancePercentage, 0);
          return (total / students.length).toFixed(2);
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for Doughnut Chart (Attendance distribution for selected class)
  const doughnutChartData = {
    labels: ['High (>90%)', 'Medium (80-90%)', 'Low (<80%)'],
    datasets: [
      {
        data: [
          studentsForSelectedClass.filter(s => s.attendancePercentage > 90).length,
          studentsForSelectedClass.filter(s => s.attendancePercentage >= 80 && s.attendancePercentage <= 90).length,
          studentsForSelectedClass.filter(s => s.attendancePercentage < 80).length,
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#D97706', '#DC2626'],
      },
    ],
  };

  if (!user || !user.classIds) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Class Attendance Reports</h1>

        {/* Class Filter */}
        <div className="mb-6">
          <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Class to View Details:
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            {user.classIds.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Average Attendance by Class</h2>
            <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Attendance Distribution for {selectedClass}</h2>
            <Doughnut data={doughnutChartData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Student Details Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-4 border-b">Student Details for {selectedClass}</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Attendance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentsForSelectedClass.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 font-mono text-sm">{student.username}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${
                      student.attendancePercentage > 90 ? 'text-green-600' :
                      student.attendancePercentage >= 80 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {student.attendancePercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassReports