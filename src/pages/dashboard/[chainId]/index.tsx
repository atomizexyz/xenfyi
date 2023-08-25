import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useContext, useEffect } from "react";

import Breadcrumbs from "~/components/Breadcrumbs";
import { chainIcons } from "~/components/Constants";
import CardContainer from "~/components/containers/CardContainer";
import Container from "~/components/containers/Container";
import { ChainStatCard, DataCard, DateStatCard, NumberStatCard } from "~/components/StatCards";
import XENContext from "~/contexts/XENContext";
import { allChains } from "~/lib/client";
import { xenContract } from "~/lib/xen-contract";

const Dashboard: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { chainId } = router.query as unknown as { chainId: number };
  const chainFromId = allChains.find((c) => c && c.id == chainId);

  const {
    setChainOverride,
    token,
    globalRank,
    activeMinters,
    activeStakes,
    totalXenStaked,
    totalSupply,
    currentMaxTerm,
    genesisTs,
    currentAMP,
    currentEAAR,
    currentAPY,
  } = useContext(XENContext);

  const generalStats = [
    {
      title: t("card.global-rank"),
      value: globalRank,
    },
    {
      title: t("card.active-mints"),
      value: activeMinters,
    },
    {
      title: t("card.active-stakes"),
      value: activeStakes,
    },
    {
      title: t("card.max-mint-term"),
      value: currentMaxTerm / 86400,
      suffix: " Days",
    },
  ];

  const stakeItems = [
    {
      title: t("card.total"),
      value: (totalSupply + totalXenStaked) / 1e18,
    },
    {
      title: t("card.liquid"),
      value: totalSupply / 1e18,
    },
    {
      title: t("card.staked"),
      value: totalXenStaked / 1e18,
    },
  ];

  const rewardsItems = [
    {
      title: t("dashboard.amp"),
      value: currentAMP,
      decimals: 0,
      tooltip: t("dashboard.amp-description"),
    },
    {
      title: t("dashboard.eaa"),
      value: currentEAAR / 10.0,
      decimals: 2,
      suffix: "%",
      tooltip: t("dashboard.eaa-description"),
    },
    {
      title: t("dashboard.apy"),
      value: currentAPY,
      decimals: 0,
      suffix: "%",
      tooltip: t("dashboard.apy-description"),
    },
  ];

  useEffect(() => {
    if (chainFromId) {
      setChainOverride(chainFromId);
    }
  }, [chainFromId, setChainOverride]);

  return (
    <div>
      <Container className="max-w-2xl">
        <Breadcrumbs />

        <div className="flex flex-col space-y-8">
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn m-1 glass text-neutral">
              {t("dashboard.select-chain")}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow rounded-box glass w-64 flex space-y-2">
              {allChains.map((c) => (
                <li key={c.id}>
                  <Link href={`/dashboard/${c.id}`} className="text-neutral justify-between glass">
                    {c.name}
                    {chainIcons[c.id]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.general-stats")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              <ChainStatCard value={chainFromId?.name ?? "Ethereum"} id={chainFromId?.id ?? 1} />
              <DateStatCard title={t("dashboard.days-since-launch")} dateTs={genesisTs} isPast={true} />
              {token && (
                <DataCard
                  title={t("dashboard.token-address")}
                  value={token?.symbol ?? "XEN"}
                  description={xenContract(chainFromId).address}
                />
              )}

              {generalStats.map((item, index) => (
                <NumberStatCard key={index} title={item.title} value={item.value} decimals={0} suffix={item.suffix} />
              ))}
            </div>
          </CardContainer>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.supply")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              {stakeItems.map((item, index) => (
                <NumberStatCard key={index} title={item.title} value={item.value} />
              ))}
            </div>
          </CardContainer>

          <CardContainer>
            <h2 className="card-title">{t("dashboard.rewards")}</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              {rewardsItems.map((item, index) => (
                <NumberStatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  decimals={item.decimals}
                  suffix={item.suffix}
                  tooltip={item.tooltip}
                />
              ))}
            </div>
          </CardContainer>
        </div>
      </Container>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths = async ({ locales }: any) => {
  // generate locales paths for all chains and all locales
  const allPaths = allChains.flatMap((chain) =>
    locales.map((locale: string) => ({
      params: { chainId: chain.id.toString() },
      locale,
    }))
  );

  return {
    paths: allPaths,
    fallback: false,
  };
};

export default Dashboard;
