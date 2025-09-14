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
  QrCodeIcon
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* --- Header --- */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            Here’s your plan for today. Let's make it a productive one.
          </p>
        </div>

        {/* --- Scan Button and Modal --- */}
        <button
          onClick={() => setShowQRScanner(true)}
          className="mb-8 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <QrCodeIcon className="w-6 h-6" />
          <span>Scan Attendance QR</span>
        </button>

        {showQRScanner && (
          <QRScanner 
            onClose={() => setShowQRScanner(false)}
            onScan={handleScan}
          />
        )}

        {scanResult && (
          <div className={`p-4 mb-6 rounded-lg ${scanResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {scanResult.message}
          </div>
        )}

        {/* --- Overview Cards Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Attendance Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <ChartPieIcon className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Attendance</h3>
              <p className="text-3xl font-bold text-blue-600">{attendancePercentage}%</p>
              <Link to="/student-attendance" className="text-sm font-medium text-blue-600 hover:underline mt-1">View Report</Link>
            </div>
          </div>

          {/* Goal & Interests Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <StarIcon className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">My Focus</h3>
              <p className="font-bold text-gray-700 text-lg">{user?.longTermGoal || "No goal set"}</p>
              <p className="text-sm text-gray-500">{user?.interests ? user.interests.join(', ') : "No interests set"}</p>
            </div>
          </div>

          {/* Today's Topic Card */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <LightBulbIcon className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Today's Topic</h3>
              <p className="font-bold text-gray-700 text-lg">{todaysTopic}</p>
               <Link to="/student-tasks" className="text-sm font-medium text-yellow-700 hover:underline mt-1">All Tasks</Link>
            </div>
          </div>
        </div>

        {/* --- Main Content: Schedule and Tasks --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Today's Schedule */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Schedule ({todayName})</h2>
            <div className="space-y-4">
              {todaysSchedule.length > 0 ? (
                todaysSchedule.map((item, index) => {
                  const isCurrent = currentSlot?.time === item.time;
                  return (
                    <div 
                      key={index} 
                      className={`bg-white rounded-lg shadow-sm p-4 flex items-center space-x-4 transition-all ${isCurrent ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                    >
                      <div className={`p-3 rounded-full ${item.type === 'class' ? 'bg-gray-100' : 'bg-blue-100'}`}>
                        {item.type === 'class' ? <BookOpenIcon className="w-6 h-6 text-gray-600" /> : <SparklesIcon className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-500">{item.time}</p>
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      {isCurrent && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">NOW</span>}
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-800">No classes scheduled today!</h3>
                  <p className="text-gray-600">Use this time to focus on your recommended tasks.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recommended Tasks */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Tasks</h2>
            <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
              {recommendedTasks.length > 0 ? (
                recommendedTasks.map((task, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.topic}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No specific tasks for today's topic. Check the main tasks page for more.</p>
              )}
              <div className="pt-4">
                <Link 
                  to="/student-tasks"
                  className="w-full flex items-center justify-center bg-blue-600 text-white font-medium px-4 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                >
                  View All Tasks
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
