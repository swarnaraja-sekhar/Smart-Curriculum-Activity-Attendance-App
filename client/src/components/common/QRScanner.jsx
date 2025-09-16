import React, { useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

const QRScanner = ({ onScan, onError }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 10,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], // Restrict to camera only
      },
      false // verbose
    );

    function onScanSuccess(decodedText, decodedResult) {
      scanner.clear();
      onScan(decodedText);
    }

    function onScanFailure(error) {
      // This is expected behavior when no QR code is found in the frame.
      // We don't want to close the scanner, so we'll just ignore these errors.
    }

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      // Ensure the scanner is stopped and cleared when the component unmounts.
      scanner.clear().catch(err => {
        console.error("Failed to clear html5-qrcode-scanner.", err);
      });
    };
  }, [onScan, onError]);

  return <div id="qr-reader" className="w-full"></div>;
};

export default QRScanner;

