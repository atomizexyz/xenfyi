import {
  useNetwork,
  useContractRead,
  useAccount,
  useContractReads,
} from "wagmi";
import Container from "~/components/containers/Container";
import {
  NumberStatCard,
  ProgressStatCard,
  CountdownCard,
} from "~/components/StatCards";
import { progressDays, estimatedXEN, UTC_TIME } from "~/lib/helpers";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import Countdown from "react-countdown";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";

const Mint = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

  const { userMint, genesisTs, globalRank } = useContext(XENContext);

  const mintItems = [
    {
      title: "Estimated XEN",
      value: estimatedXEN(globalRank, userMint),
      suffix: "",
      decimals: 0,
    },
    {
      title: "Amplifier",
      value: userMint?.amplifier ?? 0,
      suffix: "",
      decimals: 0,
    },
    {
      title: "EAA Rate",
      value: userMint?.eaaRate / 10 ?? 0,
      suffix: "%",
      decimals: 2,
    },
    {
      title: "Rank",
      value: userMint?.rank ?? 0,
      suffix: "",
      decimals: 0,
    },
    {
      title: "Term",
      value: userMint?.term ?? 0,
      suffix: "",
      decimals: 0,
    },
  ];

  useEffect(() => {
    if (userMint) {
      if (userMint.maturityTs) {
        const progress = progressDays(
          userMint.maturityTs ?? 0,
          userMint.term ?? 0
        );

        setProgress(progress);
        setPercent((progress / userMint.term) * 100);
      }
    }
  }, [userMint?.maturityTs, userMint?.term, progress, userMint]);

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

        <CardContainer>
          <h2 className="card-title">Minting</h2>
          <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
            <Countdown
              date={userMint?.maturityTs * 1000}
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
              max={userMint?.term}
              daysRemaining={userMint?.term - progress}
              dateTs={userMint?.maturityTs ?? 0}
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
        </CardContainer>
      </div>
    </Container>
  );
};

export default Mint;
