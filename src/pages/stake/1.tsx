import Link from "next/link";
import Container from "~/components/Container";
import XenCrypto from "~/abi/XENCrypto.json";

import {
  useBalance,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { DaysField, AmountField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { DateStatCard, NumberStatCard } from "~/components/StatCards";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { stakeYield, stakeAPY } from "~/lib/helpers";

const Stake = () => {
  const { address } = useAccount();
  const [disabled, setDisabled] = useState(true);
  const { register, handleSubmit, watch, setValue } = useForm();
  const watchAllFields = watch();

  const [maturity, setMaturity] = useState<number>(new Date().getTime());

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

  const { data: contractReads } = useContractReads({
    contracts: [
      {
        ...xenContract,
        functionName: "genesisTs",
      },
    ],
    overrides: { from: address },
    cacheOnBlock: true,
  });

  const { config, error } = usePrepareContractWrite({
    ...xenContract,
    functionName: "stake",
    args: [
      watchAllFields.startStakeAmount * 1e18,
      watchAllFields.startStakeDays,
    ],
  });
  const { write: writeStake } = useContractWrite(config);
  const handleStakeSubmit = (data: any) => {
    writeStake?.();
  };

  useEffect(() => {
    if (watchAllFields.startStakeDays) {
      const utcTime = new Date().getTime();
      setMaturity(utcTime + (watchAllFields.startStakeDays ?? 0) * 86400000);
    }

    if (address && userStake && userStake.term == 0) {
      setDisabled(false);
    }
  }, [address, contractReads, userStake, watchAllFields.startStakeDays]);

  return (
    <Container>
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">Start Stake</a>
          </Link>

          <Link href="/stake/2">
            <a className="step">Staking</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">End Stake</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <form onSubmit={handleSubmit(handleStakeSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">Start Stake</h2>
                <AmountField
                  balance={balanceData?.formatted ?? "0.0"}
                  disabled={disabled}
                  register={register("startStakeAmount")}
                  setValue={setValue}
                />
                <DaysField
                  disabled={disabled}
                  register={register("startStakeDays")}
                />

                <div className="stats glass w-full text-neutral">
                  <NumberStatCard
                    title="Yield"
                    value={stakeYield({
                      xenBalance: watchAllFields.startStakeAmount,
                      genesisTs: Number(contractReads?.[0]),
                      term: watchAllFields.startStakeDays,
                    })}
                    decimals={0}
                    description={`${stakeAPY({
                      xenBalance: watchAllFields.startStakeAmount,
                      genesisTs: Number(contractReads?.[0]),
                      term: watchAllFields.startStakeDays,
                    }).toFixed(2)}%`}
                  />
                  <DateStatCard
                    title="Maturity"
                    dateTs={maturity}
                    isPast={false}
                  />
                </div>

                <div className="alert shadow-lg glass">
                  <div>
                    <div>
                      <InformationCircleIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold">Staking Terms</h3>
                      <div className="text-xs">
                        Withdraw original Stake amount plus Yield at any time
                        after Maturity Date, or original Stake amount with 0
                        (zero) Yield at anu time before Maturity Date. One stake
                        at a time per one address.
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn glass text-neutral"
                  disabled={disabled}
                >
                  Start Stake
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
