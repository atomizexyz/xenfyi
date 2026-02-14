"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pickaxe, Clock, Flame } from "lucide-react";

interface MiningVisualizationProps {
  rank: number;
  maturityTimestamp: number;
  term: number;
  amplifier: number;
  eaaRate: number;
}

export function MiningVisualization({
  rank,
  maturityTimestamp,
  term,
  amplifier,
  eaaRate,
}: MiningVisualizationProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const maturityMs = maturityTimestamp * 1000;
  const startMs = maturityMs - term * 86400 * 1000;
  const totalDuration = maturityMs - startMs;
  const elapsed = now - startMs;
  const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  const isMature = now >= maturityMs;
  const daysLeft = Math.max(0, Math.ceil((maturityMs - now) / 86400000));

  return (
    <Card className={isMature ? "glow-strong" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className={`relative ${!isMature ? "animate-pulse" : ""}`}>
              <Pickaxe size={14} className="text-xen-blue" />
              {!isMature && (
                <div className="absolute inset-0 rounded-full bg-xen-blue/30 blur-md animate-ping" />
              )}
            </div>
            Mining Progress
          </CardTitle>
          {isMature ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success border border-success/20">
              <Flame size={10} />
              Ready to Claim
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">
              <Clock size={10} />
              {daysLeft} days left
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar with glow */}
        <div className="relative">
          <Progress value={progress} className="h-3" />
          {!isMature && (
            <div
              className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-xen-blue to-[var(--color-gradient-end)] blur-md opacity-50"
              style={{ width: `${progress}%` }}
            />
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-1">Rank</p>
            <p className="text-lg font-bold text-[var(--foreground)] font-mono">
              <NumberFlow value={rank} />
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-1">Term</p>
            <p className="text-lg font-bold text-[var(--foreground)] font-mono">
              <NumberFlow value={term} /> <span className="text-xs text-[var(--muted-foreground)]">days</span>
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-1">AMP</p>
            <p className="text-lg font-bold text-[var(--foreground)] font-mono">
              <NumberFlow value={amplifier} />
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-1">EAA Rate</p>
            <p className="text-lg font-bold text-[var(--foreground)] font-mono">
              <NumberFlow value={eaaRate} />
            </p>
          </div>
        </div>

        {/* Maturity date */}
        <div className="text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            Maturity: {new Date(maturityMs).toLocaleDateString()} {new Date(maturityMs).toLocaleTimeString()}
          </p>
        </div>

        {/* Animated glow ring when mature */}
        {isMature && (
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-xen-blue to-[var(--color-gradient-end)] animate-spin opacity-20 blur-lg" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-2 rounded-full bg-[var(--card)] flex items-center justify-center">
              <Flame className="h-8 w-8 text-success animate-pulse" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
