import { useAccount, useContractRead } from "wagmi";
import Container from "~/components/Container";
import XenCrypto from "~/abi/XENCrypto.json";
import { useStep } from "usehooks-ts";
import { clsx } from "clsx";
import { PercentageField, DaysField } from "~/components/FormFields";
import { NumberStatCard, ProgressStatCard } from "~/components/StatCards";
import { daysRemaining, percentComplete } from "~/lib/helpers";
import { useState, useEffect } from "react";

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
  const { setStep } = helpers;
  const [currentStateStep, setCurrentStateStep] = useState(0);

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

  const progressDaysRemaining = daysRemaining(userMintData?.maturityTs);
  const progressPercentComplete = percentComplete(
    progressDaysRemaining,
    userMintData?.term
  );

  const Claim = (props: any) => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim</h2>
        <DaysField disabled={props.disabled} />
        <button className="btn glass text-neutral" disabled={props.disabled}>
          Start Mint
        </button>
      </div>
    );
  };

  const ClaimShare = (props: any) => {
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
            disabled={props.disabled}
          />
          <label className="label">
            <span className="label-text-alt text-neutral">
              Wallet address where you want to share your XEN
            </span>
          </label>
        </div>

        <PercentageField disabled={props.disabled} />

        <button className="btn glass text-neutral" disabled={props.disabled}>
          Claim + Share
        </button>
      </div>
    );
  };

  const ClaimStake = (props: any) => {
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Claim + Stake</h2>

        <PercentageField disabled={props.disabled} />
        <DaysField disabled={props.disabled} />

        <button className="btn glass text-neutral" disabled={props.disabled}>
          Claim + Stake
        </button>
      </div>
    );
  };

  const StartMintStep = () => {
    const disabled = currentStateStep == 2;
    return (
      <div className="flex flex-col space-y-4">
        <h2 className="card-title text-neutral">Start Mint</h2>
        <DaysField disabled={disabled} />
        <button className="btn glass text-neutral" disabled={disabled}>
          Start Mint
        </button>
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
            percentComplete={progressPercentComplete}
            max={userMintData?.term ?? 0.0}
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

  const ClaimStep = () => {
    const disable = currentStateStep == 2;

    return (
      <div className="flex flex-col w-full border-opacity-50">
        <Claim disabled={disable} />
        <div className="divider">OR</div>
        <ClaimShare disabled={disable} />
        <div className="divider">OR</div>
        <ClaimStake disabled={disable} />
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
