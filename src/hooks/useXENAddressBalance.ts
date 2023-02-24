import { Address, Chain, useContractRead } from "wagmi";

import XENCryptoABI from "~/abi/XENCryptoABI";
import { xenContract } from "~/lib/xen-contract";

interface AddressBalanceProps {
  address: Address;
  chain: Chain;
}

export const useXENAddressBalance = (props: AddressBalanceProps) => {
  const { data: userMintData } = useContractRead({
    address: xenContract(props.chain).address,
    abi: XENCryptoABI,
    functionName: "getUserMint",
    overrides: { from: props.address },
    // watch: true,
  });

  const { data: userStakeData } = useContractRead({
    address: xenContract(props.chain).address,
    abi: XENCryptoABI,
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
