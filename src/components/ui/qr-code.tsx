"use client";

import { Cuer } from "cuer";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ value, size = 128, className }: QRCodeDisplayProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <Cuer value={value} size={size} />
    </div>
  );
}
