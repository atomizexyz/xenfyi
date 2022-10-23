import Link from "next/link";
import Container from "~/components/containers/Container";
import { progressDays } from "~/lib/helpers";
import {
  ProgressStatCard,
  NumberStatCard,
  CountdownCard,
} from "~/components/StatCards";
import { useEffect, useState, useContext } from "react";
import Countdown from "react-countdown";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";

const Stake = () => {
  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

  const { xenBalance, userStake, genesisTs, globalRank, currentAPY } =
    useContext(XENContext);

  const mintItems = [
    {
      title: "Liquid XEN",
      value: xenBalance ?? 0,
      suffix: "",
    },
    {
      title: "Staked XEN",
      value: userStake?.amount ?? 0,
      suffix: "",
      tokenDecimals: 2,
    },
    {
      title: "APY",
      value: userStake?.apy ?? 0,
      suffix: "%",
    },
    {
      title: "Term",
      value: userStake?.term ?? 0,
      suffix: "",
      decimals: 0,
    },
  ];

  useEffect(() => {
    if (userStake) {
      const progress = progressDays(userStake.maturityTs, userStake.term);

      setProgress(progress);
      setPercent((progress / userStake.term) * 100);
    }
  }, [progress, userStake, userStake?.maturityTs, userStake?.term]);

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">Start Stake</a>
          </Link>

          <Link href="/stake/2">
            <a className="step step-neutral">Staking</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">End Stake</a>
          </Link>
        </ul>
        <CardContainer>
          <h2 className="card-title">Staking</h2>
          <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
            <Countdown
              date={userStake?.maturityTs * 1000}
              intervalDelay={0}
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
              max={userStake?.term}
              daysRemaining={userStake?.term - progress}
              dateTs={userStake?.maturityTs ?? 0}
            />
            {mintItems.map((item, index) => (
              <NumberStatCard
                key={index}
                title={item.title}
                value={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
                tokenDecimals={item.tokenDecimals}
              />
            ))}
          </div>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Stake;
