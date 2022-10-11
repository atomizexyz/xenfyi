import {
  useFeeData,
  useNetwork,
  useAccount,
  useContractRead,
  useContractWrite,
  useContractReads,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import Container from "~/components/Container";
import { MaxValueField } from "~/components/FormFields";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { DateStatCard, NumberStatCard } from "~/components/StatCards";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { UTC_TIME, FeeData } from "~/lib/helpers";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import * as yup from "yup";
import GasEstimate from "~/components/GasEstimate";

const Mint = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [fee, setFee] = useState<FeeData>();
  const [disabled, setDisabled] = useState(true);
  const [maxFreeMint, setMaxFreeMint] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [maturity, setMaturity] = useState<number>(UTC_TIME);

  /*** CONTRACT READ SETUP  ***/

  const { data } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    watch: true,
  });

  const { data: feeData } = useFeeData();

  const { data: contractReads } = useContractReads({
    contracts: [
      {
        ...xenContract(chain),
        functionName: "getCurrentMaxTerm",
      },
      {
        ...xenContract(chain),
        functionName: "globalRank",
      },
    ],
    watch: true,
  });

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startMintDays: yup
        .number()
        .required("Days required")
        .max(maxFreeMint, `Maximum claim days: ${maxFreeMint}`)
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

  const { config, error } = usePrepareContractWrite({
    ...xenContract(chain),
    functionName: "claimRank",
    args: [watchAllFields.startMintDays ?? 0],
  });
  const { data: claimRankData, write } = useContractWrite({
    ...config,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const {} = useWaitForTransaction({
    hash: claimRankData?.hash,
    onSuccess(data) {
      toast("Claim successful");
      router.push("/mint/2");
    },
  });
  const onSubmit = () => {
    write?.();
  };

  /*** USE EFFECT ****/

  useEffect(() => {
    if (watchAllFields.startMintDays) {
      setMaturity(UTC_TIME + watchAllFields.startMintDays * 86400);
    }

    if (!processing && address && data && data.term.isZero()) {
      setDisabled(false);
    }

    setMaxFreeMint(Number(contractReads?.[0] ?? 8640000) / 86400);
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
    config?.request?.gasLimit,
    contractReads,
    data,
    feeData?.gasPrice,
    processing,
    watchAllFields.startMintDays,
  ]);

  return (
    <Container className="max-w-2xl">
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">Start Mint</a>
          </Link>

          <Link href="/mint/2">
            <a className="step">Minting</a>
          </Link>

          <Link href="/mint/3">
            <a className="step">Mint</a>
          </Link>
        </ul>

        <div className="card glass">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">Claim Rank</h2>
                <MaxValueField
                  title="DAYS"
                  description="Number of days"
                  decimals={0}
                  value={maxFreeMint}
                  disabled={disabled}
                  errorMessage={
                    <ErrorMessage errors={errors} name="startMintDays" />
                  }
                  register={register("startMintDays")}
                  setValue={setValue}
                />

                <div className="flex stats glass w-full text-neutral">
                  <NumberStatCard
                    title="Your Claim Rank"
                    value={Number(contractReads?.[1] ?? 0)}
                    decimals={0}
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
                      <h3 className="font-bold">Minting Terms</h3>
                      <div className="text-xs">
                        Your mint starts by claiming a rank. Select the number
                        of days you want to mint for. The longer you mint for,
                        the more rewards you will receive. You can mint for a
                        maximum of {maxFreeMint} days.
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
                    Start Mint
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

export default Mint;
