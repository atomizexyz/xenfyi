import { Chain, useSwitchNetwork } from "wagmi";
import { chainList } from "~/lib/client";
import { useRouter } from "next/router";

export const useEnvironmentChains = () => {
  const { isPreview } = useRouter();
  const env = process.env.NODE_ENV as string;

  console.log(env, isPreview);

  return {
    envChains: chainList.filter((chain: Chain) =>
      env == "production" && !isPreview ? !chain.testnet : chain.testnet
    ),
  };
};
