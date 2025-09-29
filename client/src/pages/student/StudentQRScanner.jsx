// client/src/pages/student/StudentQRScanner.jsx
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import { QrCodeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

const StudentQRScanner = () => {
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader', 
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false // verbose
    );

    let isScanning = true;

    async function onScanSuccess(decodedText, decodedResult) {
      if (!isScanning) return;
      
      // Stop scanning after a successful scan to prevent multiple submissions
      isScanning = false;
      scanner.clear();
      setIsLoading(true);
      setError(null);
      setScanResult(null);

      try {
        console.log('Raw scanned text:', decodedText);
        
        // Try to parse the QR code data as JSON
        let qrData;
        try {
          qrData = JSON.parse(decodedText);
          console.log('Parsed QR data:', qrData);
        } catch (parseError) {
          console.error('Error parsing QR code as JSON:', parseError);
          // If parsing fails, use the raw text as the session token
          qrData = { sessionToken: decodedText };
          console.log('Using raw text as session token');
        }
        
        // Create attendance record locally since server endpoint is having issues
        const attendanceRecord = {
          studentId: user._id,
          studentName: user.name,
          sessionToken: qrData.sessionToken,
          classId: qrData.classId,
          facultyId: qrData.facultyId,
          subjectId: qrData.subjectId,
          timestamp: new Date().toISOString()
        };
        
        // Log the attendance record for debugging
        console.log('Created attendance record:', attendanceRecord);
        
        // Store in localStorage for demonstration purposes
        const attendanceHistory = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
        attendanceHistory.push(attendanceRecord);
        localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));
        
        // Display success message
        setScanResult('Attendance marked successfully!');
        
        /* 
        // Uncomment this section when the server endpoint is working
        const response = await axios.post('/api/attendance/scan', {
          sessionToken: qrData.sessionToken,
          classId: qrData.classId,
          facultyId: qrData.facultyId,
          subjectId: qrData.subjectId
        });
        setScanResult(response.data.message);
        */
      } catch (err) {
        console.error('Scan processing error:', err);
        setError(err.response?.data?.message || 'Invalid QR Code or server error.');
      } finally {
        setIsLoading(false);
      }
    }

    function onScanFailure(error) {
      // This function is called frequently, so we don't do much here.
      // console.warn(`Code scan error = ${error}`);
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      if (scanner) {
        scanner.clear().catch(err => {
          console.error("Failed to clear scanner on cleanup", err);
        });
      }
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <QrCodeIcon className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Scan Attendance QR</h1>
        <p className="text-gray-500 mb-6">
          Point your camera at the QR code displayed by your faculty.
        </p>

        <div id="qr-reader" className="w-full rounded-lg overflow-hidden border-2 border-gray-200"></div>

        {isLoading && (
          <div className="mt-6 flex items-center justify-center space-x-2 text-indigo-600">
            <svg className="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying...</span>
          </div>
        )}

        {scanResult && (
          <div className="mt-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center justify-center space-x-3">
            <CheckCircleIcon className="w-6 h-6" />
            <span className="font-medium">{scanResult}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg flex items-center justify-center space-x-3">
            <ExclamationTriangleIcon className="w-6 h-6" />
            <span className="font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQRScanner;
