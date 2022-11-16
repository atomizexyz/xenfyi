import { Chain, useSwitchNetwork } from "wagmi";
import { chainList } from "~/lib/client";

export const useEnvironmentChains = () => {
  const env = process.env.NODE_ENV as string;

  return {
    envChains: chainList.filter((chain: Chain) =>
      env == "production" ? !chain.testnet : chain.testnet
    ),
  };
};
