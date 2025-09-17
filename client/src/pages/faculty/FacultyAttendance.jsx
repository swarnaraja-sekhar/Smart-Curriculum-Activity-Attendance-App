import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios'; // Import the axios instance
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
  ExclamationCircleIcon,
  BookOpenIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Mock data for subjects - replace with API call if available
const subjectsData = [
  { _id: '60d21b4667d0d8992e610c85', name: 'Quantum Physics', code: 'PHY401' },
  { _id: '60d21b4667d0d8992e610c86', name: 'Data Structures', code: 'CS301' },
  { _id: '60d21b4667d0d8992e610c87', name: 'Organic Chemistry', code: 'CHM202' },
];

const FacultyAttendance = () => {
  const { user } = useAuth();
  const classIds = useMemo(() => {
    if (!user?.classIds) return [];
    return Array.isArray(user.classIds) ? user.classIds : [user.classIds];
  }, [user]);

  // State management
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  
  const [session, setSession] = useState({ active: false, token: null, expiresAt: null });
  const [attendance, setAttendance] = useState({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [error, setError] = useState('');
  const [liveStudents, setLiveStudents] = useState([]);

  const [currentDate] = useState(new Date().toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  }));
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  );

  // Set default selections once user data is available
  useEffect(() => {
    if (classIds.length > 0 && !selectedClass) {
      setSelectedClass(classIds[0]);
    }
    if (subjectsData.length > 0 && !selectedSubject) {
      setSelectedSubject(subjectsData[0]._id);
    }
    if (!selectedPeriod) {
      setSelectedPeriod('1');
    }
  }, [user, classIds, selectedClass, selectedSubject, selectedPeriod]);

  // Keep current time updated
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // --- REAL-TIME WEBSOCKET LOGIC ---
  useEffect(() => {
    if (!session.active) return;

    const wsUrl = (import.meta.env.VITE_API_URL || 'ws://localhost:5001').replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log('WebSocket connection established.');
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'ATTENDANCE_UPDATE') {
          console.log('Real-time attendance update received for:', message.data.student.name);
          setLiveStudents(prev => [message.data, ...prev]);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    ws.onclose = () => console.log('WebSocket connection closed.');
    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => ws.close();
  }, [session.active]);


  // --- SESSION MANAGEMENT ---
  const handleStartSession = async () => {
    if (!selectedClass || !selectedSubject || !selectedPeriod) {
      setError('Please select a class, subject, and period.');
      return;
    }
    setError('');
    setLiveStudents([]); // Clear previous live attendance

    try {
      const response = await axios.post('/qr/start-session', {
        classId: selectedClass,
        subjectId: selectedSubject,
        period: selectedPeriod,
      });

      const { sessionToken, expiresAt } = response.data;
      
      // Generate QR code with the received token
      const qrUrl = await QRCode.toDataURL(sessionToken, { width: 220, margin: 2 });
      setQrCodeDataUrl(qrUrl);

      // Set session state
      setSession({ active: true, token: sessionToken, expiresAt });

    } catch (err) {
      console.error('Failed to start session:', err);
      setError(err.response?.data?.message || 'An error occurred while starting the session.');
    }
  };

  const handleEndSession = () => {
    setSession({ active: false, token: null, expiresAt: null });
    setQrCodeDataUrl('');
    setError('');
  };

  // Calculate attendance stats
  const attendanceStats = useMemo(() => {
    // This part needs to be connected to real data later
    const total = 50; // Placeholder
    const present = liveStudents.length;
    const absent = total - present;
    const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { total, present, absent, presentPercentage };
  }, [liveStudents]);

  if (!user || classIds.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 128px)'}}>
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          {!user 
            ? <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            : <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          }
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {!user ? 'Loading User Data...' : 'No Classes Assigned'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {!user ? 'Please wait while we fetch your details.' : 'There are no classes assigned to your profile.'}
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
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Attendance</h1>
              <p className="mt-2 text-indigo-100 max-w-2xl">Start a session to generate a QR code and monitor student attendance in real-time.</p>
            </div>
            <div className="flex items-center space-x-2 text-lg font-medium">
              <ClockIcon className="h-6 w-6" />
              <span>{currentDate} - {currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Control Panel & QR Code */}
          <div className="lg:col-span-1 space-y-8">
            {/* Control Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Session Control</h2>
              
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded-md">
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-4">
                {/* Class Selector */}
                <div>
                  <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    id="class-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={session.active}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {classIds.map(id => <option key={id} value={id}>{`Class ${id}`}</option>)}
                  </select>
                </div>

                {/* Subject Selector */}
                <div>
                  <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="subject-select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    disabled={session.active}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {subjectsData.map(sub => <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>)}
                  </select>
                </div>

                {/* Period Selector */}
                <div>
                  <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                  <select
                    id="period-select"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    disabled={session.active}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{`Period ${i+1}`}</option>)}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6">
                {!session.active ? (
                  <button
                    onClick={handleStartSession}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                  >
                    <PlayIcon className="h-6 w-6" />
                    Start Session
                  </button>
                ) : (
                  <button
                    onClick={handleEndSession}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 shadow-md"
                  >
                    <StopIcon className="h-6 w-6" />
                    End Session
                  </button>
                )}
              </div>
            </div>

            {/* QR Code Display */}
            {session.active && qrCodeDataUrl && (
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Scan to Mark Attendance</h3>
                <div className="flex justify-center my-4">
                  <img src={qrCodeDataUrl} alt="Attendance QR Code" className="rounded-lg border-4 border-gray-200" />
                </div>
                <div className="bg-gray-100 p-2 rounded-md text-sm text-gray-600">
                  Session expires at: {new Date(session.expiresAt).toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Attendance Feed */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Live Attendance Feed</h2>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-semibold">Total Students</p>
                <p className="text-2xl font-bold text-blue-800">{attendanceStats.total}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-semibold">Present</p>
                <p className="text-2xl font-bold text-green-800">{attendanceStats.present}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-semibold">Absent</p>
                <p className="text-2xl font-bold text-red-800">{attendanceStats.absent}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-semibold">Attendance %</p>
                <p className="text-2xl font-bold text-yellow-800">{attendanceStats.presentPercentage}%</p>
              </div>
            </div>

            {/* Student List */}
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
              <ul className="divide-y divide-gray-200">
                {liveStudents.length > 0 ? (
                  liveStudents.map((item, index) => (
                    <li key={index} className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium text-gray-800">{item.student.name}</p>
                          <p className="text-sm text-gray-500">@{item.student.username}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Marked at {item.time}
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      {session.active ? 'Waiting for students to scan...' : 'Start a session to see live attendance'}
                    </h3>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;
