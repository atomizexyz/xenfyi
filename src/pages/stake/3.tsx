import Link from "next/link";
import Container from "~/components/Container";
import {
  useFeeData,
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
import { FeeData, calculateStakeReward, UTC_TIME } from "~/lib/helpers";
import { useState, useEffect } from "react";
import { CountDataCard } from "~/components/StatCards";
import { InformationCircleIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import GasEstimate from "~/components/GasEstimate";

const Stake = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [fee, setFee] = useState<FeeData>();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [earlyEndStake, setEarlyEndStake] = useState(false);
  const { data: feeData } = useFeeData();

  const { handleSubmit } = useForm();

  const { data: userStake } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
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

  useEffect(() => {
    if (!processing && address && userStake && !userStake.maturityTs.isZero()) {
      setDisabled(false);
      if (UTC_TIME < userStake.maturityTs) {
        setEarlyEndStake(true);
      }
    }
    const gasPrice = feeData?.gasPrice;
    const gasLimit = config?.request?.gasLimit;
    if (gasPrice && gasLimit) {
      setFee({
        gas: gasPrice,
        transaction: gasLimit,
      });
    }
  }, [
    address,
    userStake,
    router,
    processing,
    config?.request?.gasLimit,
    feeData?.gasPrice,
  ]);

  return (
    <Container className="max-w-2xl">
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

                <div className="stats glass w-full text-neutral">
                  <CountDataCard
                    title="Reward"
                    value={calculateStakeReward({
                      maturityTs: Number(userStake?.maturityTs ?? 0),
                      term: Number(userStake?.term ?? 0),
                      amount: Number(userStake?.amount ?? 0),
                      apy: Number(userStake?.apy ?? 0),
                    })}
                    description="XEN"
                  />
                </div>

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

                <div className="form-control w-full">
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

                <GasEstimate fee={fee} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
