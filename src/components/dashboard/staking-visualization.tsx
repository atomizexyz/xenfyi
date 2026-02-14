"use client";

import { useEffect, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Clock, Sparkles, Unlock } from "lucide-react";

interface StakingVisualizationProps {
  amount: number; // XEN amount (already divided by 1e18)
  maturityTimestamp: number;
  term: number;
  apy: number;
}

export function StakingVisualization({
  amount,
  maturityTimestamp,
  term,
  apy,
}: StakingVisualizationProps) {
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

  // Calculate estimated reward
  const estimatedReward = amount * (apy / 100) * (term / 365);

  return (
    <Card className={isMature ? "glow-strong" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="relative">
              {isMature ? (
                <Unlock size={14} className="text-[var(--color-gradient-mid)]" />
              ) : (
                <Lock size={14} className="text-[var(--color-gradient-mid)]" />
              )}
              {!isMature && (
                <div className="absolute inset-0 rounded-full bg-[var(--color-gradient-mid)]/30 blur-md" style={{ animation: "pulse-glow 3s ease-in-out infinite" }} />
              )}
            </div>
            Staking Progress
          </CardTitle>
          {isMature ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-semibold text-success border border-success/20">
              <Sparkles size={10} />
              Ready to Withdraw
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
        {/* Progress with gradient */}
        <div className="relative">
          <Progress
            value={progress}
            className="h-3"
            indicatorClassName="bg-gradient-to-r from-[var(--color-gradient-mid)] to-[var(--color-gradient-end)]"
          />
          {!isMature && (
            <div
              className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] blur-md opacity-40"
              style={{ width: `${progress}%` }}
            />
          )}
        </div>

        {/* Amount display */}
        <div className="text-center py-2">
          <p className="text-3xl font-bold gradient-text font-mono tabular-nums">
            <NumberFlow
              value={amount}
              format={{ notation: "compact", maximumFractionDigits: 2 }}
            />
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">XEN Staked</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">APY</p>
            <p className="text-sm font-bold text-[var(--foreground)] font-mono">
              <NumberFlow value={apy} />%
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Term</p>
            <p className="text-sm font-bold text-[var(--foreground)] font-mono">
              <NumberFlow value={term} />d
            </p>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
            <p className="text-[10px] text-[var(--muted-foreground)] mb-0.5">Est. Reward</p>
            <p className="text-sm font-bold text-success font-mono">
              +<NumberFlow
                value={estimatedReward}
                format={{ notation: "compact", maximumFractionDigits: 1 }}
              />
            </p>
          </div>
        </div>

        {/* Animated unlock ring when mature */}
        {isMature && (
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-gradient-mid)] to-[var(--color-gradient-end)] animate-spin opacity-30 blur-lg" style={{ animationDuration: "4s" }} />
            <div className="absolute inset-1.5 rounded-full bg-[var(--card)] flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-success animate-pulse" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
