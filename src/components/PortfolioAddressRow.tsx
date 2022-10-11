import { useContractRead } from "wagmi";
import type { NextPage } from "next";
import {
  truncatedAddress,
  estimatedXEN,
  estimatedStakeRewardXEN,
} from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";
import { useEffect, useState } from "react";

export const PortfolioAddressRow: NextPage<any> = (props) => {
  const [mintReward, setMintReward] = useState(0);
  const [stakeReward, setStakeReward] = useState(0);

  const { data: userMintData } = useContractRead({
    ...xenContract(props.chain),
    functionName: "getUserMint",
    overrides: { from: props.item.address },
    watch: true,
  });

  const { data: userStakeData } = useContractRead({
    ...xenContract(props.chain),
    functionName: "getUserStake",
    overrides: { from: props.item.address },
    watch: true,
  });

  useEffect(() => {
    if (userStakeData) {
      const reward = estimatedStakeRewardXEN({
        maturityTs: userStakeData.maturityTs,
        term: userStakeData.term,
        amount: userStakeData.amount,
        apy: userStakeData.apy,
      });
      props.item.stake = reward;
      setStakeReward(reward);
    }
    if (userMintData && props && props.globalRankData) {
      const reward = estimatedXEN({
        amplifier: Number(userMintData.amplifier ?? 0),
        rank: Number(userMintData.rank ?? 0),
        term: Number(userMintData.term ?? 0),
        globalRank: props.globalRankData,
      });
      props.item.mint = reward;
      setMintReward(reward);
    }
  }, [
    userMintData,
    userStakeData,
    props.globalRankData,
    props,
    props.index,
    props.item,
  ]);

  return (
    <>
      <td className="bg-transparent">
        <button
          name="delete"
          id="delete"
          type="button"
          className="btn btn-xs glass text-neutral"
          onClick={() => {
            props.remove(props.index);
            const updatedAddresses = props.storedAddresses.filter(
              (address: string) => address !== props.item.address
            );
            props.setStoredAddresses(updatedAddresses);
          }}
        >
          Delete
        </button>
      </td>
      <td className="bg-transparent">
        <pre>{truncatedAddress(props.item.address)}</pre>
      </td>
      <td className="bg-transparent text-right">
        <pre>
          {mintReward.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </pre>
      </td>
      <td className="bg-transparent text-right">
        <pre>
          {stakeReward.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </pre>
      </td>
    </>
  );
};

export default PortfolioAddressRow;
