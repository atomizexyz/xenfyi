import { useAccount, useContractReads } from "wagmi";
import Container from "~/components/Container";
import XenCrypto from "~/abi/XENCrypto.json";
import { NumberStatCard, ProgressStatCard } from "~/components/StatCards";
import {
  daysRemaining,
  percentComplete,
  estimatedXEN,
  MintData,
} from "~/lib/helpers";
import { useState } from "react";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";

const Mint = () => {
  const { address } = useAccount();
  const [mintingData, setMintingData] = useState<MintData>();

  const {} = useContractReads({
    contracts: [
      {
        ...xenContract,
        functionName: "getUserMint",
      },
      {
        ...xenContract,
        functionName: "genesisTs",
      },
      {
        ...xenContract,
        functionName: "globalRank",
      },
    ],

    onSuccess(data) {
      const userMint = data[0];
      setMintingData({
        user: String(userMint[0]),
        eaaRate: Number(userMint[1]),
        maturityTs: Number(userMint[2]),
        rank: Number(userMint[3]),
        amplifier: Number(userMint[4]),
        term: Number(userMint[5]),
        genesisTs: Number(data[1]),
        globalRank: Number(data[2]),
      });
    },
    overrides: { from: address },
    watch: true,
  });

  const mintItems = [
    {
      title: "Estimated XEN",
      value: Number(estimatedXEN(mintingData)),
      suffix: "",
      decimals: 0,
    },
    {
      title: "Amplifier",
      value: Number(mintingData?.amplifier),
      suffix: "",
      decimals: 0,
    },
    {
      title: "EAA Rate",
      value: Number(mintingData?.eaaRate) / 10,
      suffix: "%",
      decimals: 2,
    },
    {
      title: "Rank",
      value: Number(mintingData?.rank),
      suffix: "",
      decimals: 0,
    },
    {
      title: "Term",
      value: Number(mintingData?.term),
      suffix: "",
      decimals: 0,
    },
  ];

  const progressDaysRemaining = daysRemaining(mintingData?.maturityTs);
  const progressPercentComplete = percentComplete(
    progressDaysRemaining,
    mintingData?.term
  );

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">Start Mint</a>
          </Link>

          <Link href="/mint/2">
            <a className="step step-neutral">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step">Claim</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <h2 className="card-title">Minting</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              <ProgressStatCard
                title="Progress"
                percentComplete={progressPercentComplete}
                max={mintingData?.term ?? 0}
                daysRemaining={progressDaysRemaining}
              />
              {mintItems.map((item, index) => (
                <NumberStatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  suffix={item.suffix}
                  decimals={item.decimals}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
