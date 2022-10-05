import Link from "next/link";
import Container from "~/components/Container";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { useState, useEffect } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const Stake = () => {
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(true);
  const [earlyEndStake, setEarlyEndStake] = useState(false);

  const { handleSubmit } = useForm();

  const { data: userStake } = useContractRead({
    ...xenContract,
    functionName: "getUserStake",
    overrides: { from: address },
    cacheOnBlock: true,
    watch: true,
  });

  const { config, error } = usePrepareContractWrite({
    ...xenContract,
    functionName: "withdraw",
  });
  const { write: writeStake, isSuccess } = useContractWrite(config);
  const handleStakeSubmit = () => {
    writeStake?.();
  };

  const utcTime = new Date().getTime() / 1000;

  useEffect(() => {
    if (address && userStake && !userStake.maturityTs.isZero()) {
      setDisabled(false);
      if (utcTime < userStake.maturityTs) {
        setEarlyEndStake(true);
      }
    }
  }, [address, utcTime, userStake]);

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
            <a className="step step-neutral">End Stake</a>
          </Link>
        </ul>
        <div className="card glass">
          <div className="card-body">
            <form onSubmit={handleSubmit(handleStakeSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">End Stake</h2>

                {earlyEndStake && (
                  <div className="alert shadow-lg glass">
                    <div>
                      <div>
                        <ExclamationCircleIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold">Penalty</h3>
                        <div className="text-xs">
                          Your stake term is not over yet. You can end your
                          stake early but ending early will result in a penalty.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={disabled}
                >
                  {earlyEndStake ? "Early End Stake" : "End Stake"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
