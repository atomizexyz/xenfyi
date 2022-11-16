import { Chain, useSwitchNetwork } from "wagmi";
import { chainList } from "~/lib/client";
import { useRouter } from "next/router";

export const useEnvironmentChains = () => {
  const router = useRouter();
  const env = process.env.NODE_ENV as string;

  return {
    envChains: chainList.filter((chain: Chain) =>
      env == "production" && !router.isPreview ? !chain.testnet : chain.testnet
    ),
  };
};
