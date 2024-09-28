"use client";

import { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

interface ScannerComponentProps {
  onScanResult: (result: string) => void; // Prop to send scan result to parent
  isProcessing: boolean; // Disable scanner when processing
}

const ScannerComponent: React.FC<ScannerComponentProps> = ({
  onScanResult,
  isProcessing,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanLock = useRef(false); // Introduce a scan lock

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result),
        { highlightScanRegion: true, highlightCodeOutline: true }
      );
      qrScanner.start();

      return () => {
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef]);

  // Unlock scanning when processing is finished
  useEffect(() => {
    if (!isProcessing) {
      scanLock.current = false; // Unlock scanner when not processing
    }
  }, [isProcessing]);

  const handleScan = (result: QrScanner.ScanResult) => {
    if (result && !isProcessing && !scanLock.current) {
      scanLock.current = true; // Lock the scanner to prevent further scans
      onScanResult(result.data); // Send scan result to parent
    }
  };

  return (
    <div>
      <video ref={videoRef} aria-label="QR code scanner" />
    </div>
  );
};

export default ScannerComponent;
