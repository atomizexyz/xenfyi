"use client";

import { useState } from "react";
import { QRCodeDisplay } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check, QrCode } from "lucide-react";
import { shortenAddress } from "@/lib/utils";

interface ContractQRProps {
  address: string;
  chainName: string;
}

export function ContractQR({ address, chainName }: ContractQRProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <QrCode size={14} className="text-xen-blue" />
          {chainName} Contract
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs text-[var(--muted-foreground)] font-mono truncate">
            {shortenAddress(address, 8)}
          </code>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-success" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowQR(!showQR)}
          >
            <QrCode className="h-3.5 w-3.5" />
          </Button>
        </div>

        {showQR && (
          <div className="flex justify-center rounded-xl bg-white p-4">
            <QRCodeDisplay value={address} size={160} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
