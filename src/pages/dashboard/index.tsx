import { NextPage } from "next";
import { Chain, useNetwork } from "wagmi";
import Container from "~/components/containers/Container";
import CardContainer from "~/components/containers/CardContainer";
import { chainIcons } from "~/components/Constants";
import Link from "next/link";
import AddressLink from "~/components/AddressLink";
import { xenContract } from "~/lib/xen-contract";
import { chainList } from "~/lib/client";

const Chains: NextPage = () => {
  const ChainList: NextPage<{ chains: Chain[] }> = ({ chains }) => {
    return (
      <>
        {chains.map((item, index) => (
          <CardContainer key={index}>
            <h2 className="card-title">{item.name}</h2>

            <AddressLink
              name={""}
              address={xenContract(item).addressOrName}
              chain={item}
            />

            <Link href={`/dashboard/${item.id}`}>
              <div className="p-2 flex justify-right w-full" key={index}>
                <div className="relative">
                  <div className="btn glass gap-2 text-neutral">
                    {chainIcons[item?.id ?? 1]}
                    Launch Dashboard
                  </div>
                  <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-success animate-ping"></div>
                  <div className="absolute top-0 right-0 -mr-2 -mt-2 w-4 h-4 rounded-full badge-success"></div>
                </div>
              </div>
            </Link>
          </CardContainer>
        ))}
      </>
    );
  };

  return (
    <Container className="max-w-2xl">
      <div className="grid grid-cols-1 gap-4 py-4 ">
        <ChainList chains={chainList.filter((chain) => !chain.testnet)} />
      </div>
    </Container>
  );
};

export default Chains;
