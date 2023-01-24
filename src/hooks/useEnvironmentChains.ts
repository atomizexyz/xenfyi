import { Chain, chain } from "wagmi";
import { chainList } from "~/lib/client";

export const useEnvironmentChains = () => {
  const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

  const environmentChains = () => {
    const local = [chain.foundry, chain.localhost];
    switch (chainNetwork) {
      case "mainnet":
        return chainList.filter((c: Chain) => !c?.testnet).filter((x) => !local.includes(x));
      case "testnet":
        return chainList.filter((c: Chain) => c?.testnet);
      default:
        return local;
    }
  };

  return {
    envChains: environmentChains(),
  };
};
