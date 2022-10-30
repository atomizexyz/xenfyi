import { NextPage } from "next";
import { toGwei, formatDecimals } from "~/lib/helpers";
import { BigNumber } from "ethers";
import { FeeData } from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";

interface GasEstimateProps {
  feeData?: FeeData;
  gasLimit?: BigNumber;
}

const GasEstimate: NextPage<GasEstimateProps> = ({ feeData, gasLimit }) => {
  const { t } = useTranslation("common");

  return (
    <table className="w-full">
      <tbody>
        <tr className="label-text-alt text-neutral">
          <td>{t("gas.gas").toUpperCase()}</td>
          <td className="text-right">
            {formatDecimals(
              Number(toGwei(feeData?.gasPrice ?? BigNumber.from(0))),
              0,
              "gwei"
            )}
          </td>
        </tr>
        <tr className="label-text-alt text-neutral">
          <td>{t("gas.transaction").toUpperCase()}</td>
          <td className="text-right">
            {formatDecimals(Number(gasLimit ?? 0), 0, "gwei")}
          </td>
        </tr>
        <tr className="label-text-alt text-neutral">
          <td>{t("gas.total").toUpperCase()}</td>
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
