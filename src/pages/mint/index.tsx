import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import CountUp from "react-countup";
import { useStep } from "usehooks-ts";
import { clsx } from "clsx";
import { PercentageField, DaysField } from "~/components/FormFields";
import { NumberStatCard, ProgressStatCard } from "~/components/StatCards";

const steps: any[] = [
  {
    id: 1,
    title: "Start Mint",
  },
  {
    id: 2,
    title: "Minting",
  },
  {
    id: 3,
    title: "Claim",
  },
];

const Mint = () => {
  const { address } = useAccount();
  const [currentStep, helpers] = useStep(steps.length);
  const { goToNextStep, setStep } = helpers;

  const { data: userMintData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserMint",
    overrides: { from: address },
  });

  const mintItems = [
    {
      title: "Amplifier",
      value: userMintData?.amplifier,
      suffix: "",
      decimals: 0,
    },
    {
      title: "EAA Rate",
      value: userMintData?.eaaRate / 10,
      suffix: "%",
      decimals: 2,
    },
    {
      title: "Rank",
      value: userMintData?.rank,
      suffix: "",
      decimals: 0,
    },
    {
      title: "Term",
      value: userMintData?.term,
      suffix: "",
      decimals: 0,
    },
  ];

  const daysRemaining = () => {
    if (userMintData?.maturityTs && userMintData.maturityTs > 0) {
      return (Number(userMintData.maturityTs) - Date.now() / 1000) / 86400;
    } else {
      return 0;
    }
  };
  const percentComplete = () => {
    if (userMintData?.term && userMintData.term > 0) {
      return userMintData.term - daysRemaining();
    } else {
      return 0;
    }
  };

  const Claim = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim</h2>
        <DaysField />
        <button className="btn glass text-neutral">Start Mint</button>
      </div>
    );
  };

  const ClaimShare = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim + Share</h2>
        <div className="form-control w-full">
          <label className="label text-neutral">
            <span className="label-text text-neutral">WALLET ADDRESS</span>
            <span className="label-text-alt text-error">Required</span>
          </label>
          <input
            type="text"
            placeholder="0x"
            className="input input-bordered w-full text-neutral"
          />
          <label className="label">
            <span className="label-text-alt text-neutral">
              Wallet address where you want to share your XEN
            </span>
          </label>
        </div>

        <PercentageField />

        <button className="btn glass text-neutral">Claim + Share</button>
      </div>
    );
  };

  const ClaimStake = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim + Stake</h2>

        <PercentageField />
        <DaysField />

        <button className="btn glass text-neutral">Claim + Stake</button>
      </div>
    );
  };

  const StartMintStep = () => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Start Mint</h2>
        <DaysField />
        <button className="btn glass text-neutral">Start Mint</button>
      </div>
    );
  };

  const MintingStep = () => {
    return (
      <>
        <h2 className="card-title">Minting</h2>
        <div className="stats stats-vertical bg-transparent text-neutral">
          <ProgressStatCard
            title="Progress"
            percentComplete={percentComplete()}
            max={userMintData?.term ?? 0.0}
            daysRemaining={daysRemaining()}
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

  const ClaimStep = () => {
    return (
      <div className="flex flex-col w-full border-opacity-50">
        <Claim />
        <div className="divider">OR</div>
        <ClaimShare />
        <div className="divider">OR</div>
        <ClaimStake />
      </div>
    );
  };

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
                  return <MintingStep />;
                case 3:
                  return <ClaimStep />;
                default:
                  return <StartMintStep />;
              }
            })()}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Mint;
