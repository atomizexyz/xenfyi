import { Address, Chain } from "wagmi";
import {
  avalanche,
  bsc,
  evmos,
  fantom,
  foundry,
  goerli,
  localhost,
  mainnet,
  moonbeam,
  okc,
  polygon,
  polygonMumbai,
} from "wagmi/chains";

import XENCryptoABI from "~/abi/XENCryptoABI";
import { dogechain, ethpow, x1Testnet } from "~/lib/chains";

export const xenContract = (contractChain?: Chain) => {
  switch (contractChain?.id) {
    case dogechain.id:
      return {
        address: "0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case x1Testnet.id:
      return {
        address: "0xD342D63466B520d8D331CaFF863900d402Aa5b00" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case goerli.id:
      return {
        address: "0xDd68332Fe8099c0CF3619cB3Bb0D8159EF1eCc93" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case polygonMumbai.id:
      return {
        address: "0xF230D614e75aE05dF44075CaB230Fa67F10D8dCD" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case fantom.id:
      return {
        address: "0xeF4B763385838FfFc708000f884026B8c0434275" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case avalanche.id:
      return {
        address: "0xC0C5AA69Dbe4d6DDdfBc89c0957686ec60F24389" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case ethpow.id:
    case bsc.id:
    case polygon.id:
    case evmos.id:
      return {
        address: "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case moonbeam.id:
      return {
        address: "0xb564A5767A00Ee9075cAC561c427643286F8F4E1" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case okc.id:
      return {
        address: "0x1cC4D981e897A3D2E7785093A648c0a75fAd0453" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case foundry.id:
    case localhost.id:
      return {
        address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" as Address,
        abi: XENCryptoABI,
        chainId: contractChain.id,
      };
    case mainnet.id:
    default:
      return {
        address: "0x06450dEe7FD2Fb8E39061434BAbCFC05599a6Fb8" as Address,
        abi: XENCryptoABI,
        chainId: mainnet.id,
      };
  }
};
