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

const Mint = () => {
  const { address } = useAccount();
  const [mintData, setMintData] = useState<MintData>();

  const xenContract = {
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
  };

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
      console.log(data);
      const userMint = data[0];
      // only update if data has changed

      setMintData({
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
      value: Number(estimatedXEN(mintData)),
      suffix: "",
      decimals: 0,
    },
    {
      title: "Amplifier",
      value: Number(mintData?.amplifier),
      suffix: "",
      decimals: 0,
    },
    {
      title: "EAA Rate",
      value: Number(mintData?.eaaRate) / 10,
      suffix: "%",
      decimals: 2,
    },
    {
      title: "Rank",
      value: Number(mintData?.rank),
      suffix: "",
      decimals: 0,
    },
    {
      title: "Term",
      value: Number(mintData?.term),
      suffix: "",
      decimals: 0,
    },
  ];

  const progressDaysRemaining = daysRemaining(mintData?.maturityTs);
  const progressPercentComplete = percentComplete(
    progressDaysRemaining,
    mintData?.term
  );

  const MintingStep = () => {
    return (
      <>
        <h2 className="card-title">Minting</h2>
        <div className="stats stats-vertical bg-transparent text-neutral">
          <ProgressStatCard
            title="Progress"
            percentComplete={progressPercentComplete}
            max={mintData?.term ?? 0}
            daysRemaining={progressDaysRemaining}
          />
          {mintItems.map((item, index) => (
            <NumberStatCard
              key={index}
              title={item.title}
              number={item.value}
              suffix={item.suffix}
              decimals={item.decimals}
            />
          ))}
        </div>
      </>
    );
  };

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
            <MintingStep />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
