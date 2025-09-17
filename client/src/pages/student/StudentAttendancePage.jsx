import React, { useState, useEffect, useContext } from 'react';
import { 
  CheckBadgeIcon, 
  QrCodeIcon, 
  CalendarIcon, 
  ExclamationCircleIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  BookOpenIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import QRScanner from '../../components/common/QRScanner';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

// --- Helper component for the progress bars ---
const SubjectAttendanceCard = ({ subject }) => {
  const percent = Math.round((subject.attended / subject.total) * 100);

  // Set the color based on the percentage
  const isDanger = percent < 75;
  const isWarning = percent >= 75 && percent < 85;
  const isExcellent = percent >= 95;
  
  let statusColor, statusText, statusIcon;
  
  if (isDanger) {
    statusColor = 'from-red-500 to-red-600';
    statusText = 'Critical';
    statusIcon = <ExclamationCircleIcon className="w-5 h-5 text-white" />;
  } else if (isWarning) {
    statusColor = 'from-yellow-400 to-yellow-500';
    statusText = 'Adequate';
    statusIcon = <ClockIcon className="w-5 h-5 text-white" />;
  } else if (isExcellent) {
    statusColor = 'from-green-400 to-green-500';
    statusText = 'Excellent';
    statusIcon = <CheckBadgeIcon className="w-5 h-5 text-white" />;
  } else {
    statusColor = 'from-blue-500 to-blue-600';
    statusText = 'Good';
    statusIcon = <ChartBarIcon className="w-5 h-5 text-white" />;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 border border-gray-100">
      <div className={`h-2 bg-gradient-to-r ${statusColor} w-full`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <BookOpenIcon className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-800 line-clamp-1">{subject.name}</h3>
            </div>
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{subject.code}</span>
          </div>
          <div className={`flex items-center justify-center ml-2 w-14 h-14 rounded-full bg-gradient-to-br ${statusColor} text-white font-bold text-lg shadow-md`}>
            {percent}%
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-600">Attendance Rate</p>
            <div className="flex items-center space-x-1">
              <span className={`text-sm font-medium ${isDanger ? 'text-red-600' : 'text-blue-600'}`}>
                {subject.attended}/{subject.total}
              </span>
              <span className="text-xs text-gray-500">classes</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${statusColor}`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium bg-opacity-20 ${isDanger ? 'bg-red-100 text-red-700' : isWarning ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
            {statusIcon}
            <span className="ml-1">{statusText}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            {percent > 0 && (
              <span className="flex items-center">
                <ArrowUpIcon className={`w-3 h-3 mr-1 ${isDanger ? 'text-red-500' : 'text-green-500'}`} />
                Last updated: Today
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default function StudentAttendance() {
  const { user } = useContext(AuthContext);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
  
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        // The backend route for this needs to be created.
        // It should return aggregated attendance data for the student.
        const response = await axios.get(`/attendance/student/${user._id}`);
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Failed to fetch attendance data:", error);
        setNotificationMessage("Could not load attendance data.");
        setShowNotification(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  // Calculate overall attendance stats for the summary card
  const totalAttended = attendanceData.reduce((acc, subject) => acc + subject.attended, 0);
  const totalClasses = attendanceData.reduce((acc, subject) => acc + subject.total, 0);
  const overallPercent = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
  const overallIsDanger = overallPercent < 75;

  const handleScan = async (result) => {
    if (result) {
      setShowScanner(false);
      try {
        // The QR code now ONLY contains the sessionToken
        const sessionToken = result.text;
        
        const response = await axios.post('/attendance/scan', {
          sessionToken,
        });

        setNotificationMessage(response.data.message || 'Attendance marked successfully!');
        setShowNotification(true);

        // Refetch attendance to update the UI with the new stats
        const updatedAttendance = await axios.get(`/attendance/student/${user._id}`);
        setAttendanceData(updatedAttendance.data);

      } catch (error) {
        console.error('Error submitting attendance:', error);
        const errorMessage = error.response?.data?.message || 'Failed to mark attendance. Invalid QR code or session expired.';
        setNotificationMessage(errorMessage);
        setShowNotification(true);
      } finally {
        // Hide notification after 5 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      }
    }
  };

  const handleError = (error) => {
    console.error('QR Scan Error:', error);
    setShowScanner(false);
    setNotificationMessage('Failed to scan QR code. Please try again.');
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Loading your attendance data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* Header Banner */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute right-0 bottom-0 -mb-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-blue-100 mb-1 font-medium flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {currentMonth} Attendance Summary
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                My Attendance Report
              </h1>
              <p className="text-blue-100 max-w-lg hidden sm:block">
                Track your attendance records across all courses and ensure you maintain good academic standing.
              </p>
            </div>
            
            <button
              onClick={() => setShowScanner(true)}
              className="mt-4 sm:mt-0 flex items-center space-x-2 bg-white text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm font-medium self-start"
            >
              <QrCodeIcon className="w-5 h-5" />
              <span>Scan Attendance QR</span>
            </button>
          </div>
        </div>

        {/* --- QR Scanner Modal --- */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-gray-900 border-2 border-blue-500/50 rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-20"
                aria-label="Close scanner"
              >
                <XMarkIcon className="w-6 h-6 text-white" />
              </button>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-center text-white mb-2">Scan QR Code</h3>
                <p className="text-center text-gray-400 mb-6">Align the code within the frame to mark your attendance.</p>
                
                <div className="w-full aspect-square rounded-2xl overflow-hidden relative border-4 border-gray-700/80 bg-gray-800/50">
                  {/* Corner Brackets */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>

                  {/* Scanning Laser */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_10px_2px_#3b82f6] animate-scan"></div>

                  <QRScanner
                    onScan={handleScan}
                    onError={handleError}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Notification Popup --- */}
        {showNotification && (
          <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-4 flex items-center z-50 border-l-4 border-green-500">
            <CheckBadgeIcon className="w-6 h-6 text-green-500 mr-3" />
            <span className="text-gray-700">{notificationMessage}</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* --- Overall Summary Card --- */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Attendance Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Attendance Rate */}
                  <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="#e6e6e6" 
                          strokeWidth="10"
                        />
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={overallIsDanger ? "#ef4444" : "#3b82f6"} 
                          strokeWidth="10"
                          strokeDasharray={`${overallPercent * 2.83} ${(100 - overallPercent) * 2.83}`}
                          strokeDashoffset="0"
                          strokeLinecap="round"
                          transform="rotate(-90 50 50)"
                        />
                        <text 
                          x="50" y="45" 
                          textAnchor="middle" 
                          fontSize="24"
                          fontWeight="bold"
                          fill={overallIsDanger ? "#ef4444" : "#3b82f6"}
                        >
                          {overallPercent}%
                        </text>
                        <text 
                          x="50" y="65" 
                          textAnchor="middle" 
                          fontSize="10"
                          fill="#6b7280"
                        >
                          OVERALL
                        </text>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="md:col-span-2 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg ${overallIsDanger ? 'bg-red-50' : 'bg-blue-50'}`}>
                        <p className="text-sm text-gray-600">Classes Attended</p>
                        <p className="text-2xl font-bold text-gray-800">{totalAttended} <span className="text-sm text-gray-500 font-normal">/ {totalClasses}</span></p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Absence Status</p>
                        <p className={`text-lg font-bold ${overallIsDanger ? 'text-red-600' : 'text-green-600'}`}>
                          {overallIsDanger ? 'Warning' : 'Good Standing'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                        <p className="text-sm text-gray-600 mb-1">Attendance Trend</p>
                        <div className="flex items-center space-x-1">
                          {[...Array(12)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-6 w-1 rounded-full ${
                                i < 8 ? 'bg-blue-500' : 
                                i < 10 ? 'bg-blue-400' : 
                                i < 11 ? 'bg-blue-300' : 'bg-blue-200'
                              }`} 
                              style={{height: `${15 + Math.random() * 15}px`}}
                            ></div>
                          ))}
                          <ArrowUpIcon className="w-4 h-4 text-green-500 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`w-full p-3 ${overallIsDanger ? 'bg-red-500' : 'bg-blue-500'} text-white text-center`}>
                <p className="text-sm font-medium">
                  {overallIsDanger 
                    ? 'Your attendance is below the minimum requirement. Please improve attendance to avoid academic penalties.' 
                    : 'Your attendance meets the requirements. Keep up the good work!'}
                </p>
              </div>
            </div>
          
            {/* --- Subject Breakdown Cards --- */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-blue-600" />
                Subject Breakdown
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attendanceData.map((subject) => (
                  <SubjectAttendanceCard key={subject.code} subject={subject} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <QrCodeIcon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-gray-700 font-medium">Scan QR Code</span>
                </button>
                
                <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <CalendarIcon className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-700 font-medium">View Monthly Report</span>
                </button>
                
                <button className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <ExclamationCircleIcon className="w-5 h-5 text-amber-500 mr-3" />
                  <span className="text-gray-700 font-medium">Request Attendance Correction</span>
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-2">Attendance Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-5 h-5 mr-2 mt-0.5 text-blue-200" />
                  <p className="text-sm">Aim for at least 85% attendance in all subjects</p>
                </li>
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-5 h-5 mr-2 mt-0.5 text-blue-200" />
                  <p className="text-sm">Scan QR code within 10 minutes of class start</p>
                </li>
                <li className="flex items-start">
                  <CheckBadgeIcon className="w-5 h-5 mr-2 mt-0.5 text-blue-200" />
                  <p className="text-sm">Report attendance discrepancies within 48 hours</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}