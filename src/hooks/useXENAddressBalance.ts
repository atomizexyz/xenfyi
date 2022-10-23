import { Address, Chain, useContractRead } from "wagmi";
import { xenContract } from "~/lib/xen-contract";
import { getUserMintFunction, getUserStakeFunction } from "~/abi/abi-functions";

interface AddressBalanceProps {
  address: Address;
  chain: Chain;
}

export const useXENAddressBalance = (props: AddressBalanceProps) => {
  const { data: userMintData } = useContractRead({
    address: xenContract(props.chain).address,
    abi: getUserMintFunction,
    functionName: "getUserMint",
    overrides: { from: props.address },
    // watch: true,
  });

  const { data: userStakeData } = useContractRead({
    address: xenContract(props.chain).address,
    abi: getUserStakeFunction,
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
