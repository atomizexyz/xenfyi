import { Chain, chain } from "wagmi";
import XenCrypto from "~/abi/XENCrypto.json";
import { pulseChain } from "~/lib/chains/pulseChainTestnet";
import { bscTestnet } from "~/lib/chains/bscTestnet";
import { bscMainnet } from "~/lib/chains/bscMainnet";
import { polygonMainnet } from "~/lib/chains/polygonMainnet";
import { avaxMainnet } from "~/lib/chains/avaxMainnet";
import { ethwMainnet } from "~/lib/chains/ethwMainnet";
import { moonbeamMainnet } from "./chains/moonbeamMainnet";
import { evmosMainnet } from "./chains/evmosMainnet";

export const xenContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case pulseChain.id:
    case chain.goerli.id:
    case chain.polygonMumbai.id:
    case bscTestnet.id:
      return {
        addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
        contractInterface: XenCrypto.abi,
        chainId: contractChain?.id,
      };
    case avaxMainnet.id:
      return {
        addressOrName: "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389",
        contractInterface: XenCrypto.abi,
        chainId: contractChain?.id,
      };
    case ethwMainnet.id:
    case bscMainnet.id:
    case polygonMainnet.id:
      return {
        addressOrName: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
        contractInterface: XenCrypto.abi,
        chainId: contractChain?.id,
      };
    case moonbeamMainnet.id:
    case evmosMainnet.id:
      return {
        addressOrName: "",
        contractInterface: XenCrypto.abi,
        chainId: contractChain?.id,
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
