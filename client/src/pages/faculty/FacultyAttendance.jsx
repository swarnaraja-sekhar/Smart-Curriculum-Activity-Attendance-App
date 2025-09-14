import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentData from '../../data/studentData.json';
import QRCode from 'qrcode';

const FacultyAttendance = () => {
  const { user } = useAuth();
  
  // State management
  const [selectedClass, setSelectedClass] = useState(user?.classIds?.[0] || '');
  const [sessionActive, setSessionActive] = useState(false);
  const [attendance, setAttendance] = useState({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [timer, setTimer] = useState(10);

  // Memoized list of students for the selected class
  const studentsInClass = useMemo(() => {
    return studentData.filter(student => student.classId === selectedClass);
  }, [selectedClass]);

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

  // Effect for handling the attendance session
  useEffect(() => {
    let qrInterval;
    let timerInterval;
    let simulationInterval;

    if (sessionActive) {
      generateQR();
      qrInterval = setInterval(generateQR, 10000);
      timerInterval = setInterval(() => setTimer(t => (t > 1 ? t - 1 : 10)), 1000);

      // --- ATTENDANCE SIMULATION ---
      // In a real app, this would be a WebSocket listener.
      // Here, we simulate students getting marked as present.
      simulationInterval = setInterval(() => {
        const unmarkedStudents = studentsInClass.filter(s => !attendance[s.id]);
        if (unmarkedStudents.length > 0) {
          const randomStudent = unmarkedStudents[Math.floor(Math.random() * unmarkedStudents.length)];
          setAttendance(prev => ({
            ...prev,
            [randomStudent.id]: { status: 'Present', time: new Date().toLocaleTimeString() }
          }));
        }
      }, 3000); // Simulate a scan every 3 seconds

    }

    return () => {
      clearInterval(qrInterval);
      clearInterval(timerInterval);
      clearInterval(simulationInterval);
    };
  }, [sessionActive, generateQR, studentsInClass, attendance]);

  const handleStartSession = () => {
    setAttendance({}); // Reset attendance for new session
    setSessionActive(true);
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setQrCodeDataUrl('');
  };

  if (!user || !user.classIds) {
    return <div className="p-6">Loading faculty data...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Live Attendance</h1>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <label htmlFor="classFilter" className="font-medium">Class:</label>
            <select
              id="classFilter"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
              disabled={sessionActive}
            >
              {user.classIds.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
          <button
            onClick={sessionActive ? handleEndSession : handleStartSession}
            className={`px-6 py-2 font-semibold rounded-lg text-white ${
              sessionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {sessionActive ? 'End Session' : 'Start Session'}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Side: Student List */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
            <h2 className="text-xl font-semibold p-4 border-b">
              Students in {selectedClass} ({studentsInClass.length})
            </h2>
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsInClass.map(student => {
                    const attended = attendance[student.id];
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 font-mono text-sm">{student.username}</td>
                        <td className="px-6 py-4">{student.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            attended
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {attended ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side: QR Generator */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center space-y-4">
            <h2 className="text-xl font-semibold">Attendance QR Code</h2>
            {sessionActive && qrCodeDataUrl ? (
              <>
                <img src={qrCodeDataUrl} alt="QR Code" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{timer}s</p>
                  <p className="text-sm text-gray-500">Next QR in...</p>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">
                <p>Start a session to generate QR codes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyAttendance;
