import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentData from '../../data/studentData.json';
import QRCode from 'qrcode';
import { 
  AcademicCapIcon, 
  QrCodeIcon, 
  ClockIcon, 
  UserGroupIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  PlayIcon,
  StopIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const FacultyAttendance = () => {
  const { user } = useAuth();
  const classIds = useMemo(() => {
    if (!user) return [];
    if (user.classIds) return user.classIds; // Use if already an array
    if (typeof user.classId === 'string') return user.classId.split(',').map(s => s.trim()); // Split string into array
    return [];
  }, [user]);

  useEffect(() => {
    console.log('Faculty user object from context in FacultyAttendance:', user);
  }, [user]);
  
  // State management
  const [selectedClass, setSelectedClass] = useState(classIds?.[0] || '');
  const [sessionActive, setSessionActive] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [timer, setTimer] = useState(10);
  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }));
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  );

  // This effect handles the case where the user object loads after the initial render.
  React.useEffect(() => {
    if (classIds?.length && !selectedClass) {
      setSelectedClass(classIds[0]);
    }
  }, [classIds, selectedClass]);

  // Memoized list of students for the selected class
  const studentsInClass = useMemo(() => {
    return studentData.filter(student => student.classId === selectedClass);
  }, [selectedClass]);

  // Keep current time updated
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      );
    }, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  // QR Code Generation Logic
  const generateQR = useCallback(async () => {
    if (!user || !selectedClass) return;
    const qrData = JSON.stringify({
      facultyId: user.id,
      classId: selectedClass,
      timestamp: Date.now(),
      expiryTime: Date.now() + 10000, // 10-second expiry
    });
    try {
      const url = await QRCode.toDataURL(qrData, { width: 220, margin: 2 });
      setQrCodeDataUrl(url);
      setTimer(10);
    } catch (err) {
      console.error('Failed to generate QR code', err);
    }
  }, [user, selectedClass]);

  // Effect for handling the attendance session and WebSocket connection
  useEffect(() => {
    let qrInterval;
    let timerInterval;
    let ws;

    if (sessionActive) {
      // --- WebSocket Connection ---
      // Use the VITE_API_URL, replacing http with ws (or https with wss)
      const wsUrl = (import.meta.env.VITE_API_URL || 'ws://localhost:5001/api').replace(/^http/, 'ws');
      
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established for live attendance.');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'ATTENDANCE_UPDATE') {
            const { student, status, time } = message.data;
            console.log('Real-time attendance update received for:', student.name);
            
            // Update the attendance state, which will trigger a re-render of the student list
            setAttendance(prev => ({
              ...prev,
              [student.id]: { status, time }
            }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed.');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // --- QR Generation ---
      generateQR(); // Generate immediately
      qrInterval = setInterval(generateQR, 10000); // Then refresh every 10 seconds
      timerInterval = setInterval(() => setTimer(t => (t > 1 ? t - 1 : 10)), 1000);
    }

    return () => {
      // Cleanup function to run when the session ends or component unmounts
      clearInterval(qrInterval);
      clearInterval(timerInterval);
      if (ws) {
        ws.close();
      }
    };
  }, [sessionActive, generateQR]);

  const handleStartSession = () => {
    setAttendance({}); // Reset attendance for new session
    setSessionActive(true);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setQrCodeDataUrl('');
  };

  // Calculate attendance stats
  const attendanceStats = useMemo(() => {
    const total = studentsInClass.length;
    const present = Object.keys(attendance).length;
    const absent = total - present;
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, presentPercentage };
  }, [studentsInClass, attendance]);

  // Loading and empty state guard
  if (!user || !classIds || classIds.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 128px)'}}>
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          { !user 
            ? <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            : <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          }
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            { !user ? 'Loading User Data...' : 'No Classes Assigned' }
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            { !user ? 'Please wait while we fetch your details.' : 'There are no classes assigned to your profile.' }
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center">
                <QrCodeIcon className="w-8 h-8 mr-3" />
                Live Attendance
              </h1>
              <p className="mt-2 text-blue-100">
                Track and manage student attendance in real-time
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-xl font-medium">{currentTime}</div>
              <div className="text-sm text-blue-100">{currentDate}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls & Status Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Class Selection */}
            <div className="flex flex-col">
              <label htmlFor="classFilter" className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                <AcademicCapIcon className="w-4 h-4 mr-1 text-indigo-500" />
                Select Class
              </label>
              <select
                id="classFilter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="p-2 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                disabled={sessionActive}
              >
                {user.classIds.map(id => <option key={id} value={id}>{id}</option>)}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {studentsInClass.length} students enrolled
              </p>
            </div>

            {/* Attendance Stats */}
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center bg-blue-50 rounded-lg px-4 py-2">
                <div className="mr-3 bg-blue-100 p-2 rounded-full">
                  <UserGroupIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="text-lg font-semibold text-blue-700">{attendanceStats.total}</div>
                </div>
              </div>
              
              <div className="flex items-center bg-green-50 rounded-lg px-4 py-2">
                <div className="mr-3 bg-green-100 p-2 rounded-full">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Present</div>
                  <div className="text-lg font-semibold text-green-700">{attendanceStats.present}</div>
                </div>
              </div>
              
              <div className="flex items-center bg-red-50 rounded-lg px-4 py-2">
                <div className="mr-3 bg-red-100 p-2 rounded-full">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Absent</div>
                  <div className="text-lg font-semibold text-red-700">{attendanceStats.absent}</div>
                </div>
              </div>
            </div>

            {/* Session Controls */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={sessionActive ? handleEndSession : handleStartSession}
                className={`px-6 py-3 font-semibold rounded-lg text-white flex items-center justify-center transition-all ${
                  sessionActive 
                    ? 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
                }`}
              >
                {sessionActive ? (
                  <>
                    <StopIcon className="w-5 h-5 mr-2" />
                    End Session
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Start Session
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Session Status Bar */}
          {sessionActive && (
            <div className="mt-6 bg-indigo-50 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative mr-3">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-ping absolute inline-flex opacity-75"></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full relative inline-flex"></div>
                </div>
                <span className="text-sm font-medium text-indigo-900">Attendance session active for {selectedClass}</span>
              </div>
              <div className="flex items-center text-sm text-indigo-700">
                <ClockIcon className="w-4 h-4 mr-1" />
                <span>QR refreshes in {timer}s</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Student List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <UserGroupIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  Students in {selectedClass}
                </h2>
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-1"></span>
                    {attendanceStats.presentPercentage}% Present
                  </span>
                </div>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentsInClass.map(student => {
                      const attended = attendance[student.id];
                      return (
                        <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-500">{student.username}</div>
                          </td>
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              attended
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {attended ? (
                                <>
                                  <CheckCircleIcon className="w-3 h-3 mr-1" />
                                  Present
                                </>
                              ) : (
                                <>
                                  <XCircleIcon className="w-3 h-3 mr-1" />
                                  Absent
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {attended ? attended.time : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side: QR Generator */}
          <div className="bg-white shadow-sm rounded-xl overflow-hidden">
            <div className="p-4 sm:p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <QrCodeIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Attendance QR Code
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Students can scan this QR to mark attendance
              </p>
            </div>
            
            <div className="p-6 flex flex-col items-center justify-center space-y-4">
              {sessionActive && qrCodeDataUrl ? (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-xl shadow-md mb-4 relative">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="QR Code" 
                      className="w-64 h-64 object-contain"
                    />
                    <div className="absolute -bottom-3 -right-3 bg-indigo-100 text-indigo-800 rounded-full h-12 w-12 flex items-center justify-center border-4 border-white shadow-sm">
                      <div className="text-lg font-bold">{timer}</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all" 
                      style={{ width: `${(timer/10)*100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500 mb-2">QR code refreshes every 10 seconds</p>
                    <div className="flex justify-center">
                      <div className="flex items-center space-x-1 text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        <ArrowPathIcon className="w-3 h-3 animate-spin" />
                        <span>Auto-refreshing</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <QrCodeIcon className="h-full w-full" />
                  </div>
                  <p className="text-lg font-medium text-gray-700 mb-2">No Active Session</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Start a session to generate QR codes for attendance
                  </p>
                  <button
                    onClick={handleStartSession}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                  >
                    Start Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;
