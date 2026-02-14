"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import NumberFlow from "@number-flow/react";
import { useUserMint, useUserStake, useUserBalance } from "@/hooks/use-user-xen-data";
import { xenCryptoAbi } from "@/abi/xen-crypto";
import { getChainConfigById } from "@/config/chains";
import { ConnectKitButton } from "connectkit";
import { MiningVisualization } from "./mining-visualization";
import { StakingVisualization } from "./staking-visualization";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Coins, Loader2, Share2, RotateCw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UserPositionProps {
  chainId: number;
}

export function UserPosition({ chainId }: UserPositionProps) {
  const t = useTranslations("dashboard");
  const { address, isConnected } = useAccount();
  const config = getChainConfigById(chainId);

  const { data: mintData } = useUserMint(chainId, address);
  const { data: stakeData } = useUserStake(chainId, address);
  const { data: balance } = useUserBalance(chainId, address);

  // Claim mint reward
  const { writeContract: claimMint, data: claimHash, isPending: isClaiming } = useWriteContract();
  const { isLoading: isClaimConfirming } = useWaitForTransactionReceipt({ hash: claimHash });

  // Claim and stake
  const { writeContract: claimAndStake, data: claimStakeHash, isPending: isClaimStaking } = useWriteContract();
  const { isLoading: isClaimStakeConfirming } = useWaitForTransactionReceipt({ hash: claimStakeHash });

  // Claim and share
  const { writeContract: claimAndShare, data: claimShareHash, isPending: isClaimSharing } = useWriteContract();
  const { isLoading: isClaimShareConfirming } = useWaitForTransactionReceipt({ hash: claimShareHash });

  // Withdraw stake
  const { writeContract: withdrawStake, data: withdrawHash, isPending: isWithdrawing } = useWriteContract();
  const { isLoading: isWithdrawConfirming } = useWaitForTransactionReceipt({ hash: withdrawHash });

  // Compound action inputs
  const [stakePct, setStakePct] = useState("100");
  const [stakeTerm, setStakeTerm] = useState("30");
  const [shareAddress, setShareAddress] = useState("");
  const [sharePct, setSharePct] = useState("50");
  const [claimMode, setClaimMode] = useState<"simple" | "stake" | "share">("simple");

  const mintInfo = mintData as
    | { user: string; term: bigint; maturityTs: bigint; rank: bigint; amplifier: bigint; eaaRate: bigint }
    | undefined;
  const stakeInfo = stakeData as
    | { term: bigint; maturityTs: bigint; amount: bigint; apy: bigint }
    | undefined;

  const hasMint = mintInfo && mintInfo.rank > 0n;
  const hasStake = stakeInfo && stakeInfo.amount > 0n;
  const xenBalance = balance ? Number(balance as bigint) / 1e18 : 0;

  const handleClaimMintReward = () => {
    if (!config) return;
    claimMint({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "claimMintReward",
      chainId,
    });
  };

  const handleClaimAndStake = () => {
    if (!config) return;
    claimAndStake({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "claimMintRewardAndStake",
      args: [BigInt(stakePct), BigInt(stakeTerm)],
      chainId,
    });
  };

  const handleClaimAndShare = () => {
    if (!config || !shareAddress) return;
    claimAndShare({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "claimMintRewardAndShare",
      args: [shareAddress as `0x${string}`, BigInt(sharePct)],
      chainId,
    });
  };

  const handleWithdraw = () => {
    if (!config) return;
    withdrawStake({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "withdraw",
      chainId,
    });
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Wallet className="mx-auto mb-4 h-10 w-10 text-[var(--muted-foreground)]" />
          <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
            {t("yourPosition")}
          </h3>
          <p className="mb-4 text-sm text-[var(--muted-foreground)]">
            Connect your wallet to view your position
          </p>
          <ConnectKitButton.Custom>
            {({ show }) => (
              <Button onClick={show}>Connect Wallet</Button>
            )}
          </ConnectKitButton.Custom>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Coins size={14} className="text-xen-blue" />
            {t("balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-[var(--foreground)] font-mono tabular-nums">
            <NumberFlow
              value={xenBalance}
              format={{ notation: xenBalance > 1_000_000 ? "compact" : "standard", maximumFractionDigits: 2 }}
            />
            <span className="text-sm text-[var(--muted-foreground)] ml-2">XEN</span>
          </p>
        </CardContent>
      </Card>

      {/* Mining Visualization */}
      {hasMint && (
        <div className="space-y-3">
          <MiningVisualization
            rank={Number(mintInfo.rank)}
            maturityTimestamp={Number(mintInfo.maturityTs)}
            term={Number(mintInfo.term)}
            amplifier={Number(mintInfo.amplifier)}
            eaaRate={Number(mintInfo.eaaRate)}
          />
          {Number(mintInfo.maturityTs) * 1000 <= Date.now() && (
            <Card>
              <CardContent className="py-4 space-y-3">
                {/* Claim mode selector */}
                <div className="flex gap-1 rounded-lg border border-white/5 bg-white/[0.02] p-1">
                  <button
                    onClick={() => setClaimMode("simple")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${claimMode === "simple" ? "bg-xen-blue/20 text-xen-blue" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                  >
                    Claim
                  </button>
                  <button
                    onClick={() => setClaimMode("stake")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${claimMode === "stake" ? "bg-xen-blue/20 text-xen-blue" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                  >
                    <RotateCw size={12} className="inline mr-1" />
                    Claim & Stake
                  </button>
                  <button
                    onClick={() => setClaimMode("share")}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${claimMode === "share" ? "bg-xen-blue/20 text-xen-blue" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}
                  >
                    <Share2 size={12} className="inline mr-1" />
                    Claim & Share
                  </button>
                </div>

                {/* Claim & Stake inputs */}
                {claimMode === "stake" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Stake %</label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={stakePct}
                        onChange={(e) => setStakePct(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Term (days)</label>
                      <Input
                        type="number"
                        min="1"
                        max="1000"
                        value={stakeTerm}
                        onChange={(e) => setStakeTerm(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Claim & Share inputs */}
                {claimMode === "share" && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Recipient Address</label>
                      <Input
                        type="text"
                        placeholder="0x..."
                        value={shareAddress}
                        onChange={(e) => setShareAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--muted-foreground)] mb-1 block">Share %</label>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={sharePct}
                        onChange={(e) => setSharePct(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Action button */}
                {claimMode === "simple" && (
                  <Button
                    onClick={handleClaimMintReward}
                    disabled={isClaiming || isClaimConfirming}
                    className="w-full"
                  >
                    {isClaiming || isClaimConfirming ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      t("claimMint")
                    )}
                  </Button>
                )}
                {claimMode === "stake" && (
                  <Button
                    onClick={handleClaimAndStake}
                    disabled={isClaimStaking || isClaimStakeConfirming}
                    className="w-full"
                  >
                    {isClaimStaking || isClaimStakeConfirming ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <>Claim & Stake {stakePct}%</>
                    )}
                  </Button>
                )}
                {claimMode === "share" && (
                  <Button
                    onClick={handleClaimAndShare}
                    disabled={isClaimSharing || isClaimShareConfirming || !shareAddress}
                    className="w-full"
                  >
                    {isClaimSharing || isClaimShareConfirming ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                    ) : (
                      <>Claim & Share {sharePct}%</>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Staking Visualization */}
      {hasStake && (
        <div className="space-y-3">
          <StakingVisualization
            amount={Number(stakeInfo.amount) / 1e18}
            maturityTimestamp={Number(stakeInfo.maturityTs)}
            term={Number(stakeInfo.term)}
            apy={Number(stakeInfo.apy)}
          />
          {Number(stakeInfo.maturityTs) * 1000 <= Date.now() && (
            <Button
              onClick={handleWithdraw}
              disabled={isWithdrawing || isWithdrawConfirming}
              className="w-full"
            >
              {isWithdrawing || isWithdrawConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                t("withdraw")
              )}
            </Button>
          )}
        </div>
      )}

      {/* No position */}
      {!hasMint && !hasStake && (
        <Card>
          <CardContent className="py-6 text-center">
            <Badge variant="secondary" className="mb-3">No Active Position</Badge>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("noPosition")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
