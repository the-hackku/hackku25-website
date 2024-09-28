// app/components/QrCodeComponent.tsx
"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeComponentProps {
  qrCodeData: string | null;
  error?: string;
}

const QrCodeComponent = ({ qrCodeData, error }: QrCodeComponentProps) => {
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {qrCodeData ? (
        <QRCodeSVG value={qrCodeData} size={200} />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </>
  );
};

export default QrCodeComponent;
