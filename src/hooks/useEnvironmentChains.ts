import { Chain } from "wagmi";
import { chainList } from "~/lib/client";

export const useEnvironmentChains = () => {
  const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

  return {
    envChains: chainList.filter((chain: Chain) =>
      chainNetwork == "mainnet" ? !chain.testnet : chain.testnet
    ),
  };
};
