import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { XMarkIcon } from '@heroicons/react/24/solid';

const QRScanner = ({ onClose, onScan }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader', 
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
      },
      false // verbose
    );

    function onScanSuccess(decodedText, decodedResult) {
      // Stop scanning and call the onScan prop.
      scanner.clear();
      onScan(decodedText);
    }

    function onScanFailure(error) {
      // Don't show an error for every failed scan attempt.
      // console.warn(`Code scan error = ${error}`);
    }

    scanner.render(onScanSuccess, onScanFailure);

    // Cleanup function to clear the scanner
    return () => {
      scanner.clear().catch(err => {
        console.error("Failed to clear html5-qrcode-scanner.", err);
      });
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div id="qr-reader" className="w-full"></div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <p className="mt-4 text-sm text-gray-600 text-center">
          Position the QR code within the frame to scan
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
