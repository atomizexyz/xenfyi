import { useSwitchNetwork } from "wagmi";

export const useEnvironmentChains = () => {
  const { chains } = useSwitchNetwork();

  const env = process.env.NODE_ENV;

  return {
    envChains: chains.filter((chain) =>
      env == "production" ? !chain.testnet : chain.testnet
    ),
  };
};
