import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { BigNumber } from "ethers";
import { NextPage } from "next";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import { useCopyToClipboard } from "usehooks-ts";
import { Chain, useContractRead, useToken } from "wagmi";

import Breadcrumbs from "~/components/Breadcrumbs";
import { chainIcons } from "~/components/Constants";
import CardContainer from "~/components/containers/CardContainer";
import Container from "~/components/containers/Container";
import { Token } from "~/contexts/XENContext";
import { useEnvironmentChains } from "~/hooks/useEnvironmentChains";
import { truncatedAddress } from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";

const Chains: NextPage = () => {
  const { t } = useTranslation("common");
  const { envChains } = useEnvironmentChains();
  const [mintAddresses, setMintAddresses] = useState<{ [key: number]: BigNumber }>({});
  const [totalMintCount, setTotalMintCount] = useState(BigNumber.from(0));
  const [totalChainCount, setTotalChainCount] = useState(0);

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

  const ChainRow: NextPage<{ chain: Chain }> = ({ chain }) => {
    const [token, setToken] = useState<Token | null>(null);
    const [globalRank, setGlobalRank] = useState<BigNumber>(BigNumber.from(0));

    const [,] = useState(0);

    const { data: tokenData } = useToken({
      address: xenContract(chain).address,
      chainId: chain?.id,
    });

    useContractRead({
      ...xenContract(chain),
      functionName: "globalRank",
      onSuccess(data) {
        setGlobalRank(data);

        console.log("here", data);

        const tempMintAddresses = mintAddresses;
        tempMintAddresses[chain.id] = data;
        setMintAddresses(tempMintAddresses);
      },
      watch: true,
    });

    useEffect(() => {
      if (tokenData) {
        setToken(tokenData);
      }
    }, [chain.id, globalRank, tokenData]);

    return (
      <tr>
        <td>
          <Link href={`/dashboard/${chain.id}`} legacyBehavior>
            <div className="p-2 flex">
              <div className="relative w-full lg:w-max">
                <div className="btn btn-md glass gap-2 text-neutral w-full lg:w-max">
                  {chainIcons[chain?.id ?? 1]}
                  {chain.name}
                </div>
                {token ? (
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
              <CountUp end={Number(globalRank)} preserveValue={true} separator="," suffix=" gRank" />
            </pre>
            {token && <AddressLinks chain={chain} />}
          </div>
        </td>

        <td className="hidden lg:table-cell text-right">
          <pre>
            <CountUp end={Number(globalRank)} preserveValue={true} separator="," />
          </pre>
        </td>
        <td className="hidden lg:table-cell">{token && <AddressLinks chain={chain} />}</td>
      </tr>
    );
  };

  const TotalMintRow = () => {
    return (
      <tr>
        <td>
          <div className="p-2 flex text-xl font-bold">
            {totalChainCount} {t("dashboard.chains")}
          </div>
          <div className="pt-4 lg:hidden flex flex-col space-y-4">
            <pre className="text-right">
              <CountUp end={totalMintCount.toNumber()} preserveValue={true} separator="," suffix=" gRank" />
            </pre>
          </div>
        </td>
        <td className="hidden lg:table-cell text-right">
          <pre>
            <CountUp end={totalMintCount.toNumber()} preserveValue={true} separator="," />
          </pre>
        </td>
        <td className="hidden lg:table-cell"></td>
      </tr>
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
    const chains = Object.keys(mintAddresses).length;
    setTotalChainCount(chains);
    const gRanks = Object.values(mintAddresses).reduce((a, b) => a.add(b), BigNumber.from(0));
    setTotalMintCount(gRanks);
  }, [mintAddresses]);

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
                {envChains.map((item, index) => (
                  <ChainRow chain={item} key={index} />
                ))}
                <TotalMintRow />
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
