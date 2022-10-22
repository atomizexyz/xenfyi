import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { NextPage } from "next";
import { chainList } from "~/lib/client";
import ChainBalanceRow from "~/components/portfolio/ChainBalanceRow";

const View: NextPage = () => {
  return (
    <Container className="max-w-5xl">
      <CardContainer>
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th className="text-right">Price</th>
              <th className="text-right">Supply</th>
              <th className="text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {chainList
              .filter((chain) => !chain.testnet)
              .map((chain) => (
                <>
                  <ChainBalanceRow
                    chain={chain}
                    liquid={0}
                    stake={0}
                    mint={0}
                  />
                </>
              ))}
          </tbody>
          <tfoot>
            <>
              <tr>
                <th></th>
                <td className="text-right">Total</td>
                <td className="text-right">
                  <pre>{0}</pre>
                </td>
                <td className="text-right">
                  <pre>{0}</pre>
                </td>
              </tr>
            </>
          </tfoot>
        </table>
      </CardContainer>
    </Container>
  );
};

export default View;
