import type { NextPage } from "next";
import Container from "~/components/Container";
import { useContractReads, useNetwork, chain } from "wagmi";
import { useState } from "react";
import {
  NumberStatCard,
  ChainStatCard,
  DateStatCard,
} from "~/components/StatCards";
import CardContainer from "~/components/CardContainer";
import { xenContract } from "~/lib/xen-contract";

interface DashboardData {
  globalRank: number;
  activeMinters: number;
  activeStakes: number;
  totalXenStaked: number;
  totalXenLiquid: number;
  genesisTs: number;
  maxMintDays: number;
  ampRewards: number;
  eaaRewards: number;
  apyRewards: number;
}

const Dashboard: NextPage = () => {
  const { chain: networkChain } = useNetwork();
  const [dashboardData, setDashboardData] = useState<DashboardData>();

  const {} = useContractReads({
    contracts: [
      {
        ...xenContract(networkChain),
        functionName: "globalRank",
      },
      {
        ...xenContract(networkChain),
        functionName: "activeMinters",
      },
      {
        ...xenContract(networkChain),
        functionName: "activeStakes",
      },
      {
        ...xenContract(networkChain),
        functionName: "totalXenStaked",
      },
      {
        ...xenContract(networkChain),
        functionName: "totalSupply",
      },
      {
        ...xenContract(networkChain),
        functionName: "genesisTs",
      },
      {
        ...xenContract(networkChain),
        functionName: "getCurrentMaxTerm",
      },

      {
        ...xenContract(networkChain),
        functionName: "getCurrentAMP",
      },
      {
        ...xenContract(networkChain),
        functionName: "getCurrentEAAR",
      },
      {
        ...xenContract(networkChain),
        functionName: "getCurrentAPY",
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
        maxMintDays: Number(data[6]),
        ampRewards: Number(data[7]),
        eaaRewards: Number(data[8]),
        apyRewards: Number(data[9]),
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
    {
      title: "Max Mint Term",
      value: Number(dashboardData?.maxMintDays) / 86400,
      suffix: " Days",
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

  const rewardsItems = [
    {
      title: "AMP",
      value: Number(dashboardData?.ampRewards),
      decimals: 0,
      tooltip:
        "Reward Amplifier (AMP) is a time-dependent part of XEN Mint Reward calculation. It starts at 3,000 at Genesis and decreases by 1 every day until it reaches 1",
    },
    {
      title: "EAA",
      value: Number((dashboardData?.eaaRewards ?? 0) / 10.0),
      decimals: 2,
      suffix: "%",
      tooltip:
        "Early Adopter Amplifier (EAA) is a part of XEN Mint Reward calculation which depends on current Global Rank. EAA starts from 10% and decreases in a linear fashion by 0.1% per each 100,000 increase in Global Rank.",
    },
    {
      title: "APY",
      value: Number(dashboardData?.apyRewards),
      decimals: 0,
      suffix: "%",
      tooltip:
        "Annual Percentage Yield (APY) determines XEN Staking Reward calculation. It is non-compounding and is pro-rated by days. APY starts at 20% on Genesis and decreases by 1p.p. every 90 days until it reaches 2%",
    },
  ];

  return (
    <div>
      <Container className="max-w-2xl">
        <div className="flex flex-col space-y-8">
          <CardContainer>
            <h2 className="card-title">General Stats</h2>
            <div className="stats stats-vertical bg-transparent text-neutral">
              <ChainStatCard
                value={networkChain?.name ?? chain.mainnet.name}
                id={networkChain?.id ?? chain.mainnet.id}
              />
              <DateStatCard
                title="Days Since Launch"
                dateTs={Number(dashboardData?.genesisTs ?? 0)}
                isPast={true}
              />
              {generalStats.map((item, index) => (
                <NumberStatCard
                  key={index}
                  title={item.title}
                  value={item.value}
                  decimals={0}
                  suffix={item.suffix}
                />
              ))}
            </div>
          </CardContainer>

          <CardContainer>
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
          </CardContainer>

          <CardContainer>
            <h2 className="card-title">Rewards</h2>
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

export default Dashboard;
