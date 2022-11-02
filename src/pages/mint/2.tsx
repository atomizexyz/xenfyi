import Container from "~/components/containers/Container";
import {
  NumberStatCard,
  ProgressStatCard,
  CountdownCard,
} from "~/components/StatCards";
import { progressDays, estimatedXEN } from "~/lib/helpers";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Countdown from "react-countdown";
import CardContainer from "~/components/containers/CardContainer";
import XENContext from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Breadcrumbs from "~/components/Breadcrumbs";

const Mint = () => {
  const { t } = useTranslation("common");

  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

  const { userMint, globalRank } = useContext(XENContext);

  const mintItems = [
    {
      title: t("card.estimated"),
      value: estimatedXEN(globalRank, userMint),
      suffix: " XEN",
      decimals: 0,
    },
    {
      title: t("card.amplifier"),
      value: userMint?.amplifier.toNumber() ?? 0,
      suffix: "",
      decimals: 0,
    },
    {
      title: t("card.eaa-rate"),
      value: userMint?.eaaRate.toNumber() ?? 0 / 10,
      suffix: "%",
      decimals: 2,
    },
    {
      title: t("card.claim-rank"),
      value: userMint?.rank.toNumber() ?? 0,
      suffix: "",
      decimals: 0,
    },
    {
      title: t("card.term"),
      value: userMint?.term.toNumber() ?? 0,
      suffix: ` ${t("card.days")}`,
      decimals: 0,
    },
  ];

  useEffect(() => {
    if (userMint) {
      if (userMint.maturityTs) {
        const progress = progressDays(
          userMint.maturityTs.toNumber() ?? 0,
          userMint.term.toNumber() ?? 0
        );

        setProgress(progress);
        setPercent((progress / userMint.term.toNumber()) * 100);
      }
    }
  }, [userMint?.maturityTs, userMint?.term, progress, userMint]);

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
            <a className="step">{t("mint.title")}</a>
          </Link>
        </ul>

        <div className="w-full"></div>

        <CardContainer>
          <h2 className="card-title">{t("mint.minting")}</h2>
          <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
            <Countdown
              date={(userMint?.maturityTs.toNumber() ?? 0) * 1000}
              renderer={(props) => (
                <CountdownCard
                  days={props.days}
                  hours={props.hours}
                  minutes={props.minutes}
                  seconds={props.seconds}
                />
              )}
            />
            <ProgressStatCard
              title={t("card.progress")}
              percentComplete={percent}
              value={progress}
              max={userMint?.term.toNumber() ?? 0}
              daysRemaining={userMint?.term.toNumber() ?? 0 - progress}
              dateTs={userMint?.maturityTs.toNumber() ?? 0}
            />
            {mintItems.map((item, index) => (
              <NumberStatCard
                key={index}
                title={item.title}
                value={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
              />
            ))}
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
