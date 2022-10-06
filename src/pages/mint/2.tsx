import {
  useNetwork,
  useContractRead,
  useAccount,
  useContractReads,
} from "wagmi";
import Container from "~/components/Container";
import { NumberStatCard, ProgressStatCard } from "~/components/StatCards";
import {
  daysRemaining,
  percentComplete,
  estimatedXEN,
  MintData,
} from "~/lib/helpers";
import { useEffect, useState } from "react";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";

const Mint = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [mintingData, setMintingData] = useState<MintData>();

  const { data: userMint } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    watch: true,
  });

  const { data: contractReads } = useContractReads({
    contracts: [
      {
        ...xenContract(chain),
        functionName: "genesisTs",
      },
      {
        ...xenContract(chain),
        functionName: "globalRank",
      },
    ],
    watch: true,
  });

  const { data: grossRewardData } = useContractRead({
    ...xenContract(chain),
    functionName: "getGrossReward",
    args: [
      (mintingData?.globalRank ?? 0) - (mintingData?.rank ?? 0),
      Number(mintingData?.amplifier ?? 0),
      Number(mintingData?.term ?? 0),
      1000 + Number(mintingData?.eaaRate ?? 0),
    ],
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
      title: "Gross Reward",
      value: Number(grossRewardData),
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
  const max = Number(mintingData?.term ?? 0);
  const value = max - progressDaysRemaining;

  useEffect(() => {
    if (userMint && contractReads) {
      setMintingData({
        user: String(userMint?.user),
        eaaRate: Number(userMint?.eaaRate),
        maturityTs: Number(userMint?.maturityTs),
        rank: Number(userMint?.rank),
        amplifier: Number(userMint?.amplifier),
        term: Number(userMint?.term),
        genesisTs: Number(contractReads[0]),
        globalRank: Number(contractReads[1]),
      });
    }
  }, [userMint, contractReads]);

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
                value={value}
                max={max}
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
