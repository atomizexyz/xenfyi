import "react-day-picker/dist/style.css";

import { InformationCircleIcon } from "@heroicons/react/outline";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { clsx } from "clsx";
import { addDays, differenceInDays } from "date-fns";
import { BigNumber, ethers } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCallback,useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite,useWaitForTransaction } from "wagmi";
import * as yup from "yup";

import XENCryptoABI from "~/abi/XENCryptoABI";
import Breadcrumbs from "~/components/Breadcrumbs";
import CardContainer from "~/components/containers/CardContainer";
import Container from "~/components/containers/Container";
import { MaxValueField } from "~/components/FormFields";
import GasEstimate from "~/components/GasEstimate";
import { DateStatCard, NumberStatCard } from "~/components/StatCards";
import XENContext from "~/contexts/XENContext";
import { stakeYield,UTC_TIME } from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";

const Stake = () => {
  const { t } = useTranslation("common");
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [month, setMonth] = useState<Date>(today);
  const [isLockMonth, setIsLockMonth] = useState<boolean>(true);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [maturity, setMaturity] = useState<number>(UTC_TIME);

  const { xenBalance, userStake, genesisTs, currentAPY, feeData } = useContext(XENContext);

  /*** FORM SETUP ***/

  const schema = yup
    .object()
    .shape({
      startStakeAmount: yup
        .number()
        .required(t("form-field.amount-required"))
        .max(
          Number(ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))),
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
  const { startStakeAmount, startStakeDays } = watch();
  /*** CONTRACT WRITE SETUP ***/

  const { config } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "stake",
    args: [
      ethers.utils.parseUnits((Number(startStakeAmount) || 0).toString(), xenBalance?.decimals ?? 0),
      startStakeDays ?? 0,
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

  const selectedFromDay = useCallback(() => {
    return addDays(new Date(), startStakeDays ?? 0);
  }, [startStakeDays]);

  const selectedToDay = (date: any) => {
    setValue("startMintDays", differenceInDays(date, today) + 1);
  };

  useEffect(() => {
    if (startStakeDays) {
      setMaturity(UTC_TIME + (startStakeDays ?? 0) * 86400);
    }

    if (!processing && address && userStake && userStake.term.toNumber() == 0) {
      setDisabled(false);
    }
  }, [address, processing, userStake, startStakeDays, isValid, config]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1" className="step step-neutral">
            {t("stake.start")}
          </Link>

          <Link href="/stake/2" className="step">
            {t("stake.staking")}
          </Link>

          <Link href="/stake/3" className="step">
            {t("stake.end")}
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
                errorMessage={<ErrorMessage errors={errors} name="startStakeAmount" />}
                register={register("startStakeAmount")}
                setValue={setValue}
              />

              <MaxValueField
                title={t("form-field.days").toUpperCase()}
                description={t("form-field.days-description")}
                decimals={0}
                value={1000}
                disabled={disabled}
                errorMessage={<ErrorMessage errors={errors} name="startStakeDays" />}
                register={register("startStakeDays")}
                setValue={setValue}
              />

              {/* <div className="stats stats-vertical glass w-full text-neutral">
                <div className="flex justify-center">
                  <DayPicker
                    locale={dayPickerLocale(router.locale ?? "en")}
                    mode="single"
                    modifiersClassNames={{
                      selected: "day-selected",
                      outside: "day-outside",
                    }}
                    disabled={[{ before: tomorrow, after: maxStakeLengthDay }]}
                    selected={selectedFromDay()}
                    onSelect={selectedToDay}
                    month={month}
                    onMonthChange={setMonth}
                    footer={footer}
                    fromYear={currentYear()}
                    toYear={maxEndYear(currentMaxTerm)}
                    captionLayout="dropdown"
                    fixedWeeks
                  />
                </div>
              </div> */}

              <div className="flex stats glass w-full text-neutral">
                <NumberStatCard
                  title={t("card.yield")}
                  value={stakeYield({
                    xenBalance: startStakeAmount,
                    genesisTs: genesisTs,
                    term: startStakeDays,
                    apy: currentAPY,
                  })}
                  decimals={0}
                  description={`${Number(currentAPY ?? 0).toFixed(2)}%`}
                />
                <DateStatCard title={t("card.maturity")} dateTs={maturity} isPast={false} />
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
              <GasEstimate feeData={feeData} gasLimit={config?.request?.gasLimit} />
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
