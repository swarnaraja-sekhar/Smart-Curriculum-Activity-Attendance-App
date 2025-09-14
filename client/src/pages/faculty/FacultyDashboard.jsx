import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  AcademicCapIcon, 
  UserGroupIcon, 
  ClipboardDocumentCheckIcon,
  PresentationChartLineIcon,
  CalendarIcon,
  ChartBarIcon,
  BellIcon,
  QrCodeIcon,
  
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { NavLink, useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Quick Stats Cards Data
  const stats = [
    {
      title: "Classes Today",
      value: "4",
      icon: AcademicCapIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+1 from last week",
      trend: "up"
    },
    {
      title: "Total Students",
      value: "120",
      icon: UserGroupIcon,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      change: "No change",
      trend: "neutral"
    },
    {
      title: "Pending Tasks",
      value: "3",
      icon: ClipboardDocumentCheckIcon,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      change: "-2 from yesterday",
      trend: "down"
    },
    {
      title: "Average Attendance",
      value: "85%",
      icon: PresentationChartLineIcon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      change: "+3% this month",
      trend: "up"
    }
  ];

  // Today's Schedule Data
  const todaySchedule = [
    {
      subject: "Data Structures",
      time: "09:00 AM - 10:30 AM",
      room: "101",
      students: 32,
      attendanceRate: 90,
      status: "completed"
    },
    {
      subject: "Database Management",
      time: "11:00 AM - 12:30 PM",
      room: "202",
      students: 28,
      attendanceRate: 85,
      status: "current"
    },
    {
      subject: "Computer Networks",
      time: "01:30 PM - 03:00 PM",
      room: "303",
      students: 30,
      attendanceRate: 0,
      status: "upcoming"
    },
    {
      subject: "Algorithm Design",
      time: "03:30 PM - 05:00 PM",
      room: "404",
      students: 25,
      attendanceRate: 0,
      status: "upcoming"
    }
  ];

  // Recent Notifications
  const notifications = [
    {
      title: "New attendance policy update",
      time: "Today, 10:30 AM",
      type: "info"
    },
    {
      title: "Student submission deadline reminder",
      time: "Yesterday, 2:15 PM",
      type: "warning"
    },
    {
      title: "Department meeting scheduled",
      time: "Sept 15, 9:00 AM",
      type: "event"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Section with Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold">
                Welcome back, {user?.name?.split(' ')[0] || 'Professor'}
              </h1>
              <p className="mt-2 text-blue-100">
                {user?.designation || 'Assistant Professor'} | {user?.department || 'Computer Science'}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(user?.subjects || ['Data Structures', 'Database Management', 'Computer Networks'])?.map((subject, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={()=>navigate('/generate-qr')}
                className="px-4 py-2 bg-white text-indigo-700 hover:bg-blue-50 rounded-lg shadow-sm flex items-center transition-colors duration-200"
              >
                <QrCodeIcon className="w-5 h-5 mr-2" />
                <span>Generate QR</span>
              </button>
              
              <button
                onClick={()=>navigate('/faculty-attendance')}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg shadow-sm flex items-center transition-colors duration-200"
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />
                <span>Take Attendance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white border-b shadow-sm sticky top-16 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                selectedTab === 'overview'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedTab('schedule')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                selectedTab === 'schedule'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              Today's Schedule
            </button>
            <button
              onClick={() => setSelectedTab('tasks')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                selectedTab === 'tasks'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              Tasks & Activities
            </button>
            <button
              onClick={() => setSelectedTab('reports')}
              className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${
                selectedTab === 'reports'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-indigo-600'
              }`}
            >
              Reports
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard Content - Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-lg`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-xs font-medium">
                        {stat.trend === 'up' && <span className="text-emerald-600 flex items-center"><ArrowTrendingUpIcon className="w-3 h-3 mr-1 rotate-0" /> {stat.change}</span>}
                        {stat.trend === 'down' && <span className="text-rose-600 flex items-center"><ArrowTrendingUpIcon className="w-3 h-3 mr-1 rotate-180" /> {stat.change}</span>}
                        {stat.trend === 'neutral' && <span className="text-gray-600">{stat.change}</span>}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color} mt-1`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                  <div className={`h-1 w-full ${stat.bgColor}`}></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Classes */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                    Today's Classes
                  </h2>
                  <span className="text-sm bg-indigo-50 text-indigo-700 py-1 px-3 rounded-full">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="space-y-4">
                  {todaySchedule.map((classItem, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border ${
                        classItem.status === 'completed' 
                          ? 'bg-gray-50 border-gray-200' 
                          : classItem.status === 'current'
                            ? 'bg-blue-50 border-blue-200 relative' 
                            : 'bg-white border-gray-200'
                      }`}
                    >
                      {classItem.status === 'current' && (
                        <div className="absolute right-0 top-0 h-full w-1 bg-blue-500 rounded-r-lg"></div>
                      )}
                      
                      <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                        <div className={`p-2 rounded-lg ${
                          classItem.status === 'completed' 
                            ? 'bg-gray-100 text-gray-600' 
                            : classItem.status === 'current'
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {classItem.status === 'completed' 
                            ? <CheckCircleIcon className="w-6 h-6" />
                            : classItem.status === 'current'
                              ? <ClockIcon className="w-6 h-6" />
                              : <BookOpenIcon className="w-6 h-6" />
                          }
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{classItem.subject}</h3>
                          <div className="flex flex-wrap items-center mt-1 text-sm text-gray-500 gap-x-3">
                            <span className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {classItem.time}
                            </span>
                            <span className="flex items-center">
                              <AcademicCapIcon className="w-4 h-4 mr-1" />
                              Room {classItem.room}
                            </span>
                            <span className="flex items-center">
                              <UserGroupIcon className="w-4 h-4 mr-1" />
                              {classItem.students} students
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {classItem.status === 'completed' && (
                          <div className="bg-gray-100 py-1 px-3 rounded-full text-sm font-medium text-gray-700">
                            {classItem.attendanceRate}% attended
                          </div>
                        )}
                        {classItem.status === 'current' && (
                          <button 
                            onClick={() => navigate('/faculty-attendance')}
                            className="py-1.5 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            Take Attendance
                          </button>
                        )}
                        {classItem.status === 'upcoming' && (
                          <div className="bg-indigo-100 py-1 px-3 rounded-full text-sm font-medium text-indigo-700">
                            Upcoming
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button 
                    onClick={() => setSelectedTab('schedule')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    View Full Schedule
                  </button>
                </div>
              </div>

              {/* Notifications and Quick Actions */}
              <div className="space-y-6">
                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <BellIcon className="w-5 h-5 mr-2 text-indigo-600" />
                      Notifications
                    </h2>
                    <span className="text-xs bg-red-50 text-red-700 font-medium py-1 px-2 rounded-full">
                      {notifications.length} new
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {notifications.map((notification, index) => (
                      <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <p className="font-medium text-gray-800">{notification.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{notification.time}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.type === 'info' 
                              ? 'bg-blue-50 text-blue-700' 
                              : notification.type === 'warning'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {notification.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => navigate('/generate-qr')}
                      className="flex flex-col items-center justify-center p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <QrCodeIcon className="w-6 h-6 text-indigo-600 mb-2" />
                      <span className="text-indigo-700 font-medium text-sm text-center">Generate QR</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/faculty-reports')}
                      className="flex flex-col items-center justify-center p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      <ChartBarIcon className="w-6 h-6 text-emerald-600 mb-2" />
                      <span className="text-emerald-700 font-medium text-sm text-center">View Reports</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/faculty-tasks')}
                      className="flex flex-col items-center justify-center p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-600 mb-2" />
                      <span className="text-amber-700 font-medium text-sm text-center">Manage Tasks</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/faculty-students')}
                      className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <UserGroupIcon className="w-6 h-6 text-blue-600 mb-2" />
                      <span className="text-blue-700 font-medium text-sm text-center">View Students</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Today's Schedule Tab (Placeholder) */}
        {selectedTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <CalendarIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Today's Full Schedule
            </h2>
            <p className="text-gray-600">Detailed schedule content would go here.</p>
          </div>
        )}
        
        {/* Tasks Tab (Placeholder) */}
        {selectedTab === 'tasks' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <ClipboardDocumentCheckIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Tasks & Activities
            </h2>
            <p className="text-gray-600">Task management content would go here.</p>
          </div>
        )}
        
        {/* Reports Tab (Placeholder) */}
        {selectedTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-600" />
              Reports & Analytics
            </h2>
            <p className="text-gray-600">Reports and analytics content would go here.</p>
          </div>
        )}
      </div>
      
      {/* We don't need the style tag here - moved to index.css or similar global CSS file */}
    </div>
  );
};

export default FacultyDashboard;