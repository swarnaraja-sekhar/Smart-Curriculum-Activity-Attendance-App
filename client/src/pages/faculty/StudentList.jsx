import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentData from '../../data/studentData.json';

const StudentList = () => {
  const { user } = useAuth();

  // Ensure user and user.classIds are available before setting initial state
  const [selectedClass, setSelectedClass] = useState(user?.classIds?.[0] || '');

  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];
    // Add mock attendance data for demonstration
    return studentData
      .filter(student => student.classId === selectedClass)
      .map(student => ({
        ...student,
        attendance: `${Math.floor(Math.random() * (98 - 85 + 1)) + 85}%` // Random % between 85-98
      }));
  }, [selectedClass]);

  if (!user || !user.classIds) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Loading...</h1>
          <p>If this persists, please log out and log back in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Students</h1>

        {/* Class Filter */}
        <div className="mb-6">
          <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Class:
          </label>
          <select
            id="classFilter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full max-w-xs p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            {user.classIds.map(classId => (
              <option key={classId} value={classId}>
                {classId}
              </option>
            ))}
          </select>
        </div>

        {/* Student Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      parseInt(student.attendance) >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.attendance}
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

export default StudentList;
