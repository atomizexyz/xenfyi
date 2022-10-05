import Link from "next/link";
import Container from "~/components/Container";
import {
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { useState, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { clsx } from "clsx";

const Stake = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [earlyEndStake, setEarlyEndStake] = useState(false);

  const { handleSubmit } = useForm();

  const { data: userStake } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
    cacheOnBlock: true,
    watch: true,
  });

  const { config } = usePrepareContractWrite({
    ...xenContract(chain),
    functionName: "withdraw",
  });
  const { data: withdrawData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: withdrawData?.hash,
    onSuccess(data) {
      toast("End stake successful");
      router.push("/stake/1");
    },
  });
  const handleStakeSubmit = () => {
    writeStake?.();
  };

  const utcTime = new Date().getTime() / 1000;

  useEffect(() => {
    if (!processing && address && userStake && !userStake.maturityTs.isZero()) {
      setDisabled(false);
      if (utcTime < userStake.maturityTs) {
        setEarlyEndStake(true);
      }
    }
  }, [address, utcTime, userStake, router, processing]);

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
                        <InformationCircleIcon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-bold">Note</h3>
                        <div className="text-xs">
                          Your stake term is not over yet. You can end your
                          stake early without a penalty without you yield or you
                          can wait until your stake matures to get the full
                          yield.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className={clsx("btn glass text-neutral", {
                    loading: processing,
                  })}
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
