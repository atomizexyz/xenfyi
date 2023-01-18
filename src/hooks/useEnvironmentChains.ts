import { Chain, chain } from "wagmi";
import { chainList } from "~/lib/client";

export const useEnvironmentChains = () => {
  const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

  const environmentChains = () => {
    if (!chainNetwork) return chainList;
    if (chainNetwork == "devnet") return [chain.foundry, chain.localhost];
    return chainList.filter((chain: Chain) => (chainNetwork == "mainnet" ? !chain.testnet : chain.testnet));
  };

  return {
    envChains: environmentChains(),
  };
};
