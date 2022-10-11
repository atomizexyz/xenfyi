import {
  useNetwork,
  useContractRead,
  useAccount,
  useContractReads,
} from "wagmi";
import Container from "~/components/Container";
import {
  NumberStatCard,
  ProgressStatCard,
  CountdownCard,
} from "~/components/StatCards";
import { progressDays, estimatedXEN, MintData, UTC_TIME } from "~/lib/helpers";
import { useEffect, useState } from "react";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import Countdown from "react-countdown";

const Mint = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [mintingData, setMintingData] = useState<MintData>();
  const [max, setMax] = useState(0);
  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

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

      if (userMint.maturityTs) {
        const max = Number(userMint.term ?? 0);
        const progress = progressDays(
          Number(userMint.maturityTs ?? 0),
          Number(userMint.term ?? 0)
        );

        setMax(max);
        setProgress(progress);
        setPercent((progress / max) * 100);
      }
    }
  }, [contractReads, userMint?.maturityTs, userMint?.term, progress, userMint]);

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">Claim Rank</a>
          </Link>

          <Link href="/mint/2">
            <a className="step step-neutral">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step">Mint</a>
          </Link>
        </ul>

        <div className="w-full"></div>

        <div className="card glass">
          <div className="card-body">
            <h2 className="card-title">Minting</h2>
            <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
              <Countdown
                date={Number(userMint?.maturityTs) * 1000}
                renderer={(props) => (
                  <CountdownCard
                    days={props.days}
                    hours={props.hours}
                    minutes={props.minutes}
                    seconds={props.seconds}
                  />
                )}
              />
              <ProgressStatCard
                title="Progress"
                percentComplete={percent}
                value={progress}
                max={max}
                daysRemaining={max - progress}
                dateTs={Number(userMint?.maturityTs)}
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
