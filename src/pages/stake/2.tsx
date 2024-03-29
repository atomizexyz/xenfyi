import { BigNumber,ethers } from "ethers";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext,useEffect, useState } from "react";
import Countdown from "react-countdown";

import Breadcrumbs from "~/components/Breadcrumbs";
import CardContainer from "~/components/containers/CardContainer";
import Container from "~/components/containers/Container";
import {
  CountdownCard,
  NumberStatCard,
  ProgressStatCard,
} from "~/components/StatCards";
import XENContext from "~/contexts/XENContext";
import { progressDays } from "~/lib/helpers";

const Stake = () => {
  const { t } = useTranslation("common");

  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);

  const { xenBalance, userStake } = useContext(XENContext);

  const mintItems = [
    {
      title: t("card.liquid"),
      value: Number(
        ethers.utils.formatUnits(xenBalance?.value ?? BigNumber.from(0))
      ),
      suffix: " XEN",
    },
    {
      title: t("card.staked"),
      value: Number(
        ethers.utils.formatUnits(userStake?.amount ?? BigNumber.from(0))
      ),
      suffix: " XEN",
      tokenDecimals: 2,
    },
    {
      title: t("card.annual-percentage-yield"),
      value: userStake?.apy.toNumber() ?? 0,
      suffix: "%",
    },
    {
      title: t("card.term"),
      value: userStake?.term.toNumber() ?? 0,
      suffix: ` ${t("card.days")}`,
      decimals: 0,
    },
  ];

  useEffect(() => {
    if (userStake) {
      const progress = progressDays(
        userStake.maturityTs.toNumber(),
        userStake.term.toNumber()
      );

      setProgress(progress);
      setPercent((progress / userStake.term.toNumber()) * 100);
    }
  }, [progress, userStake, userStake?.maturityTs, userStake?.term]);

  return (
    <Container className="max-w-2xl">
      <Breadcrumbs />

      <div className="flew flex-row space-y-8 ">
        <ul className="steps w-full">
          <Link href="/stake/1" className="step step-neutral">
            {t("stake.start")}
          </Link>

          <Link href="/stake/2" className="step step-neutral">
            {t("stake.staking")}
          </Link>

          <Link href="/stake/3" className="step">
            {t("stake.end")}
          </Link>
        </ul>
        <CardContainer>
          <h2 className="card-title">{t("stake.staking")}</h2>
          <div className="stats stats-vertical bg-transparent text-neutral space-y-4">
            <Countdown
              date={(userStake?.maturityTs.toNumber() ?? 0) * 1000}
              intervalDelay={0}
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
              max={userStake?.term.toNumber() ?? 0}
              daysRemaining={userStake?.term.toNumber() ?? 0 - progress}
              dateTs={userStake?.maturityTs.toNumber() ?? 0}
            />
            {mintItems.map((item, index) => (
              <NumberStatCard
                key={index}
                title={item.title}
                value={item.value}
                suffix={item.suffix}
                decimals={item.decimals}
                tokenDecimals={item.tokenDecimals}
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

export default Stake;
