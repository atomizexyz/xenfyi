import { useRouter } from "next/router";
import { useSwitchNetwork } from "wagmi";

export const useEnvironmentChains = () => {
  const router = useRouter();
  const { chains } = useSwitchNetwork();
  return {
    envChains: chains.filter((chain) =>
      router.isPreview ? chain.testnet : !chain.testnet
    ),
  };
};
