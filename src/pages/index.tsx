import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Head from "next/head";
import XenCrypto from "../abi/XENCrypto.json";
import { useContractRead } from "wagmi";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

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

  const shortenAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <div>
      <Head>
        <title>XEN.fyi</title>
        <meta name="description" content="XEN token" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>XEN</h1>
        {isConnected ? (
          <div>
            Connected to {address && shortenAddress(address)}
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <button onClick={() => connect()}>Connect Wallet</button>
        )}
        <h2>Mint</h2>
        <ul>
          <li>amplifier {userMintData?.amplifier.toString()}</li>
          <li>eaaRate {userMintData?.eaaRate.toString()}</li>
          <li>maturityTs {userMintData?.maturityTs.toString()}</li>
          <li>rank {userMintData?.rank.toString()}</li>
          <li>term {userMintData?.term.toString()}</li>
        </ul>
        <h2>Stake</h2>
        <ul>
          <li>amount {userStakeData?.amount.toString()}</li>
          <li>apy {userStakeData?.apy.toString()}</li>
          <li>maturityTs {userStakeData?.maturityTs.toString()}</li>
          <li>term {userStakeData?.term.toString()}</li>
        </ul>
      </main>
    </div>
  );
};

export default Home;
