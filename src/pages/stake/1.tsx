import Link from "next/link";
import Container from "~/components/containers/Container";
import {
  useNetwork,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { useEffect, useState, useContext } from "react";
import { DateStatCard, NumberStatCard } from "~/components/StatCards";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { xenContract } from "~/lib/xen-contract";
import { UTC_TIME, stakeYield } from "~/lib/helpers";
import { BigNumber, ethers } from "ethers";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import GasEstimate from "~/components/GasEstimate";
import { clsx } from "clsx";
import * as yup from "yup";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import { stakeFunction } from "~/abi/abi-functions";

const Stake = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [maturity, setMaturity] = useState<number>(UTC_TIME);

  const { xenBalance, userStake, genesisTs, globalRank, currentAPY, feeData } =
    useContext(XENContext);

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required("Stake amount required")
        .max(Number(xenBalance), `Maximum stake amount: ${xenBalance}`)
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
    formState: { errors, isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();
  /*** CONTRACT WRITE SETUP ***/

  const { config } = usePrepareContractWrite({
    address: xenContract(chain).address,
    abi: stakeFunction,
    functionName: "stake",
    args: [
      ethers.utils.parseUnits(
        (Number(watchAllFields?.startStakeAmount) || 0).toString(),
        xenBalance
      ),
      watchAllFields.startStakeDays ?? 0,
    ],
    enabled: isValid,
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

  /*** USE EFFECT ****/

  useEffect(() => {
    if (watchAllFields.startStakeDays) {
      setMaturity(UTC_TIME + (watchAllFields.startStakeDays ?? 0) * 86400);
    }

    if (!processing && address && userStake && userStake.term == 0) {
      setDisabled(false);
    }
  }, [address, processing, userStake, watchAllFields.startStakeDays]);

  return (
    <Container className="max-w-2xl">
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

        <CardContainer>
          <form onSubmit={handleSubmit(handleStakeSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">Start Stake</h2>
              <MaxValueField
                title="AMOUNT"
                description="Maximum stake amount"
                value={BigNumber.from(xenBalance).toString()}
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

              <div className="flex stats glass w-full text-neutral">
                <NumberStatCard
                  title="Yield"
                  value={stakeYield({
                    xenBalance: watchAllFields.startStakeAmount,
                    genesisTs: genesisTs,
                    term: watchAllFields.startStakeDays,
                    apy: currentAPY,
                  })}
                  decimals={0}
                  description={`${currentAPY.toFixed(2)}%`}
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
                      Withdraw original stake amount plus yield at any time
                      after the maturity date, or at any time the original stake
                      amount with 0 (zero) yield before the maturity date. One
                      stake at a time per one address
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
              </div>
              <GasEstimate
                feeData={feeData}
                gasLimit={config?.request?.gasLimit}
              />
            </div>
          </form>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Stake;
