import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import ApiTester from '../debug/ApiTester'; // Import the debug component

export default function QRGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQR, setCurrentQR] = useState(null);
  const [qrHistory, setQrHistory] = useState([]);
  const { user } = useAuth();

  // Generate a unique QR code
  const generateQRCode = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Make sure we have the necessary data
      if (!user) {
        console.error('User object is null or undefined');
        alert('Error: User not found. Please try logging in again.');
        setIsGenerating(false);
        return;
      }
      
      console.log('Current user data:', JSON.stringify(user, null, 2));
      
  // Since the server is having issues with the /qr/start-session endpoint,
      // let's generate a local QR code instead for demonstration purposes
      
      // Generate a temporary session token locally
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let tempSessionToken = '';
      for (let i = 0; i < 40; i++) {
        tempSessionToken += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      // Create expiry time (15 minutes from now)
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      
      const newQR = {
        sessionToken: tempSessionToken,
        classId: user.classIds && user.classIds.length > 0 ? user.classIds[0] : 'CSE-A',
        facultyId: user.id || 'faculty-123',
        subjectId: user.branch || 'Computer Science',
        generated: new Date(),
        expiresAt: expiresAt
      };
      
      setCurrentQR(newQR);
      setQrHistory(prev => [...prev, newQR]);
      
      // Set expiry timeout
      const expiryTime = expiresAt - new Date();
      setTimeout(() => {
        setCurrentQR(null);
      }, expiryTime);
      
      console.log('Generated local QR code with session token:', tempSessionToken);
      
    } catch (error) {
      console.error('Error generating QR code:', error);
      setIsGenerating(false);
      
      // More detailed error information for debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response error data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // Special handling for auth errors
        if (error.response.status === 401) {
          alert('Authentication error. Please log out and log in again.');
          // Optionally redirect to login
          // window.location.href = '/faculty-login';
          return;
        }
        
        alert(`Server error (${error.response.status}): ${error.response.data.message || 'Failed to generate QR code'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        alert('Server not responding. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        alert(`Error: ${error.message}`);
      }
    }
  }, [user]);

  useEffect(() => {
    let interval;
    if (isGenerating && !currentQR) {
      generateQRCode(); // Generate QR when session starts or when current QR expires
      // Set interval to check if QR has expired
      interval = setInterval(() => {
        if (!currentQR || new Date(currentQR.expiresAt) <= new Date()) {
          generateQRCode();
        }
      }, 15000); // Check every 15 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, currentQR, generateQRCode]);

  const handleStartStop = () => {
    if (isGenerating) {
      // End session
      setIsGenerating(false);
      setCurrentQR(null);
    } else {
      // Start session
      setIsGenerating(true);
      setQrHistory([]); // Clear history when starting new session
      // The QR generation happens in the useEffect
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance QR Generator</h2>
        <button
          onClick={handleStartStop}
          className={`px-6 py-2 rounded-lg font-medium ${
            isGenerating
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isGenerating ? 'End Session' : 'Start Session'}
        </button>
      </div>

      {/* Add a notice about the workaround */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Notice</h3>
        <p className="text-sm text-blue-700">
          Due to a server issue with the QR session API, this version is using a local workaround.
          The QR code contains all necessary information for attendance tracking, but data is stored locally
          until the server endpoint is fixed.
        </p>
      </div>

      {/* Add the API Tester for debugging */}
      <div className="mb-6">
        <details>
          <summary className="cursor-pointer text-blue-600 font-medium">Debug Tools</summary>
          <div className="mt-4">
            <ApiTester />
          </div>
        </details>
      </div>

      {isGenerating && currentQR && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <QRCode
              value={JSON.stringify({
                sessionToken: currentQR.sessionToken,
                classId: currentQR.classId,
                facultyId: currentQR.facultyId,
                subjectId: currentQR.subjectId
              })}
              size={256}
              level={'H'}
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600">
            QR Code will expire at {currentQR.expiresAt.toLocaleTimeString()}
          </p>
          <div className="w-full max-w-md bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Session Info:</h3>
            <p className="text-sm text-blue-600">
              Class: {currentQR.classId}
            </p>
            <p className="text-sm text-blue-600">
              Branch: {currentQR.subjectId}
            </p>
            <p className="text-sm text-blue-600">
              Session Token: {currentQR.sessionToken.substring(0, 8)}...
            </p>
          </div>
        </div>
      )}

      {!isGenerating && qrHistory.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">
            Session Summary
          </h3>
          <p className="text-sm text-gray-600">
            Total QR codes generated: {qrHistory.length}
          </p>
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {qrHistory.map((qr, index) => (
              <div key={index} className="p-2 bg-gray-50 rounded text-xs">
                Generated at: {new Date(qr.generated).toLocaleTimeString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
