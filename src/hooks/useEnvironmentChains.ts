import { Chain } from "wagmi";
import { foundry, localhost } from "wagmi/chains";

import { chainList } from "~/lib/client";

export const useEnvironmentChains = () => {
  const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK as string;

  const environmentChains = () => {
    switch (chainNetwork) {
      case "mainnet":
        return chainList
          .filter((c: Chain) => !c?.testnet)
          .filter((x: Chain) => {
            return foundry.id != x.id && localhost.id != x.id;
          });
      case "testnet":
        return chainList.filter((c: Chain) => c?.testnet);
      default:
        return [foundry];
    }
  };

  return {
    envChains: environmentChains(),
  };
};
