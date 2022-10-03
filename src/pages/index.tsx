import type { NextPage } from "next";
import Head from "next/head";
import Container from "~/components/Container";
import { useContractReads, useNetwork, Chain } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { clsx } from "clsx";
import { useTheme } from "next-themes";
import { pulseChain } from "~/lib/pulsechain";

interface DashboardData {
  globalRank: Number;
  activeMinters: Number;
  activeStakes: Number;
  totalXenStaked: Number;
  totalXenLiquid: Number;
}

const Home: NextPage = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { chain } = useNetwork();

  const [currentChain, setCurrentChain] = useState<Chain>(chain ?? pulseChain);
  const [dashboardData, setDashboardData] = useState<DashboardData>();

  const xenContract = {
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    chainId: currentChain.id,
  };

  const {} = useContractReads({
    contracts: [
      {
        ...xenContract,
        functionName: "globalRank",
      },
      {
        ...xenContract,
        functionName: "activeMinters",
      },
      {
        ...xenContract,
        functionName: "activeStakes",
      },
      {
        ...xenContract,
        functionName: "totalXenStaked",
      },
      {
        ...xenContract,
        functionName: "totalSupply",
      },
    ],

    onSuccess(data) {
      setDashboardData({
        globalRank: Number(data[0]),
        activeMinters: Number(data[1]),
        activeStakes: Number(data[2]),
        totalXenStaked: Number(data[3]),
        totalXenLiquid: Number(data[4]),
      });
    },
    watch: true,
  });

  useEffect(() => {
    setCurrentChain(chain ?? pulseChain);
  }, [chain]);

  const generalStats = [
    {
      title: "Global Rank",
      value: Number(dashboardData?.globalRank),
    },
    {
      title: "Active Minters",
      value: Number(dashboardData?.activeMinters),
    },
    {
      title: "Active Stakes",
      value: Number(dashboardData?.activeStakes),
    },
  ];

  const stakeItems = [
    {
      title: "Liquid",
      value: Number(dashboardData?.totalXenLiquid) / 1e18,
    },
    {
      title: "Stake",
      value: Number(dashboardData?.totalXenStaked) / 1e18,
    },
    {
      title: "Total",
      value:
        (Number(dashboardData?.totalXenLiquid) +
          Number(dashboardData?.totalXenStaked)) /
        1e18,
    },
  ];

  return (
    <div>
      <Head>
        <title>XEN.fyi</title>
        <meta name="description" content="XEN token" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <div className="flex flex-col space-y-8">
            <div className="card glass text-neutral">
              <div
                className={clsx("card-body", {
                  "text-neutral": !isDark,
                  "text-primary-content": isDark,
                })}
              >
                <h2 className="card-title">General Stats</h2>
                <div
                  className={clsx("stats stats-vertical bg-transparent", {
                    "text-neutral": !isDark,
                    "text-primary-content": isDark,
                  })}
                >
                  <div className="stat">
                    <div className="stat-title">Chain</div>
                    <code className="stat-value text-3xl text-right">
                      {currentChain.name}
                    </code>
                    <div className="stat-desc text-right">
                      {`Chain ID: ${currentChain.id}`}
                    </div>
                  </div>
                  {generalStats.map((item, index) => (
                    <div className="stat" key={index}>
                      <div className="stat-title">{item.title}</div>
                      <code className="stat-value text-3xl text-right">
                        <CountUp
                          end={item.value}
                          preserveValue={true}
                          separator=","
                        />
                      </code>
                      <div className="stat-desc text-right"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card glass">
              <div
                className={clsx("card-body", {
                  "text-neutral": !isDark,
                  "text-primary-content": isDark,
                })}
              >
                <h2 className="card-title">Supply</h2>
                <div
                  className={clsx("stats stats-vertical bg-transparent", {
                    "text-neutral": !isDark,
                    "text-primary-content": isDark,
                  })}
                >
                  {stakeItems.map((item, index) => (
                    <div className="stat " key={index}>
                      <div className="stat-title">{item.title}</div>
                      <code className="stat-value text-3xl text-right">
                        <CountUp
                          end={item.value}
                          preserveValue={true}
                          separator=","
                          decimals={2}
                        />
                      </code>
                      <div className="stat-desc text-right"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default Home;
