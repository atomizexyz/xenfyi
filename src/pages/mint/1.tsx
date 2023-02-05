import "react-day-picker/dist/style.css";

import { InformationCircleIcon } from "@heroicons/react/outline";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { clsx } from "clsx";
import { addDays, differenceInDays,isSameMonth } from "date-fns";
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
import { UTC_TIME } from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";

const Mint = () => {
  const { t } = useTranslation("common");
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [month, setMonth] = useState<Date>(today);
  const [isLockMonth, setIsLockMonth] = useState<boolean>(true);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();
  const [disabled, setDisabled] = useState(true);
  const [maxFreeMint, setMaxFreeMint] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [maturity, setMaturity] = useState<number>(UTC_TIME);

  const { userMint, currentMaxTerm, globalRank, feeData } = useContext(XENContext);
  const maxStakeLengthDay = addDays(today, currentMaxTerm);

  /*** FORM SETUP ***/

  const numberOfDays = 100;

  const schema = yup
    .object()
    .shape({
      startMintDays: yup
        .number()
        .required(t("form-field.days-required"))
        .max(maxFreeMint, t("form-field.days-maximum", { numberOfDays: maxFreeMint }))
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
  const { startMintDays } = watch();

  /*** CONTRACT WRITE SETUP ***/

  const { config, error } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "claimRank",
    args: [startMintDays ?? 0],
    enabled: !disabled,
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
      toast(t("toast.claim-successful"));
      router.push("/mint/2");
    },
  });
  const onSubmit = () => {
    write?.();
  };

  /*** USE EFFECT ****/

  const footer = (
    <div className="grid grid-flow-col gap-8 items-center">
      <button
        disabled={isSameMonth(today, month)}
        onClick={() => setMonth(addDays(today, 1))}
        className="btn btn-xs glass text-neutral ml-2"
      >
        {t("form-field.go-to-today")}
      </button>
      <label className="label cursor-pointer">
        <span className="label-text text-neutral">{t("form-field.lock-month")}</span>
        <input
          onChange={(event) => setIsLockMonth(event.currentTarget.checked)}
          type="checkbox"
          className="checkbox ml-2"
          checked={isLockMonth}
        />
      </label>
    </div>
  );

  const selectedFromDay = useCallback(() => {
    return addDays(new Date(), startMintDays ?? 0);
  }, [startMintDays]);

  const selectedToDay = (date: any) => {
    setValue("startMintDays", differenceInDays(date, today) + 1);
  };

  useEffect(() => {
    if (startMintDays) {
      setMaturity(UTC_TIME + startMintDays * 86400);
    }

    if (!processing && address && userMint && userMint.term.isZero()) {
      setDisabled(false);
    }

    setMaxFreeMint(Number(currentMaxTerm ?? 8640000) / 86400);

    // if (isLockMonth && !isSameMonth(selectedFromDay(), month)) {
    //   setMonth(selectedFromDay());
    // }
  }, [
    address,
    config,
    currentMaxTerm,
    isValid,
    processing,
    userMint,
    startMintDays,
    isLockMonth,
    selectedFromDay,
    month,
  ]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />
      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1" className="step step-neutral">
            {t("mint.start")}
          </Link>

          <Link href="/mint/2" className="step">
            {t("mint.minting")}
          </Link>

          <Link href="/mint/3" className="step">
            {t("mint.title")}
          </Link>
        </ul>

        <CardContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("mint.claim-rank")}</h2>
              <MaxValueField
                title={t("form-field.days").toUpperCase()}
                description={t("form-field.days-description")}
                decimals={0}
                value={maxFreeMint}
                disabled={disabled}
                errorMessage={<ErrorMessage errors={errors} name="startMintDays" />}
                register={register("startMintDays")}
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
                <NumberStatCard title={t("card.claim-rank")} value={globalRank} decimals={0} />
                <DateStatCard title={t("card.maturity")} dateTs={maturity} isPast={false} />
              </div>

              <div className="alert shadow-lg glass">
                <div>
                  <div>
                    <InformationCircleIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t("mint.terms")}</h3>
                    <div className="text-xs">{t("mint.terms-details", { numberOfDays: maxFreeMint })}</div>
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
                  {t("mint.start")}
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

export default Mint;
