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
import XENCryptoABI from "~/abi/XENCryptoABI";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const Stake = () => {
  const { t } = useTranslation("common");

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [maturity, setMaturity] = useState<number>(UTC_TIME);

  const { xenBalance, userStake, genesisTs, currentAPY, feeData } =
    useContext(XENContext);

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required(t("form-field.amount-required"))
        .max(
          Number(
            ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))
          ),
          t("form-field.amount-maximum", {
            maximumAmount: xenBalance?.formatted,
          })
        )
        .positive(t("form-field.amount-positive"))
        .typeError(t("form-field.amount-required")),
      startStakeDays: yup
        .number()
        .required(t("form-field.days-required"))
        .max(1000, t("form-field.days-maximum", { numberOfDays: 1000 }))
        .positive(t("form-field.days-positive"))
        .typeError(t("form-field.days-required")),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();
  /*** CONTRACT WRITE SETUP ***/

  const { config } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "stake",
    args: [
      ethers.utils.parseUnits(
        (Number(watchAllFields?.startStakeAmount) || 0).toString(),
        xenBalance?.decimals ?? 0
      ),
      watchAllFields.startStakeDays ?? 0,
    ],
    enabled: !disabled,
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
      toast(t("toast.stake-successful"));
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

    if (!processing && address && userStake && userStake.term.toNumber() == 0) {
      setDisabled(false);
    }
  }, [
    address,
    processing,
    userStake,
    watchAllFields.startStakeDays,
    isValid,
    config,
  ]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">{t("stake.start")}</a>
          </Link>

          <Link href="/stake/2">
            <a className="step">{t("stake.staking")}</a>
          </Link>

          <Link href="/stake/3">
            <a className="step">{t("stake.end")}</a>
          </Link>
        </ul>

        <CardContainer>
          <form onSubmit={handleSubmit(handleStakeSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("stake.start")}</h2>
              <MaxValueField
                title={t("form-field.amount").toUpperCase()}
                description={t("form-field.amount-description")}
                value={ethers.utils.formatUnits(
                  xenBalance?.value ?? BigNumber.from(0),
                  xenBalance?.decimals ?? BigNumber.from(0)
                )}
                disabled={disabled}
                errorMessage={
                  <ErrorMessage errors={errors} name="startStakeAmount" />
                }
                register={register("startStakeAmount")}
                setValue={setValue}
              />

              <MaxValueField
                title={t("form-field.days").toUpperCase()}
                description={t("form-field.days-description")}
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
                  title={t("card.yield")}
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
                  title={t("card.maturity")}
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
                    <h3 className="font-bold">{t("stake.terms")}</h3>
                    <div className="text-xs">{t("stake.terms-details")}</div>
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
                  {t("stake.start")}
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Stake;
