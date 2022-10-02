import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import Head from "next/head";
import XenCrypto from "../abi/XENCrypto.json";
import { useContractRead } from "wagmi";
import Navbar from "~/components/Navbar";

const Home: NextPage = () => {
  const { address } = useAccount();

  const { data: userMintData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserMint",
    overrides: { from: address },
  });

  const { data: userStakeData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "getUserStake",
    overrides: { from: address },
  });

  const { data: globalRankData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "globalRank",
    overrides: { from: address },
  });

  const { data: activeMintersData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "activeMinters",
    overrides: { from: address },
  });

  const { data: activeStakesData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "activeStakes",
    overrides: { from: address },
  });

  const { data: totalXenStakedData } = useContractRead({
    addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
    contractInterface: XenCrypto.abi,
    functionName: "totalXenStaked",
    overrides: { from: address },
  });

  return (
    <div>
      <Head>
        <title>XEN.fyi</title>
        <meta name="description" content="XEN token" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <h1>XEN</h1>
        <h2>Stats</h2>
        <ul>
          <li>Global Rank: {globalRankData && globalRankData.toString()}</li>
          <li>
            Active Minters: {activeMintersData && activeMintersData.toString()}
          </li>
          <li>
            Active Stakes: {activeStakesData && activeStakesData.toString()}
          </li>
          <li>
            Total XEN Staked:{" "}
            {totalXenStakedData && Number(totalXenStakedData) / 1e18}
          </li>
        </ul>
        <h2>Mint</h2>
        <ul>
          {userMintData && (
            <>
              <li>amplifier {userMintData.amplifier.toString()}</li>
              <li>eaaRate {userMintData.eaaRate.toString()}</li>
              <li>maturityTs {userMintData.maturityTs.toString()}</li>
              <li>rank {userMintData.rank.toString()}</li>
              <li>term {userMintData.term.toString()}</li>
            </>
          )}
        </ul>
        <h2>Stake</h2>
        <ul>
          {userStakeData && (
            <>
              <li>amount {userStakeData.amount.toString()}</li>
              <li>apy {userStakeData.apy.toString()}</li>
              <li>maturityTs {userStakeData.maturityTs.toString()}</li>
              <li>term {userStakeData.term.toString()}</li>
            </>
          )}
        </ul>
      </main>
    </div>
  );
};

export default Home;
