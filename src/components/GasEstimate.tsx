import { NextPage } from "next";
import { toGwei, formatDecimals } from "~/lib/helpers";
import { BigNumber } from "ethers";
import { FeeData } from "~/contexts/XENContext";

interface GasEstimateProps {
  feeData?: FeeData;
  gasLimit?: BigNumber;
}

const GasEstimate: NextPage<GasEstimateProps> = ({ feeData, gasLimit }) => {
  return (
    <table className="w-full">
      <tbody>
        <tr className="label-text-alt text-neutral">
          <td>GAS:</td>
          <td className="text-right">
            {formatDecimals(
              Number(toGwei(feeData?.gasPrice ?? BigNumber.from(0))),
              0,
              "gwei"
            )}
          </td>
        </tr>
        <tr className="label-text-alt text-neutral">
          <td>TRANSACTION:</td>
          <td className="text-right">
            {formatDecimals(Number(gasLimit ?? 0), 0, "gwei")}
          </td>
        </tr>
        <tr className="label-text-alt text-neutral">
          <td>TOTAL:</td>
          <td className="text-right">
            {formatDecimals(
              Number(
                toGwei(
                  feeData?.gasPrice.mul(gasLimit ?? 0) ?? BigNumber.from(0)
                )
              ),
              0,
              "gwei"
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default GasEstimate;
