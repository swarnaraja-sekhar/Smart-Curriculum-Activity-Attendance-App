import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '../../context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/solid';

const QRGenerator = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [timer, setTimer] = useState(10);
  const { user } = useAuth();

  const generateQRData = useCallback(() => {
    const qrData = {
      facultyId: user.id,
      facultyName: user.name,
      timestamp: Date.now(),
      courseId: user.subjects[0], // Using first subject for demo
      sessionId: `${user.id}-${Date.now()}`,
      expiryTime: Date.now() + 10000 // 10 seconds expiry
    };
    return JSON.stringify(qrData);
  }, [user]);

  const generateQR = useCallback(async () => {
    try {
      const qrData = generateQRData();
      const url = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        errorCorrectionLevel: 'H'
      });
      setQrCodeDataUrl(url);
      setTimer(10); // Reset timer
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  }, [generateQRData]);

  useEffect(() => {
    let qrInterval;
    let timerInterval;

    if (sessionActive) {
      // Generate first QR code immediately
      generateQR();

      // Generate new QR code every 10 seconds
      qrInterval = setInterval(generateQR, 10000);

      // Update timer every second
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            return 10; // Reset to 10 when it reaches 0
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(qrInterval);
      clearInterval(timerInterval);
    };
  }, [sessionActive, generateQR]);

  const handleStartStop = () => {
    setSessionActive(prev => !prev);
    if (!sessionActive) {
      setTimer(10);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Attendance QR Generator</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleStartStop}
            className={`px-6 py-3 rounded-lg font-medium w-full ${
              sessionActive
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {sessionActive ? 'End Session' : 'Start Session'}
          </button>

          {sessionActive && (
            <>
              {qrCodeDataUrl && (
                <div className="p-4 bg-white rounded-lg shadow-md">
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-64 h-64"
                  />
                </div>
              )}
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{timer}s</p>
                <p className="text-sm text-gray-600">Until next QR code</p>
              </div>
              <div className="w-full bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Active Session</h3>
                <p className="text-sm text-blue-600">Course: {user.subjects[0]}</p>
                <p className="text-sm text-blue-600">Faculty: {user.name}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
