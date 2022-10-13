import { NextPage } from "next";
import { Chain, useToken } from "wagmi";
import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { chainIcons } from "~/components/Constants";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import { chainList } from "~/lib/client";
import { truncatedAddress } from "~/lib/helpers";
import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { useCopyToClipboard } from "usehooks-ts";

const Chains: NextPage = () => {
  const AddressLinks: NextPage<{ chain: Chain }> = ({ chain }) => {
    const [_, copy] = useCopyToClipboard();

    return (
      <div className="flex flex-row space-x-8 lg:space-x-2 lg:justify-end">
        <pre>{truncatedAddress(xenContract(chain).addressOrName)}</pre>
        <button
          className="btn btn-square btn-xs glass text-neutral"
          onClick={() => copy(xenContract(chain).addressOrName)}
        >
          <DuplicateIcon className="w-5 h-5" />
        </button>
        <Link
          href={`${chain?.blockExplorers?.default.url}/address/${
            xenContract(chain).addressOrName
          }`}
        >
          <a className="btn btn-square btn-xs glass text-neutral">
            <ExternalLinkIcon className="w-5 h-5" />
          </a>
        </Link>
      </div>
    );
  };
  const ChainRow: NextPage<{ chain: Chain }> = ({ chain }) => {
    const { data: tokenData } = useToken({
      address: xenContract(chain).addressOrName,
      chainId: chain?.id,
    });

    return (
      <tr>
        <td className="bg-transparent">
          <Link href={`/dashboard/${chain.id}`}>
            <div className="p-2 flex">
              <div className="relative w-full lg:w-max">
                <div className="btn btn-md glass gap-2 text-neutral w-full lg:w-max">
                  {chainIcons[chain?.id ?? 1]}
                  {chain.name}
                </div>
                {tokenData ? (
                  <>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-success animate-ping"></div>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-success"></div>
                  </>
                ) : (
                  <>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-warning animate-ping"></div>
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-warning"></div>
                  </>
                )}
              </div>
            </div>
          </Link>
          <div className="pt-4 lg:hidden">
            {tokenData && <AddressLinks chain={chain} />}
          </div>
        </td>

        <td className="bg-transparent hidden lg:table-cell">
          {tokenData && <AddressLinks chain={chain} />}
        </td>
      </tr>
    );
  };

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="bg-transparent">Chain</th>
        <th className="bg-transparent text-right hidden lg:table-cell">
          Address
        </th>
      </tr>
    );
  };

  return (
    <Container className="max-w-4xl">
      <div className="space-y-4 w-full">
        <CardContainer>
          <h2 className="card-title">Chains</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <TableHeaderFooter />
              </thead>
              <tbody>
                {chainList
                  .filter((chain) => !chain.testnet)
                  .map((item, index) => (
                    <ChainRow chain={item} />
                  ))}
              </tbody>
              <tfoot>
                <TableHeaderFooter />
              </tfoot>
            </table>
          </div>
        </CardContainer>
      </div>
    </Container>
  );
};

export default Chains;
