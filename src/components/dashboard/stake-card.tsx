"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { parseEther } from "viem";
import { xenCryptoAbi } from "@/abi/xen-crypto";
import { getChainConfigById } from "@/config/chains";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

interface StakeCardProps {
  chainId: number;
}

export function StakeCard({ chainId }: StakeCardProps) {
  const t = useTranslations("dashboard");
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const config = getChainConfigById(chainId);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleStake = () => {
    if (!config || !amount || !term) return;
    writeContract({
      address: config.contractAddress,
      abi: xenCryptoAbi,
      functionName: "stake",
      args: [parseEther(amount), BigInt(term)],
      chainId,
    });
  };

  return (
    <Card className="gradient-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gradient-mid)]/20 to-[var(--color-gradient-end)]/10">
            <Lock className="h-5 w-5 text-[var(--color-gradient-mid)]" />
          </div>
          <div>
            <CardTitle>Stake XEN</CardTitle>
            <CardDescription>Lock your XEN to earn yield</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!isConnected ? (
          <ConnectKitButton.Custom>
            {({ show }) => (
              <Button onClick={show} className="w-full">
                Connect Wallet to Stake
              </Button>
            )}
          </ConnectKitButton.Custom>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-[var(--muted-foreground)]">
                {t("stakeAmount")}
              </label>
              <Input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[var(--muted-foreground)]">
                {t("stakeTerm")}
              </label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="1-1000"
              />
            </div>

            <Button
              onClick={handleStake}
              disabled={!amount || !term || isPending || isConfirming}
              className="w-full"
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isPending ? "Confirming..." : "Processing..."}
                </>
              ) : (
                t("stakeAction")
              )}
            </Button>

            {isSuccess && (
              <Badge variant="success" className="w-full justify-center py-2">
                <CheckCircle2 className="h-3 w-3" />
                Staked successfully!
              </Badge>
            )}
            {error && (
              <Badge variant="destructive" className="w-full justify-center py-2">
                {error.message.slice(0, 80)}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
