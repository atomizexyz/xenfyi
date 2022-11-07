import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { NextPage } from "next";
import { NumberStatCard } from "~/components/StatCards";
import { chainList } from "~/lib/client";
import { Chain } from "wagmi";
import { chainIcons } from "~/components/Constants";
import PortfolioNav from "~/components/nav/PortfolioNav";

const Balance: NextPage = () => {
  const BalanceRow: NextPage<{ chain: Chain }> = ({ chain }) => {
    return (
      <tr>
        <td className="align-top pt-6">
          <div className="stats stats-vertical shadow glass w-full">
            <div className="stat">
              <div className="stat-title">{chain.name}</div>
              <div className="stat-value flex justify-end">
                {chainIcons[chain.id]}
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">Addresses</div>
              <div className="stat-value text-lg md:text-2xl text-right">
                4,200
              </div>
            </div>
          </div>
        </td>
        <td className="w-5/12">
          <div className="flex flex-col">
            <NumberStatCard title="USD Value" value={200} decimals={0} />
            <NumberStatCard title="XEN Value" value={200} decimals={0} />
          </div>
        </td>
        <td className="w-5/12">
          <div className="flex flex-col">
            <NumberStatCard title="USD Value" value={200} decimals={0} />
            <NumberStatCard title="XEN Value" value={200} decimals={0} />
          </div>
        </td>
      </tr>
    );
  };

  const BalanceHeaderFooterRow: NextPage = () => {
    return (
      <tr>
        <th>Chain</th>
        <th>Locked (Stake + Mint)</th>
        <th>Liquid</th>
      </tr>
    );
  };

  return (
    <Container className="max-w-5xl">
      <PortfolioNav />
      <CardContainer className="rounded-none rounded-r-2xl rounded-bl-2xl">
        <div className="overflow-x-auto">
          <table className="table table-compact w-full">
            <thead>
              <BalanceHeaderFooterRow />
            </thead>
            <tbody>
              {chainList.map((chain, index) => (
                <BalanceRow key={index} chain={chain} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContainer>
    </Container>
  );
};

export default Balance;
