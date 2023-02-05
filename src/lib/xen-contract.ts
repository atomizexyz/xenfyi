import { Chain, chain } from "wagmi";

import XENCryptoABI from "~/abi/XENCryptoABI";
import { avaxMainnet } from "~/lib/chains/avaxMainnet";
import { bscMainnet } from "~/lib/chains/bscMainnet";
import { bscTestnet } from "~/lib/chains/bscTestnet";
import { dogechainMainnet } from "~/lib/chains/dogechainMainnet";
import { ethwMainnet } from "~/lib/chains/ethwMainnet";
import { evmosMainnet } from "~/lib/chains/evmosMainnet";
import { fantomMainnet } from "~/lib/chains/fantomMainnet";
import { moonbeamMainnet } from "~/lib/chains/moonbeamMainnet";
import { pulseChain } from "~/lib/chains/pulseChainTestnet";

import { okxMainnet } from "./chains/okxMainnet";
import { polygonTestnet } from "./chains/polygonTestnet";

export const xenContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case dogechainMainnet.id:
      return {
        addressOrName: "0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case pulseChain.id:
    case chain.goerli.id:
    case bscTestnet.id:
      return {
        addressOrName: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case polygonTestnet.id:
      return {
        addressOrName: "0xdBBb2aa7C1208401382Fd1b611A1D9942B12fa64",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case fantomMainnet.id:
      return {
        addressOrName: "0xeF4B763385838FfFc708000f884026B8c0434275",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case avaxMainnet.id:
      return {
        addressOrName: "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case ethwMainnet.id:
    case bscMainnet.id:
    case chain.polygon.id:
    case evmosMainnet.id:
      return {
        addressOrName: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case moonbeamMainnet.id:
      return {
        addressOrName: "0xb564A5767A00Ee9075cAC561c427643286F8F4E1",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case okxMainnet.id:
      return {
        addressOrName: "0x1cC4D981e897A3D2E7785093A648c0a75fAd0453",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case chain.foundry.id:
    case chain.localhost.id:
      return {
        addressOrName: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        contractInterface: XENCryptoABI,
        chainId: contractChain.id,
      };
    case chain.mainnet.id:
    default:
      return {
        addressOrName: "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8",
        contractInterface: XENCryptoABI,
        chainId: chain.mainnet.id,
      };
  }
};
