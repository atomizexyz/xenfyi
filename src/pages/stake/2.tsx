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

  const { data: userStake } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserStake",
    overrides: { from: address },
    watch: true,
  });

  const mintItems = [
    {
      title: "Balance",
      value: balanceData?.formatted,
      suffix: "",
    },
    {
      title: "Amount",
      value: userStake?.amount,
      suffix: "",
    },
    {
      title: "APY",
      value: userStake?.apy,
      suffix: "%",
    },
    {
      title: "Term",
      value: userStake?.term,
      suffix: "",
    },
  ];

  const progressDaysRemaining = daysRemaining(userStake?.maturityTs);
  const progressPercentComplete = percentComplete(
    progressDaysRemaining,
    userStake?.term
  );
  const max = Number(userStake?.term ?? 0);
  const value = max - progressDaysRemaining;

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
            <h2 className="card-title">Staking</h2>
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
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
