import type { NextPage } from "next";
import Head from "next/head";
import Container from "~/components/Container";
import { useContractReads } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useState } from "react";
import { pulseChain } from "~/lib/pulsechain";

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
  const BURN_ADDRESS = "0x0000000000000000000000000000000000000000";

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

  const totalSupply = () => {
    return formatNumber(
      (Number(dashboardData?.totalXenLiquid) +
        Number(dashboardData?.totalXenStaked)) /
        1e18
    );
  };

  const totalStaked = () => {
    return formatNumber(Number(dashboardData?.totalXenStaked) / 1e18);
  };

  const totalLiquid = () => {
    return formatNumber(Number(dashboardData?.totalXenLiquid) / 1e18);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {}).format(num);
  };

  const generalStats = [
    {
      title: "Global Rank",
      value: formatNumber(Number(dashboardData?.globalRank)),
    },
    {
      title: "Active Minters",
      value: formatNumber(Number(dashboardData?.activeMinters)),
    },
    {
      title: "Active Stakes",
      value: formatNumber(Number(dashboardData?.activeStakes)),
    },
  ];

  const stakeItems = [
    {
      title: "Liquid",
      value: totalLiquid(),
    },
    {
      title: "Stake",
      value: totalStaked(),
    },
    {
      title: "Total Supply",
      value: totalSupply(),
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
              <div className="card-body">
                <h2 className="card-title">General Stats</h2>
                <div className="stats stats-vertical bg-transparent text-neutral">
                  {generalStats.map((item, index) => (
                    <div className="stat" key={index}>
                      <div className="stat-title">{item.title}</div>
                      <div className="stat-value">{item.value}</div>
                      {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card glass">
              <div className="card-body">
                <h2 className="card-title">Supply</h2>
                <div className="stats stats-vertical bg-transparent text-neutral">
                  {stakeItems.map((item, index) => (
                    <div className="stat" key={index}>
                      <div className="stat-title">{item.title}</div>
                      <div className="stat-value">{item.value}</div>
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
