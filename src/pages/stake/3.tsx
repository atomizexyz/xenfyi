import Link from "next/link";
import Container from "~/components/containers/Container";
import {
  useNetwork,
  useAccount,
  useContractWrite,
  useWaitForTransaction,
  usePrepareContractWrite,
} from "wagmi";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { xenContract } from "~/lib/xen-contract";
import { calculateStakeReward, UTC_TIME } from "~/lib/helpers";
import { useState, useEffect, useContext } from "react";
import { CountDataCard } from "~/components/StatCards";
import { InformationCircleIcon } from "@heroicons/react/outline";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import GasEstimate from "~/components/GasEstimate";
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
  const [earlyEndStake, setEarlyEndStake] = useState(false);

  const { handleSubmit } = useForm();

  const { userStake, feeData } = useContext(XENContext);

  const { config } = usePrepareContractWrite({
    addressOrName: xenContract(chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "withdraw",
    enabled: (userStake && !userStake.term.isZero()) ?? false,
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
      toast(t("toast.end-stake-successful"));
      router.push("/stake/1");
    },
  });
  const handleStakeSubmit = () => {
    writeStake?.();
  };

  useEffect(() => {
    if (
      !processing &&
      address &&
      userStake &&
      !userStake.maturityTs?.isZero()
    ) {
      setDisabled(false);
      if (UTC_TIME < userStake.maturityTs.toNumber() ?? 0) {
        setEarlyEndStake(true);
      }
    }
  }, [address, userStake, router, processing]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1">
            <a className="step step-neutral">{t("stake.start")}</a>
          </Link>

          <Link href="/stake/2">
            <a className="step step-neutral">{t("stake.staking")}</a>
          </Link>

          <Link href="/stake/3">
            <a className="step step-neutral">{t("stake.end")}</a>
          </Link>
        </ul>
        <CardContainer>
          <form onSubmit={handleSubmit(handleStakeSubmit)}>
            <div className="flex flex-col space-y-4">
              <h2 className="card-title text-neutral">{t("stake.end")}</h2>

              <div className="stats glass w-full text-neutral">
                <CountDataCard
                  title={t("card.reward")}
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
                      <h3 className="font-bold">{t("stake.note")}</h3>
                      <div className="text-xs">
                        {t("stake.note-description")}
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
                  {earlyEndStake ? t("stake.end-early") : t("stake.end")}
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
