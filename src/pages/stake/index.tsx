import { useAccount } from "wagmi";
import Container from "~/components/Container";
import { useContractRead, useBalance } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useStep } from "usehooks-ts";
import { clsx } from "clsx";

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
            {/* <ul>
              {userStakeData && (
                <>
                  <li>balance {balanceData?.formatted}</li>
                  <li>amount {userStakeData.amount.toString()}</li>
                  <li>apy {userStakeData.apy.toString()}</li>
                  <li>maturityTs {userStakeData.maturityTs.toString()}</li>
                  <li>term {userStakeData.term.toString()}</li>
                </>
              )}
            </ul> */}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
