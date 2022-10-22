import { Chain } from "wagmi";
import { NextPage } from "next";

interface ChainBalanceProps {
  chain?: Chain;
  liquid: number;
  stake: number;
  mint: number;
}

const ChainBalanceRow: NextPage<ChainBalanceProps> = (
  props: ChainBalanceProps
) => {
  return (
    <>
      <tr>
        <th>{props.chain?.name} Liquid</th>
        <td className="text-right">
          <pre>{props.liquid ?? 0}</pre>
        </td>
        <td className="text-right">
          <pre>{props.liquid ?? 0}</pre>
        </td>
        <td className="text-right">
          <pre>{props.liquid ?? 0}</pre>
        </td>
      </tr>
      <tr>
        <th>{props.chain?.name} Stake</th>
        <td className="text-right">
          <pre>{props.stake ?? 0}</pre>
        </td>
        <td className="text-right">
          <pre>{props.stake ?? 0}</pre>
        </td>
        <td className="text-right">
          <pre>{props.stake ?? 0}</pre>
        </td>
      </tr>
      <tr>
        <th>{props.chain?.name} Mint</th>
        <td className="text-right">
          <pre>{props.mint ?? 0}</pre>
        </td>
        <td className="text-right">
          <pre>{props.mint ?? 0}</pre>
        </td>
        <td className="text-right">
          <pre>{props.mint ?? 0}</pre>
        </td>
      </tr>
    </>
  );
};

export default ChainBalanceRow;
