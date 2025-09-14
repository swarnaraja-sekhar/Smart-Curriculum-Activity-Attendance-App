import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  ClockIcon,
  SparklesIcon, 
  ArrowRightIcon, 
  ChartPieIcon, 
  StarIcon,
  LightBulbIcon,
  CheckCircleIcon,
  QrCodeIcon,
  CalendarIcon,
  AcademicCapIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { weeklyStudyPlan, taskDatabase } from '../../context/AuthContext'; // Import data
import timetableData from '../../data/timetable.json';
import QRScanner from '../../components/common/QRScanner';

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayName = dayNames[new Date().getDay()];

// --- Helper function to get current time slot ---
const getCurrentTimeSlot = (schedule) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  for (const item of schedule) {
    const [startTimeStr, endTimeStr] = item.time.split(' - ');
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    const [endHour, endMinute] = endTimeStr.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (currentTime >= startTime && currentTime < endTime) {
      return { ...item, isCurrent: true };
    }
  }
  return null;
};


export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [attendance, setAttendance] = useState(() => {
    // Only try to get attendance if user exists and has an id
    if (user?.id) {
      const saved = localStorage.getItem(`attendance_${user.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Update attendance when user changes
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem(`attendance_${user.id}`);
      if (saved) {
        setAttendance(JSON.parse(saved));
      }
    }
  }, [user]);

  const handleScan = (data) => {
    setShowQRScanner(false);
    if (data) {
      try {
        const qrData = JSON.parse(data);
        const now = Date.now();

        if (now > qrData.expiryTime) {
          setScanResult({ success: false, message: 'Expired QR code.' });
          return;
        }

        if (attendance.some(a => a.sessionId === qrData.sessionId)) {
          setScanResult({ success: false, message: 'Attendance already marked for this session.' });
          return;
        }

        const newAttendance = {
          sessionId: qrData.sessionId,
          timestamp: now,
          courseId: qrData.courseId,
          facultyName: qrData.facultyName,
        };

        const updatedAttendance = [...attendance, newAttendance];
        setAttendance(updatedAttendance);
        
        // Make sure user exists before trying to access user.id
        if (user?.id) {
          localStorage.setItem(`attendance_${user.id}`, JSON.stringify(updatedAttendance));
        }

        setScanResult({ success: true, message: `Attendance for ${qrData.courseId} marked!` });

      } catch (err) {
        setScanResult({ success: false, message: 'Invalid QR code.' });
      }
    }
  };

  // --- Data for the dashboard ---
  const todaysSchedule = timetableData[todayName] || [];
  const totalSessions = 100; // Mock total sessions
  const attendancePercentage = totalSessions > 0 ? ((attendance.length / totalSessions) * 100).toFixed(1) : "0.0";
  
  const todaysTopic = user?.longTermGoal ? weeklyStudyPlan[user.longTermGoal]?.[todayName] : "General Studies";
  
  const recommendedTasks = taskDatabase.filter(task => 
    (task.goal === user?.longTermGoal && task.topic === todaysTopic) || task.goal === null
  ).slice(0, 3); // Get up to 3 tasks

  const currentSlot = getCurrentTimeSlot(todaysSchedule);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 rounded-lg bg-white shadow-md text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        
        {/* --- Header with Greeting and Date --- */}
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-3xl"></div>
          <div className="absolute right-0 bottom-0 -mb-8 -mr-8 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute left-0 top-0 -ml-8 -mt-8 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-blue-100 mb-1 font-medium">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-blue-100 max-w-lg">
                  Here's your personalized dashboard. Track your attendance, view your schedule, and stay on top of your tasks.
                </p>
              </div>
              
              <button
                onClick={() => setShowQRScanner(true)}
                className="mt-4 sm:mt-0 flex items-center space-x-2 bg-white text-blue-600 px-5 py-3 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-sm font-medium self-start"
              >
                <QrCodeIcon className="w-5 h-5" />
                <span>Scan Attendance QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* QR Scanner and Result Notification */}
        {showQRScanner && (
          <QRScanner 
            onClose={() => setShowQRScanner(false)}
            onScan={handleScan}
          />
        )}

        {scanResult && (
          <div className={`p-5 mb-6 rounded-xl shadow-sm border ${
            scanResult.success 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          } flex items-center`}>
            <div className={`p-2 rounded-full mr-3 ${scanResult.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {scanResult.success ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="font-medium">{scanResult.message}</p>
          </div>
        )}

        {/* --- Overview Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Attendance Summary</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <ChartPieIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="relative h-24 mb-2">
              {/* Radial Progress */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#EBF4FF" 
                    strokeWidth="10"
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * parseFloat(attendancePercentage)) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text 
                    x="50" y="50" 
                    dominantBaseline="middle" 
                    textAnchor="middle"
                    fill="#3B82F6"
                    style={{ fontSize: "16px", fontWeight: "bold" }}
                  >
                    {attendancePercentage}%
                  </text>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-3">
                {attendance.length} of {totalSessions} sessions attended
              </p>
              <Link 
                to="/student-attendance" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span>View Complete Report</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Current Class Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Current/Next Class</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <ClockIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            
            {currentSlot ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${currentSlot.type === 'class' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                    {currentSlot.type === 'class' ? (
                      <BookOpenIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <SparklesIcon className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-purple-700">{currentSlot.title}</p>
                    <p className="text-sm text-gray-500">{currentSlot.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      NOW
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 text-center">
                  <Link 
                    to="/student-timetable" 
                    className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                  >
                    <span>View Full Schedule</span>
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <CalendarIcon className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-gray-500 font-medium">No active classes right now</p>
                <Link 
                  to="/student-timetable" 
                  className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors mt-2"
                >
                  <span>View Schedule</span>
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Academic Focus Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Academic Focus</h3>
              <div className="bg-amber-100 p-2 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <StarIcon className="w-5 h-5 text-amber-500" />
                <p className="font-medium text-gray-700">Long-term Goal</p>
              </div>
              <p className="text-gray-800 font-semibold ml-7">{user?.longTermGoal || "No goal set"}</p>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <LightBulbIcon className="w-5 h-5 text-amber-500" />
                <p className="font-medium text-gray-700">Today's Focus</p>
              </div>
              <p className="text-gray-800 font-semibold ml-7">{todaysTopic}</p>
            </div>
            
            <div className="pt-3 text-center mt-2">
              <Link 
                to="/student-tasks" 
                className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
              >
                <span>View Learning Tasks</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* --- Main Content: Schedule and Tasks --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Today's Schedule</h2>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {todayName}
                </span>
              </div>
              
              <div className="space-y-5">
                {todaysSchedule.length > 0 ? (
                  todaysSchedule.map((item, index) => {
                    const isCurrent = currentSlot?.time === item.time;
                    return (
                      <div 
                        key={index} 
                        className={`relative p-4 rounded-xl transition-all ${
                          isCurrent 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-gray-50 border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30'
                        }`}
                      >
                        {isCurrent && (
                          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-12 bg-blue-500 rounded-r-full"></div>
                        )}
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg mr-4 ${
                            item.type === 'class' 
                              ? 'bg-gray-200/70 text-gray-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {item.type === 'class' ? (
                              <BookOpenIcon className="w-6 h-6" />
                            ) : (
                              <SparklesIcon className="w-6 h-6" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              {isCurrent && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  NOW
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm mt-1">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              <span>{item.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <CalendarIcon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No classes scheduled today!</h3>
                      <p className="text-gray-600 max-w-md">
                        Use this time to focus on your recommended tasks and self-study.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/student-timetable"
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Complete Timetable
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Tasks and Reminders */}
          <div className="space-y-8">
            {/* Recommended Tasks */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center space-x-2 mb-6">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Recommended Tasks</h2>
              </div>
              
              <div className="space-y-4">
                {recommendedTasks.length > 0 ? (
                  recommendedTasks.map((task, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-1.5 bg-green-100 rounded-lg flex-shrink-0 mt-0.5">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{task.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{task.topic}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-gray-50 rounded-lg text-center border border-gray-100">
                    <CheckCircleIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">No specific tasks for today's topic.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/student-tasks"
                  className="w-full flex items-center justify-center bg-green-600 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-green-700 transition-colors"
                >
                  View All Learning Tasks
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Important Reminders */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <BellIcon className="w-6 h-6 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-800">Reminders</h2>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-sm font-medium text-amber-800">
                    Mid-term exams start next week. Prepare your study plan!
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">
                    Complete your assignment submissions before Friday.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}