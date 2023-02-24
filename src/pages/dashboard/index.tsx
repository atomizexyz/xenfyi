import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
import { Chain, useContractReads } from "wagmi";

import Breadcrumbs from "~/components/Breadcrumbs";
import { chainIcons } from "~/components/Constants";
import CardContainer from "~/components/containers/CardContainer";
import Container from "~/components/containers/Container";
import { useEnvironmentChains } from "~/hooks/useEnvironmentChains";
import { truncatedAddress } from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";

interface ChainRow {
  chain: Chain;
  globalRank: number;
  isConnected: boolean;
}

const Chains: NextPage = () => {
  const { t } = useTranslation("common");
  const { envChains } = useEnvironmentChains();
  const [totalChainCount, setTotalChainCount] = useState<number>(0);
  const [totalMintCount, setTotalMintCount] = useState<number>(0);
  const [chainRows, setChainRows] = useState<ChainRow[]>([]);

  const contracts = envChains.map((chain) => {
    return {
      ...xenContract(chain),
      functionName: "globalRank",
    };
  });

  const { data: globalRanksData } = useContractReads({
    contracts,
  });

  const AddressLinks: NextPage<{ chain: Chain }> = ({ chain }) => {
    const [_, copy] = useCopyToClipboard();

    return (
      <div className="flex flex-row-reverse lg:flex-row space-x-8 lg:space-x-2 lg:justify-end">
        <pre className="pl-8 lg:pl-0">{truncatedAddress(xenContract(chain).address)}</pre>
        <button
          className="btn btn-square btn-xs glass text-neutral"
          onClick={() => {
            copy(xenContract(chain).address);
            toast.success(
              <div>
                <pre>{truncatedAddress(xenContract(chain).address)}</pre>
                {t("toast.copied-to-clipboard")}
              </div>
            );
          }}
        >
          <DuplicateIcon className="w-5 h-5" />
        </button>
        <Link
          href={`${chain?.blockExplorers?.default.url}/address/${xenContract(chain).address}`}
          target="_blank"
          className="btn btn-square btn-xs glass text-neutral"
        >
          <ExternalLinkIcon className="w-5 h-5" />
        </Link>
      </div>
    );
  };

  const TableHeaderFooter = () => {
    return (
      <tr>
        <th className="hidden lg:table-cell"></th>
        <th className="hidden lg:table-cell text-right">{t("global-rank")}</th>
        <th className="hidden lg:table-cell text-right">{t("address")}</th>
      </tr>
    );
  };

  useEffect(() => {
    if (globalRanksData) {
      setTotalChainCount(globalRanksData.length);
      const total = globalRanksData.reduce((acc, cur) => {
        const accBig = Number(acc ?? 0);
        const currBig = Number(cur ?? 0);
        return accBig + currBig;
      }, 0);
      setTotalMintCount(Number(total));
      const rows = envChains.map((chain, index) => {
        return {
          chain,
          globalRank: Number(globalRanksData[index] ?? 0),
          isConnected: true,
        };
      });
      if (chainRows.length == 0) {
        setChainRows(rows);
      }
    }
  }, [chainRows.length, envChains, globalRanksData]);

  return (
    <Container className="max-w-5xl">
      <Breadcrumbs />

      <div className="space-y-4 w-full">
        <CardContainer>
          <h2 className="card-title">{t("dashboard.chains")}</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <TableHeaderFooter />
              </thead>
              <tbody>
                {chainRows &&
                  chainRows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <Link href={`/dashboard/${row.chain.id}`} legacyBehavior>
                          <div className="p-2 flex">
                            <div className="relative w-full lg:w-max">
                              <div className="btn btn-md glass gap-2 text-neutral w-full lg:w-max">
                                {chainIcons[row.chain?.id ?? 1]}
                                {row.chain.name}
                              </div>
                              {row.isConnected ? (
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
                            <CountUp end={row.globalRank} preserveValue={true} separator="," suffix=" gRank" />
                          </pre>
                          {row.isConnected && <AddressLinks chain={row.chain} />}
                        </div>
                      </td>

                      <td className="hidden lg:table-cell text-right">
                        <pre>
                          <CountUp end={row.globalRank} preserveValue={true} separator="," />
                        </pre>
                      </td>
                      <td className="hidden lg:table-cell">{row.isConnected && <AddressLinks chain={row.chain} />}</td>
                    </tr>
                  ))}
                <tr>
                  <td>
                    <div className="p-2 flex text-xl font-bold">
                      {totalChainCount} {t("dashboard.chains")}
                    </div>
                    <div className="pt-4 lg:hidden flex flex-col space-y-4">
                      <pre className="text-right">
                        <CountUp end={totalMintCount} preserveValue={true} separator="," suffix=" gRank" />
                      </pre>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell text-right">
                    <pre>
                      <CountUp end={totalMintCount} preserveValue={true} separator="," />
                    </pre>
                  </td>
                  <td className="hidden lg:table-cell"></td>
                </tr>
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

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Chains;
