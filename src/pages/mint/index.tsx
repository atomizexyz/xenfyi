import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import CountUp from "react-countup";
import { useStep } from "usehooks-ts";
import { clsx } from "clsx";
import { PercentageField, DaysField } from "~/components/FormFields";

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
    },
    {
      title: "EAA Rate",
      value: userMintData?.eaaRate / 10,
      suffix: "%",
    },
    {
      title: "Rank",
      value: userMintData?.rank,
      suffix: "",
    },
    {
      title: "Term",
      value: userMintData?.term,
      suffix: "",
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

  const MintProgress = () => {
    return (
      <div className="stat">
        <div className="stat-title">Progress</div>
        <div className="stat-value text-lg md:text-3xl text-right">
          <CountUp
            end={percentComplete()}
            preserveValue={true}
            separator=","
            suffix="%"
            decimals={2}
          />
        </div>
        <div>
          <progress
            className="progress progress-secondary"
            value={percentComplete()}
            max={userMintData?.term ?? 0.0}
          ></progress>
        </div>
        <code className="stat-desc text-right">
          <CountUp
            end={daysRemaining()}
            preserveValue={true}
            separator=","
            prefix="Days Remaining: "
            decimals={0}
          />
        </code>
      </div>
    );
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
          <MintProgress />
          {mintItems.map((item, index) => (
            <div className="stat" key={index}>
              <div className="stat-title">{item.title}</div>
              <code className="stat-value text-lg md:text-3xl text-right">
                <CountUp
                  end={item.value}
                  preserveValue={true}
                  separator=","
                  suffix={item.suffix}
                  // decimals={2}
                />
              </code>
              <div className="stat-desc text-right"></div>
            </div>
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
