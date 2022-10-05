import Link from "next/link";
import Container from "~/components/Container";
import XenCrypto from "~/abi/XENCrypto.json";

import {
  useNetwork,
  useBalance,
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { DateStatCard, NumberStatCard } from "~/components/StatCards";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { xenContract } from "~/lib/xen-contract";
import { stakeYield, stakeAPY, gasCalculator } from "~/lib/helpers";
import { BigNumber, ethers } from "ethers";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { clsx } from "clsx";
import * as yup from "yup";

const Stake = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [maturity, setMaturity] = useState<number>(new Date().getTime());

  /*** CONTRACT READ SETUP  ***/

  const { data: balanceData } = useBalance({
    addressOrName: address,
    token: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    watch: true,
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
        ...xenContract(chain),
        functionName: "genesisTs",
      },
    ],
    overrides: { from: address },
    cacheOnBlock: true,
  });

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required("Stake amount required")
        .max(
          Number(balanceData?.formatted ?? 0),
          `Maximum stake amount: ${balanceData?.formatted}`
        )
        .positive()
        .typeError("Stake amount required"),
      startStakeDays: yup
        .number()
        .required("Days required")
        .max(1000, "Maximum stake days: 1000")
        .positive("Days must be greater than 0")
        .typeError("Days required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();

  /*** CONTRACT WRITE SETUP ***/

  const { config } = usePrepareContractWrite({
    ...xenContract(chain),
    functionName: "stake",
    args: [
      ethers.utils.parseUnits(
        (Number(watchAllFields?.startStakeAmount) || 0).toString(),
        balanceData?.decimals ?? 1
      ),
      watchAllFields.startStakeDays ?? 0,
    ],
  });
  const { data: stakeData, write: writeStake } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: stakeData?.hash,
    onSuccess(data) {
      toast("Stake successful");
      router.push("/stake/2");
    },
  });
  const handleStakeSubmit = (data: any) => {
    writeStake?.();
  };

  console.log(config);

  /*** USE EFFECT ****/

  useEffect(() => {
    if (watchAllFields.startStakeDays) {
      const utcTime = new Date().getTime();
      setMaturity(utcTime + (watchAllFields.startStakeDays ?? 0) * 86400000);
    }

    if (!processing && address && userStake && userStake.term == 0) {
      setDisabled(false);
    }
  }, [
    address,
    contractReads,
    processing,
    userStake,
    watchAllFields.startStakeDays,
  ]);

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
                <MaxValueField
                  title="AMOUNT"
                  description="Maximum stake amount"
                  value={BigNumber.from(balanceData?.value ?? 0).toString()}
                  disabled={disabled}
                  errorMessage={
                    <ErrorMessage errors={errors} name="startStakeAmount" />
                  }
                  register={register("startStakeAmount")}
                  setValue={setValue}
                />

                <MaxValueField
                  title="DAYS"
                  description="Maximum stake days"
                  decimals={0}
                  value={1000}
                  disabled={disabled}
                  errorMessage={
                    <ErrorMessage errors={errors} name="startStakeDays" />
                  }
                  register={register("startStakeDays")}
                  setValue={setValue}
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
                <div className="form-control w-full">
                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled}
                  >
                    Start Stake
                  </button>
                  <label className="label">
                    <span className="label-text-alt text-neutral">
                      GAS ESTIMATE:
                    </span>
                    <code className="label-text-alt text-neutral">
                      {gasCalculator(Number(config?.request?.gasLimit ?? 0))}
                    </code>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Stake;
