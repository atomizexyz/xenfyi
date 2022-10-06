import Link from "next/link";
import Container from "~/components/Container";
import { useNetwork, useContractRead, useBalance, useAccount } from "wagmi";
import { daysRemaining, percentComplete } from "~/lib/helpers";
import { ProgressStatCard, NumberStatCard } from "~/components/StatCards";
import { xenContract } from "~/lib/xen-contract";

const Stake = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    watch: true,
  });

  const { data: userStake } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
    watch: true,
  });

  const mintItems = [
    {
      title: "Liquid XEN",
      value: balanceData?.formatted,
      suffix: "",
    },
    {
      title: "Staked XEN",
      value: userStake?.amount,
      suffix: "",
      tokenDecimals: balanceData?.decimals,
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
      decimals: 0,
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
                  decimals={item.decimals}
                  tokenDecimals={item.tokenDecimals}
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
