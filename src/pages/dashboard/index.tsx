import { NextPage } from "next";
import { Chain, useToken, useContractRead } from "wagmi";
import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { chainIcons } from "~/components/Constants";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import { chainList } from "~/lib/client";
import { truncatedAddress } from "~/lib/helpers";
import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import CountUp from "react-countup";

const Chains: NextPage = () => {
  const AddressLinks: NextPage<{ chain: Chain }> = ({ chain }) => {
    const [_, copy] = useCopyToClipboard();

    return (
      <div className="flex flex-row-reverse lg:flex-row space-x-8 lg:space-x-2 lg:justify-end">
        <pre className="pl-8 lg:pl-0">
          {truncatedAddress(xenContract(chain).address)}
        </pre>
        <button
          className="btn btn-square btn-xs glass text-neutral"
          onClick={() => {
            copy(xenContract(chain).address);
            toast.success(
              <div>
                <pre>{truncatedAddress(xenContract(chain).address)}</pre>
                Copied to clipboard
              </div>
            );
          }}
        >
          <DuplicateIcon className="w-5 h-5" />
        </button>
        <Link
          href={`${chain?.blockExplorers?.default.url}/address/${
            xenContract(chain).address
          }`}
        >
          <a
            target="_blank"
            className="btn btn-square btn-xs glass text-neutral"
          >
            <ExternalLinkIcon className="w-5 h-5" />
          </a>
        </Link>
      </div>
    );
  };

  const ChainRow: NextPage<{ chain: Chain }> = ({ chain }) => {
    const { data: tokenData } = useToken({
      address: xenContract(chain).address as any,
      chainId: chain?.id,
    });

    const { data: globalRank } = useContractRead({
      ...xenContract(chain),
      functionName: "globalRank",
      // watch: true,
    });

    return (
      <tr>
        <td>
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
          <div className="pt-4 lg:hidden flex flex-col space-y-4">
            <pre className="text-right">
              <CountUp
                end={Number(globalRank)}
                preserveValue={true}
                separator=","
                suffix=" gRank"
              />
            </pre>
            {tokenData && <AddressLinks chain={chain} />}
          </div>
        </td>

        <td className="hidden lg:table-cell text-right">
          <pre>
            <CountUp
              end={Number(globalRank)}
              preserveValue={true}
              separator=","
            />
          </pre>
        </td>
        <td className="hidden lg:table-cell">
          {tokenData && <AddressLinks chain={chain} />}
        </td>
      </tr>
    );
  };

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="hidden lg:table-cell">Chain</th>
        <th className="hidden lg:table-cell text-right">gRank</th>
        <th className="hidden lg:table-cell text-right">Address</th>
      </tr>
    );
  };

  return (
    <Container className="max-w-5xl">
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
                    <ChainRow chain={item} key={index} />
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
