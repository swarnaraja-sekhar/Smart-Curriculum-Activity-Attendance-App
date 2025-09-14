import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentData from '../../data/studentData.json';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  AcademicCapIcon,  
  ArrowTrendingUpIcon,  
  ChartBarIcon, 
  ChartPieIcon, 
  ClipboardDocumentCheckIcon, 
  ExclamationCircleIcon, 
  MagnifyingGlassIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { ArrowTrendingDownIcon } from '@heroicons/react/24/solid';

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
        backgroundColor: 'rgba(79, 70, 229, 0.6)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
        borderRadius: 6,
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
        borderWidth: 1,
        borderColor: ['#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };
  
  // Calculate summary statistics
  const totalStudents = studentsForSelectedClass.length;
  const averageAttendance = totalStudents 
    ? studentsForSelectedClass.reduce((sum, s) => sum + s.attendancePercentage, 0) / totalStudents 
    : 0;
  const highAttendanceCount = studentsForSelectedClass.filter(s => s.attendancePercentage > 90).length;
  const mediumAttendanceCount = studentsForSelectedClass.filter(s => s.attendancePercentage >= 80 && s.attendancePercentage <= 90).length;
  const lowAttendanceCount = studentsForSelectedClass.filter(s => s.attendancePercentage < 70).length;

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const filteredStudents = studentsForSelectedClass.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !user.classIds) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading class data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Page Header with Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
                <ChartBarIcon className="w-8 h-8 mr-3" />
                Class Attendance Reports
              </h1>
              <p className="mt-2 text-blue-100">
                Analyze attendance patterns and student engagement
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-white text-indigo-700 hover:bg-blue-50 rounded-lg shadow-sm flex items-center transition-colors duration-200">
                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Class Filter and Search Area */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="w-full sm:w-64">
              <label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                id="classFilter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                {user.classIds.map(id => <option key={id} value={id}>{id}</option>)}
              </select>
            </div>
            
            <div className="w-full sm:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-xs font-medium">
                  <span className="text-indigo-600 flex items-center">
                    <AcademicCapIcon className="w-3 h-3 mr-1" /> Class {selectedClass}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
              </div>
            </div>
            <div className="h-1 w-full bg-indigo-100"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-xs font-medium">
                  <span className="text-blue-600 flex items-center">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> Overall
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Average Attendance</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{averageAttendance.toFixed(1)}%</p>
              </div>
            </div>
            <div className="h-1 w-full bg-blue-100"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ChartPieIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-xs font-medium">
                  <span className="text-green-600 flex items-center">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1" /> High Attendance
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Students {'>'}90%</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{highAttendanceCount} <span className="text-sm text-gray-500">({(highAttendanceCount/totalStudents*100).toFixed(1)}%)</span></p>
              </div>
            </div>
            <div className="h-1 w-full bg-green-100"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="bg-red-100 p-3 rounded-lg">
                  <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-xs font-medium">
                  <span className="text-red-600 flex items-center">
                    <ArrowTrendingUpIcon className="w-3 h-3 mr-1 rotate-180" /> Low Attendance
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Students {'<'}80%</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{lowAttendanceCount} <span className="text-sm text-gray-500">({(lowAttendanceCount/totalStudents*100).toFixed(1)}%)</span></p>
              </div>
            </div>
            <div className="h-1 w-full bg-red-100"></div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Average Attendance by Class
            </h2>
            <div className="h-64">
              <Bar data={barChartData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { display: false } 
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                      callback: function(value) {
                        return value + '%';
                      }
                    }
                  }
                }
              }} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ChartPieIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Attendance Distribution for {selectedClass}
            </h2>
            <div className="h-64 flex items-center justify-center">
              <Doughnut data={doughnutChartData} options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20
                    }
                  }
                }
              }} />
            </div>
          </div>
        </div>

        {/* Student Details Table */}
        <div className="bg-white shadow-sm rounded-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
              <UserGroupIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Student Attendance Details
            </h2>
            <p className="text-sm text-gray-500">
              {filteredStudents.length} students in {selectedClass} {searchTerm && `(filtered from ${totalStudents})`}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">{student.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm mr-3">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.branch || 'Computer Science'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className={`h-2.5 rounded-full ${
                              student.attendancePercentage > 90 ? 'bg-green-600' :
                              student.attendancePercentage >= 80 ? 'bg-yellow-500' : 'bg-red-600'
                            }`}
                            style={{ width: `${student.attendancePercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 mt-1 block">{student.attendancePercentage}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.attendancePercentage > 90 
                            ? 'bg-green-100 text-green-800' 
                            : student.attendancePercentage >= 80 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {student.attendancePercentage > 90 ? 'Excellent' : 
                           student.attendancePercentage >= 80 ? 'Good' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-lg">No students match your search criteria</p>
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="mt-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Clear search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassReports