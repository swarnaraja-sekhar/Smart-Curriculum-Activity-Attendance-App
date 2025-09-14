import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  PresentationChartLineIcon 
} from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Quick Stats Cards Data
  const stats = [
    {
      title: "Classes Today",
      value: "4",
      icon: AcademicCapIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Students",
      value: "120",
      icon: UserGroupIcon,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Pending Tasks",
      value: "3",
      icon: ClipboardDocumentCheckIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Average Attendance",
      value: "85%",
      icon: PresentationChartLineIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || 'Faculty'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.designation} | {user?.department}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {user?.subjects?.map((subject, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {user?.subjects?.map((subject, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{subject}</p>
                  <p className="text-sm text-gray-600">
                    {['09:00 AM', '10:30 AM', '01:30 PM'][index % 3]} - Room {['101', '202', '303'][index % 3]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={()=>navigate('/faculty-attendance')} className="flex items-center justify-center space-x-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
              <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-600" />
              <span className="text-blue-600 font-medium">Take Attendance</span>
            </button>
            <button onClick={() => navigate('/faculty-reports')} className="flex items-center justify-center space-x-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition">
              <PresentationChartLineIcon className="w-6 h-6 text-green-600" />
              <span className="text-green-600 font-medium">View Reports</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
              <span className="text-purple-600 font-medium">Manage Students</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;