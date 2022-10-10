import { toGwei, gasCalculator, formatDecimals } from "~/lib/helpers";
import { BigNumber } from "ethers";

const GasEstimate = (props: any) => {
  return (
    <table className="w-full">
      <tbody>
        <tr className="label-text-alt text-neutral">
          <td>GAS:</td>
          <td className="text-right">
            {formatDecimals(
              toGwei(props.fee?.gas ?? BigNumber.from(0)),
              0,
              "gwei"
            )}
          </td>
        </tr>
        <tr className="label-text-alt text-neutral">
          <td>TRANSACTION:</td>
          <td className="text-right">
            {formatDecimals(Number(props.fee?.transaction ?? 0), 0, "gwei")}
          </td>
        </tr>
        <tr className="label-text-alt text-neutral">
          <td>TOTAL:</td>
          <td className="text-right">{gasCalculator(props.fee)}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default GasEstimate;
