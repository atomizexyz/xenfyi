import Container from "~/components/Container";
import { useContractRead, useBalance, useAccount } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useStep } from "usehooks-ts";
import { clsx } from "clsx";
import { DaysField, AmountField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { ProgressStatCard, NumberStatCard } from "~/components/StatCards";

const steps: any[] = [
  {
    id: 1,
    title: "Start Stake",
  },
  {
    id: 2,
    title: "Staking",
  },
  {
    id: 3,
    title: "End Stake",
  },
];

const Stake = () => {
  const { address } = useAccount();
  const [currentStep, helpers] = useStep(steps.length);
  const { goToNextStep, setStep } = helpers;
  const [yeild, setYeild] = useState(0);
  const [maturity, setMaturity] = useState<number>(Date.now());

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

  const daysRemaining = () => {
    if (userStakeData?.maturityTs && userStakeData.maturityTs > 0) {
      return (Number(userStakeData.maturityTs) - Date.now() / 1000) / 86400;
    } else {
      return 0;
    }
  };
  const percentComplete = () => {
    if (userStakeData?.term && userStakeData.term > 0) {
      return userStakeData.term - daysRemaining();
    } else {
      return 0;
    }
  };

  const formatDate = (date: number) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const _date = `0${d.getDate()}`.slice(-2);
    return `${year}/${month}/${_date}`;
  };

  const EndStakeStep = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">End Stake</h2>
        <button className="btn glass text-neutral">End Stake</button>
      </div>
    );
  };

  const StartStakeStep = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Start Stake</h2>
        <AmountField balance={balanceData?.formatted ?? "0.0"} />
        <DaysField />

        <div className="stats glass">
          <div className="stat">
            <div className="stat-title">Maturity</div>
            <div className="stat-value text-lg md:text-3xl ">
              {formatDate(maturity)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Yield</div>
            <div className="stat-value text-lg md:text-3xl">{yeild}</div>
          </div>
        </div>

        <div className="alert shadow-lg glass">
          <div>
            <InformationCircleIcon className="w-16 h-16" />
            <div>
              <h3 className="font-bold">Staking Terms</h3>
              <div className="text-xs">
                Withdraw original Stake amount plus Yield at any time after
                Maturity Date, or original Stake amount with 0 (zero) Yield at
                anu time before Maturity Date. One stake at a time per one
                address.
              </div>
            </div>
          </div>
        </div>
        <button className="btn glass text-neutral">Start Stake</button>
      </div>
    );
  };

  const StakingStep = () => {
    return (
      <>
        <h2 className="card-title">Staking</h2>
        <div className="stats stats-vertical bg-transparent text-neutral">
          <ProgressStatCard
            title="Progress"
            percentComplete={percentComplete()}
            max={userStakeData?.term ?? 0.0}
            daysRemaining={daysRemaining()}
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

  // Use effect
  useEffect(() => {
    setYeild(10);
  }, [userStakeData]);

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          {steps.map((step, index) => {
            return (
              <button
                onClick={() => setStep(step.id)}
                key={index}
                className={clsx("step", {
                  "step-neutral": currentStep >= step.id,
                })}
              >
                {step.title}
              </button>
            );
          })}
        </ul>
        <div className="card glass">
          <div className="card-body">
            {(() => {
              switch (currentStep) {
                case 2:
                  return <StakingStep />;
                case 3:
                  return <EndStakeStep />;
                default:
                  return <StartStakeStep />;
              }
            })()}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
