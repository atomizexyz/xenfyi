import type { NextPage } from "next";
import Head from "next/head";
import Container from "~/components/Container";
import { useContractReads } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useState } from "react";
import { pulseChain } from "~/lib/pulsechain";
import CountUp from "react-countup";
import { clsx } from "clsx";
import { useTheme } from "next-themes";

const xenContract = {
  addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
  contractInterface: XenCrypto.abi,
};

interface DashboardData {
  globalRank: Number;
  activeMinters: Number;
  activeStakes: Number;
  totalXenStaked: Number;
  totalXenLiquid: Number;
}

const Home: NextPage = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const BURN_ADDRESS = "";

  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const { data } = useContractReads({
    contracts: [
      {
        ...xenContract,
        functionName: "globalRank",
        chainId: pulseChain.id,
      },
      {
        ...xenContract,
        functionName: "activeMinters",
        chainId: pulseChain.id,
      },
      {
        ...xenContract,
        functionName: "activeStakes",
        chainId: pulseChain.id,
      },
      {
        ...xenContract,
        functionName: "totalXenStaked",
        chainId: pulseChain.id,
      },
      {
        ...xenContract,
        functionName: "totalSupply",
        chainId: pulseChain.id,
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
                  {generalStats.map((item, index) => (
                    <div className="stat" key={index}>
                      <div className="stat-title">{item.title}</div>
                      <code className="stat-value text-right">
                        <CountUp
                          end={item.value}
                          preserveValue={true}
                          separator=","
                        />
                      </code>
                      <div className="stat-desc"></div>
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
                      <code className="stat-value text-right">
                        <CountUp
                          end={item.value}
                          preserveValue={true}
                          separator=","
                          decimals={2}
                        />
                      </code>
                      {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
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
