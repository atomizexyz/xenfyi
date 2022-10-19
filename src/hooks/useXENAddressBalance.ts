import { useEffect, useState } from "react";
import { Chain, useContractRead } from "wagmi";
import { xenContract } from "~/lib/xen-contract";

interface AddressBalanceProps {
  address: string;
  chain: Chain;
}

export const useXENAddressBalance = (props: AddressBalanceProps) => {
  const { data: userMintData } = useContractRead({
    ...xenContract(props.chain),
    functionName: "getUserMint",
    overrides: { from: props.address },
    // watch: true,
  });

  const { data: userStakeData } = useContractRead({
    ...xenContract(props.chain),
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
