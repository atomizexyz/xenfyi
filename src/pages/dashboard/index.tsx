import type { NextPage } from "next";
import Container from "~/components/Container";
import { useContractReads, useNetwork, Chain } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { pulseChain } from "~/lib/pulsechain";
import {
  NumberStatCard,
  ChainStatCard,
  DateStatCard,
} from "~/components/StatCards";

interface DashboardData {
  globalRank: Number;
  activeMinters: Number;
  activeStakes: Number;
  totalXenStaked: Number;
  totalXenLiquid: Number;
  genesisTs: Number;
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
      {
        ...xenContract,
        functionName: "genesisTs",
      },
    ],

    onSuccess(data) {
      setDashboardData({
        globalRank: Number(data[0]),
        activeMinters: Number(data[1]),
        activeStakes: Number(data[2]),
        totalXenStaked: Number(data[3]),
        totalXenLiquid: Number(data[4]),
        genesisTs: Number(data[5]),
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
      title: "Total",
      value:
        (Number(dashboardData?.totalXenLiquid) +
          Number(dashboardData?.totalXenStaked)) /
        1e18,
    },
    {
      title: "Liquid",
      value: Number(dashboardData?.totalXenLiquid) / 1e18,
    },
    {
      title: "Stake",
      value: Number(dashboardData?.totalXenStaked) / 1e18,
    },
  ];

  return (
    <div>
      <main>
        <Container>
          <div className="flex flex-col space-y-8">
            <div className="card glass text-neutral">
              <div className="card-body text-neutral">
                <h2 className="card-title">General Stats</h2>
                <div className="stats stats-vertical bg-transparent text-neutral">
                  <ChainStatCard
                    value={currentChain.name}
                    id={currentChain.id}
                  />
                  <DateStatCard
                    title="Days Since Launch"
                    dateTs={Number(dashboardData?.genesisTs) * 1000 ?? 0}
                    isPast={true}
                  />
                  {generalStats.map((item, index) => (
                    <NumberStatCard
                      key={index}
                      title={item.title}
                      value={item.value}
                      decimals={0}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="card glass">
              <div className="card-body text-neutral">
                <h2 className="card-title">Supply</h2>
                <div className="stats stats-vertical bg-transparent text-neutral">
                  {stakeItems.map((item, index) => (
                    <NumberStatCard
                      key={index}
                      title={item.title}
                      value={item.value}
                    />
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
