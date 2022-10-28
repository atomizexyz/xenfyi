import type { NextApiRequest, NextApiResponse } from "next";
import { chainList } from "~/lib/client";
import { UniswapPair } from "simple-uniswap-sdk";
import { xenContract } from "~/lib/xen-contract";
import { provider } from "~/lib/client";
import { dexes } from "~/lib/dex-network";
import { BigNumber, ethers } from "ethers";
import XENCryptoABI from "~/abi/XENCryptoABI";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const mainnetChains = chainList.filter((chain) => !chain.testnet);
  const { chainId } = req.query as { chainId: string };

  const chain = mainnetChains.find((chain) => chain.id === Number(chainId));

  // if chain id is not in the list, return 404
  if (chain) {
    try {
      const xenContractAddress = xenContract(chain).addressOrName;

      const currentProvider = provider({ chainId: chain.id });

      const uniswapPair = new UniswapPair({
        fromTokenContractAddress: xenContractAddress,
        toTokenContractAddress: dexes[chain.id].stableAddress,
        ethereumAddress: "0x806F5d470ee7dd7B7a8CEB092D3fA7ef00A70576",
        ethereumProvider: currentProvider,
        settings: dexes[chain.id].uniswapPairSettings,
      });

      const uniswapPairFactory = await uniswapPair.createFactory();
      const trade = await uniswapPairFactory.trade("1");

      const XENContract = new ethers.Contract(
        xenContractAddress,
        XENCryptoABI,
        currentProvider
      );

      const globalRank = await XENContract.globalRank();

      res.status(200).json({
        xenContract: xenContractAddress,
        gRank: globalRank.toNumber(),
        minAmountConvertQuote: trade.minAmountConvertQuote,
        expectedConvertQuote: trade.expectedConvertQuote,
      });
      return;
    } catch (error) {
      res.status(404).json(error);
      return;
    }
  } else {
    res.status(404).json({ name: "Not Found" });
    return;
  }
}
