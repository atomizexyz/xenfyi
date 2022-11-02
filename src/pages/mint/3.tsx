import {
  useNetwork,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import Link from "next/link";
import Container from "~/components/containers/Container";
import GasEstimate from "~/components/GasEstimate";
import { MaxValueField, WalletAddressField } from "~/components/FormFields";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { CountDataCard } from "~/components/StatCards";
import {
  calculateMintReward,
  mintPenalty,
  UTC_TIME,
  WALLET_ADDRESS_REGEX,
} from "~/lib/helpers";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import * as yup from "yup";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import XENCryptoABI from "~/abi/XENCryptoABI";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const Mint = () => {
  const { t } = useTranslation("common");

  const { address } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();

  const [disabled, setDisabled] = useState(true);
  const [activeStakeDisabled, setActiveStakeDisabled] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [penaltyPercent, setPenaltyPercent] = useState(0);
  const [penaltyXEN, setPenaltyXEN] = useState(0);
  const [reward, setReward] = useState(0);
  const { userMint, userStake, grossReward, feeData } = useContext(XENContext);

  /*** FORM SETUP ***/

  // Claim
  const { handleSubmit: cHandleSubmit } = useForm();

  const { config: configClaim } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "claimMintReward",
    enabled: !disabled,
  });
  const { data: claimData, write: writeClaim } = useContractWrite({
    ...configClaim,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const handleClaimSubmit = () => {
    writeClaim?.();
  };
  const {} = useWaitForTransaction({
    hash: claimData?.hash,
    onSuccess(data) {
      toast(t("toast.claim-successful"));

      router.push("/stake/1");
    },
  });

  // Claim + Share

  const schemaClaimShare = yup
    .object()
    .shape({
      claimShareAddress: yup
        .string()
        .required(t("form-field.wallet-address-required"))
        .matches(WALLET_ADDRESS_REGEX, {
          message: t("form-field.wallet-address-invalid"),
          excludeEmptyString: true,
        }),
      claimSharePercentage: yup
        .number()
        .required(t("form-field.percentage-required"))
        .positive(t("form-field.percentage-positive"))
        .max(100, t("form-field.percentage-maximum"))
        .typeError(t("form-field.percentage-required")),
    })
    .required();

  const {
    register: cShareRegister,
    handleSubmit: cShareHandleSubmit,
    watch: cShareWatch,
    formState: { errors: cShareErrors, isValid: cShareIsValid },
    setValue: cShareSetValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaClaimShare),
  });
  const cShareWatchAllFields = cShareWatch();

  const { config: configClaimShare } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "claimMintRewardAndShare",
    args: [
      cShareWatchAllFields.claimShareAddress,
      cShareWatchAllFields.claimSharePercentage,
    ],
    enabled: !disabled,
  });

  const { data: claimShareData, write: writeClaimShare } = useContractWrite({
    ...configClaimShare,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });
  const handleClaimShareSubmit = () => {
    writeClaimShare?.();
  };
  const {} = useWaitForTransaction({
    hash: claimShareData?.hash,
    onSuccess(data) {
      toast(t("toast.claim-and-share-successful"));
      router.push("/stake/1");
    },
  });

  // Claim + Stake

  const schemaClaimStake = yup
    .object()
    .shape({
      claimStakePercentage: yup
        .number()
        .required(t("form-field.percentage-required"))
        .positive(t("form-field.percentage-positive"))
        .max(100, t("form-field.percentage-maximum"))
        .typeError(t("form-field.percentage-required")),
      claimStakeDays: yup
        .number()
        .required(t("form-field.days-required"))
        .max(1000, t("form-field.days-maximum", { numberOfDays: 1000 }))
        .positive(t("form-field.days-positive"))
        .typeError(t("form-field.days-required")),
    })
    .required();

  const {
    register: cStakeRegister,
    handleSubmit: cStakeHandleSubmit,
    watch: cStakeWatch,
    formState: { errors: cStakeErrors, isValid: cStakeIsValid },
    setValue: cStakeSetValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaClaimStake),
  });
  const cStakeWatchAllFields = cStakeWatch();

  const { config: configClaimStake } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "claimMintRewardAndStake",
    args: [
      cStakeWatchAllFields.claimStakePercentage,
      cStakeWatchAllFields.claimStakeDays,
    ],
    enabled: !disabled,
  });

  const { data: claimStakeData, write: writeClaimStake } = useContractWrite({
    ...configClaimStake,
    onSuccess(data) {
      setProcessing(true);
      setDisabled(true);
    },
  });

  const handleClaimStakeSubmit = () => {
    writeClaimStake?.();
  };
  const {} = useWaitForTransaction({
    hash: claimStakeData?.hash,
    onSuccess(data) {
      toast(t("toast.claim-and-stake-successful"));
      router.push("/stake/2");
    },
  });

  /*** USE EFFECT ****/

  useEffect(() => {
    if (
      address &&
      userMint &&
      !userMint.maturityTs.isZero() &&
      userMint?.maturityTs.toNumber() < UTC_TIME
    ) {
      if (!processing) {
        setDisabled(false);
      }
    }

    if (userMint && !userMint.maturityTs.isZero()) {
      const penalty = mintPenalty(userMint.maturityTs.toNumber());
      const reward = calculateMintReward({
        maturityTs: userMint.maturityTs.toNumber(),
        grossReward: grossReward,
      });
      setPenaltyPercent(penalty);
      setReward(reward);
      setPenaltyXEN(reward * (penalty / 100));
    }

    if (address && userStake && userStake.term.toNumber() == 0) {
      setActiveStakeDisabled(false);
    }
  }, [
    activeStakeDisabled,
    address,
    processing,
    userMint,
    userStake,
    grossReward,
    cShareIsValid,
    cStakeIsValid,
    configClaimShare,
    configClaimStake,
  ]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/mint/1">
            <a className="step step-neutral">{t("mint.start")}</a>
          </Link>

          <Link href="/mint/2">
            <a className="step step-neutral">{t("mint.minting")}</a>
          </Link>

          <Link href="/mint/3">
            <a className="step step-neutral">{t("mint.title")}</a>
          </Link>
        </ul>

        <CardContainer>
          <div className="flex flex-col w-full border-opacity-50">
            <form onSubmit={cHandleSubmit(handleClaimSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">
                  {t("mint.claim-mint")}
                </h2>

                <div className="flex stats glass w-full text-neutral">
                  <CountDataCard
                    title={t("card.reward")}
                    value={reward}
                    description="XEN"
                  />
                  <CountDataCard
                    title={t("card.penalty")}
                    value={penaltyPercent}
                    suffix="%"
                    descriptionNumber={penaltyXEN}
                    descriptionNumberSuffix=" XEN"
                  />
                </div>

                <div className="form-control w-full">
                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled}
                  >
                    {t("mint.claim-mint")}
                  </button>
                </div>

                <GasEstimate
                  feeData={feeData}
                  gasLimit={configClaim?.request?.gasLimit}
                />
              </div>
            </form>
          </div>
        </CardContainer>

        {/* OR */}
        <div className="divider">{t("or").toUpperCase()}</div>
        {/* OR */}
        <CardContainer>
          <div className="flex flex-col w-full border-opacity-50">
            <form onSubmit={cShareHandleSubmit(handleClaimShareSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">
                  {t("mint.claim-mint-share")}
                </h2>

                <div className="flex stats glass w-full text-neutral">
                  <CountDataCard
                    title={t("card.reward")}
                    value={reward}
                    description="XEN"
                  />
                  <CountDataCard
                    title={t("card.penalty")}
                    value={penaltyPercent}
                    suffix="%"
                    descriptionNumber={penaltyXEN}
                    descriptionNumberSuffix=" XEN"
                  />
                </div>

                <MaxValueField
                  title={t("form-field.percentage").toUpperCase()}
                  description={t("form-field.percentage-description")}
                  decimals={0}
                  value={100}
                  disabled={disabled}
                  errorMessage={
                    <ErrorMessage
                      errors={cShareErrors}
                      name="claimSharePercentage"
                    />
                  }
                  register={cShareRegister("claimSharePercentage")}
                  setValue={cShareSetValue}
                />

                <WalletAddressField
                  disabled={disabled}
                  errorMessage={
                    <ErrorMessage
                      errors={cShareErrors}
                      name="claimShareAddress"
                    />
                  }
                  register={cShareRegister("claimShareAddress")}
                />

                <div className="form-control w-full">
                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled}
                  >
                    {t("mint.claim-mint-share")}
                  </button>
                </div>

                <GasEstimate
                  feeData={feeData}
                  gasLimit={configClaimShare?.request?.gasLimit}
                />
              </div>
            </form>
          </div>
        </CardContainer>

        {/* OR */}
        <div className="divider">{t("or").toUpperCase()}</div>
        {/* OR */}
        <CardContainer>
          <div className="flex flex-col w-full border-opacity-50">
            <form onSubmit={cStakeHandleSubmit(handleClaimStakeSubmit)}>
              <div className="flex flex-col space-y-4">
                <h2 className="card-title text-neutral">
                  {t("mint.claim-mint-stake")}
                </h2>

                <div className="flex stats glass w-full text-neutral">
                  <CountDataCard
                    title={t("card.reward")}
                    value={reward}
                    description="XEN"
                  />
                  <CountDataCard
                    title={t("card.penalty")}
                    value={penaltyPercent}
                    suffix="%"
                    descriptionNumber={penaltyXEN}
                    descriptionNumberSuffix=" XEN"
                  />
                </div>

                <MaxValueField
                  title={t("form-field.percentage").toUpperCase()}
                  description={t("form-field.percentage-description")}
                  decimals={0}
                  value={100}
                  disabled={disabled || activeStakeDisabled}
                  errorMessage={
                    <ErrorMessage
                      errors={cStakeErrors}
                      name="claimStakePercentage"
                    />
                  }
                  register={cStakeRegister("claimStakePercentage")}
                  setValue={cStakeSetValue}
                />

                <MaxValueField
                  title={t("form-field.days").toUpperCase()}
                  description={t("form-field.days-description")}
                  decimals={0}
                  value={1000}
                  disabled={disabled || activeStakeDisabled}
                  errorMessage={
                    <ErrorMessage errors={cStakeErrors} name="claimStakeDays" />
                  }
                  register={cStakeRegister("claimStakeDays")}
                  setValue={cStakeSetValue}
                />

                <div className="form-control w-full">
                  <button
                    type="submit"
                    className={clsx("btn glass text-neutral", {
                      loading: processing,
                    })}
                    disabled={disabled || activeStakeDisabled}
                  >
                    {t("mint.claim-mint-stake")}
                  </button>
                </div>

                <GasEstimate
                  feeData={feeData}
                  gasLimit={configClaimStake?.request?.gasLimit}
                />
              </div>
            </form>
          </div>
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
