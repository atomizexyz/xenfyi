import { useContractRead } from "wagmi";
import {
  truncatedAddress,
  estimatedXEN,
  estimatedStakeRewardXEN,
} from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";
import { useEffect, useState } from "react";

export const PortfolioAddressRow: React.FC<any> = (props) => {
  const [mintReward, setMintReward] = useState(0);
  const [stakeReward, setStakeReward] = useState(0);

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

  useEffect(() => {
    if (userStakeData) {
      const reward = estimatedStakeRewardXEN({
        maturityTs: userStakeData.maturityTs,
        term: userStakeData.term,
        amount: userStakeData.amount,
        apy: userStakeData.apy,
      });

      setStakeReward(reward);
    }
    if (userMintData && props.globalRankData) {
      const reward = estimatedXEN({
        amplifier: Number(userMintData.amplifier ?? 0),
        rank: Number(userMintData.rank ?? 0),
        term: Number(userMintData.term ?? 0),
        globalRank: props.globalRankData,
      });
      setMintReward(reward);
    }
  }, [userMintData, userStakeData, props.globalRankData]);

  return (
    <>
      <th className="bg-transparent">
        <label>
          <input
            name={props.address}
            id={props.address}
            type="checkbox"
            className="checkbox"
            {...props.register}
          />
        </label>
      </th>
      <td className="bg-transparent">
        <pre>{truncatedAddress(props.address)}</pre>
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
