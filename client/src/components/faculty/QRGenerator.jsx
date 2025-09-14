import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';

export default function QRGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQR, setCurrentQR] = useState(null);
  const [qrHistory, setQrHistory] = useState([]);
  const { user } = useAuth();

  // Generate a unique QR code
  const generateQRCode = useCallback(() => {
    const timestamp = Date.now();
    const qrData = {
      facultyId: user.id,
      timestamp,
      expiryTime: timestamp + 10000, // 10 seconds from generation
      courseId: user.subjects[0], // Using first subject for demo
      sessionId: `${user.id}-${timestamp}`
    };
    
    const newQR = {
      ...qrData,
      code: btoa(JSON.stringify(qrData)) // Base64 encode the data
    };

    setCurrentQR(newQR);
    setQrHistory(prev => [...prev, newQR]);

    // Set expiry timeout
    setTimeout(() => {
      setQrHistory(prev => prev.filter(qr => qr.timestamp !== timestamp));
    }, 10000);
  }, [user]);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      generateQRCode(); // Generate first QR immediately
      interval = setInterval(generateQRCode, 10000); // Then every 10 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGenerating, generateQRCode]);

  const handleStartStop = () => {
    setIsGenerating(prev => !prev);
    if (!isGenerating) {
      setQrHistory([]); // Clear history when starting new session
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

      {isGenerating && currentQR && (
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <QRCode
              value={currentQR.code}
              size={256}
              level={'H'}
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600">
            QR Code will expire in 10 seconds
          </p>
          <div className="w-full max-w-md bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Session Info:</h3>
            <p className="text-sm text-blue-600">Course: {user.subjects[0]}</p>
            <p className="text-sm text-blue-600">
              Session ID: {currentQR.sessionId}
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
        </div>
      )}
    </div>
  );
}
