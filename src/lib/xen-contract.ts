import { Chain, chain } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { pulseChain } from "~/lib/pulseChainTestnet";
import { bscTestnet } from "~/lib/bscTestnet";

export const xenContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case pulseChain.id:
    case chain.goerli.id:
    case chain.polygonMumbai.id:
    case bscTestnet.id:
      return {
        addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
        contractInterface: XenCrypto.abi,
      };
    case chain.mainnet.id:
    default:
      return {
        addressOrName: "0x06450dee7fd2fb8e39061434babcfc05599a6fb8",
        contractInterface: XenCrypto.abi,
        chainId: chain.mainnet.id,
      };
  }
};
