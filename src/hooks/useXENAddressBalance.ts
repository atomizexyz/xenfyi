import { Chain, useContractRead } from "wagmi";

import XENCryptoABI from "~/abi/XENCryptoABI";
import { xenContract } from "~/lib/xen-contract";

interface AddressBalanceProps {
  address: string;
  chain: Chain;
}

export const useXENAddressBalance = (props: AddressBalanceProps) => {
  const { data: userMintData } = useContractRead({
    addressOrName: xenContract(props.chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "getUserMint",
    overrides: { from: props.address },
    // watch: true,
  });

  const { data: userStakeData } = useContractRead({
    addressOrName: xenContract(props.chain).addressOrName,
    contractInterface: XENCryptoABI,
    functionName: "getUserStake",
    overrides: { from: props.address },
    // watch: true,
  });

  return {
    mintData: userMintData,
    stakeData: userStakeData,
  };
};

export default useXENAddressBalance;
