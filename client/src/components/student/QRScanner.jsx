import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';
import { useAuth } from '../../context/AuthContext';

export default function QRScanner() {
  const [scannedCode, setScannedCode] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendance, setAttendance] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load existing attendance from localStorage
    const savedAttendance = localStorage.getItem(`attendance_${user.id}`);
    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
  }, [user.id]);

  const handleScan = (data) => {
    if (data) {
      try {
        const qrData = JSON.parse(atob(data)); // Decode base64 and parse JSON
        const now = Date.now();

        // Check if QR code has expired
        if (now > qrData.expiryTime) {
          setError('This QR code has expired. Please scan a new one.');
          return;
        }

        // Check if already marked attendance for this session
        if (attendance.some(a => a.sessionId === qrData.sessionId)) {
          setError('Attendance already marked for this session.');
          return;
        }

        // Mark attendance
        const newAttendance = {
          sessionId: qrData.sessionId,
          timestamp: now,
          courseId: qrData.courseId,
          facultyId: qrData.facultyId
        };

        const updatedAttendance = [...attendance, newAttendance];
        setAttendance(updatedAttendance);
        localStorage.setItem(
          `attendance_${user.id}`,
          JSON.stringify(updatedAttendance)
        );

        // Calculate attendance percentage
        const totalSessions = 100; // This should come from your backend
        const attendedSessions = updatedAttendance.length;
        const percentage = ((attendedSessions / totalSessions) * 100).toFixed(2);

        setSuccess(`Attendance marked successfully! Current attendance: ${percentage}%`);
        setError('');
        setScannedCode(null);

      } catch (err) {
        setError('Invalid QR code. Please try again.');
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error accessing camera. Please check permissions.');
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Scan Attendance QR Code
      </h2>

      <div className="max-w-md mx-auto">
        <div className="overflow-hidden rounded-lg">
          <QrReader
            onResult={(result, error) => {
              if (result) {
                handleScan(result?.text);
              }
              if (error) {
                handleError(error);
              }
            }}
            constraints={{ facingMode: 'environment' }}
            className="w-full"
          />
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-50 text-green-600 rounded-lg">
            {success}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
          <ul className="list-disc list-inside text-sm text-blue-600 space-y-2">
            <li>Point your camera at the QR code shown by your faculty</li>
            <li>Keep your device steady while scanning</li>
            <li>Make sure you're in good lighting conditions</li>
            <li>Each QR code is valid for only 10 seconds</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
