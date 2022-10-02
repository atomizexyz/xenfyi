import type { NextPage } from "next";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Head from "next/head";

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

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
            Connected to {address}
            <button onClick={() => disconnect()}>Disconnect</button>
          </div>
        ) : (
          <button onClick={() => connect()}>Connect Wallet</button>
        )}
      </main>
    </div>
  );
};

export default Home;
