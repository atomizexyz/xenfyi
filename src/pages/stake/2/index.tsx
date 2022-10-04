import Container from "~/components/Container";
import { useContractRead, useBalance, useAccount } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { daysRemaining, percentComplete } from "~/lib/helpers";
import Link from "next/link";

import { ProgressStatCard, NumberStatCard } from "~/components/StatCards";

const Stake = () => {
  const { address } = useAccount();

  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
  });

  const { data: userStakeData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserStake",
    overrides: { from: address },
  });

  const mintItems = [
    {
      title: "Balance",
      value: balanceData?.formatted,
      suffix: "",
    },
    {
      title: "Amount",
      value: userStakeData?.amount,
      suffix: "",
    },
    {
      title: "APY",
      value: userStakeData?.apy,
      suffix: "%",
    },
    {
      title: "Term",
      value: userStakeData?.term,
      suffix: "",
    },
  ];

  const progressDaysRemaining = daysRemaining(userStakeData?.maturityTs);
  const progressPercentComplete = percentComplete(
    progressDaysRemaining,
    userStakeData?.term
  );

  const StakingStep = () => {
    return (
      <>
        <h2 className="card-title">Staking</h2>
        <div className="stats stats-vertical bg-transparent text-neutral">
          <ProgressStatCard
            title="Progress"
            percentComplete={progressPercentComplete}
            max={userStakeData?.term ?? 0.0}
            daysRemaining={progressDaysRemaining}
          />
          {mintItems.map((item, index) => (
            <NumberStatCard
              key={index}
              title={item.title}
              number={item.value}
              suffix={item.suffix}
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
        <div className="card glass">
          <div className="card-body">
            <StakingStep />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
