import { linkItems, textLinkItems } from "~/components/Constants";
import { chain, useNetwork, Chain } from "wagmi";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import { DuplicateIcon, ExternalLinkIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { DONATION_ADDRESS } from "~/lib/helpers";

const Footer = () => {
  const { chain: currentChain } = useNetwork();
  const [_, copy] = useCopyToClipboard();

  const defaultChain: Chain = currentChain ?? chain.mainnet;
  const [address] = useState(xenContract(defaultChain).addressOrName);

  const AddressLink = (props: any) => {
    return (
      <div className="flex flex-col lg:flex-row space-x-2">
        <span>{props.name}</span>
        <code>{props.address}</code>
        <div className="flex flex-row space-x-8 lg:space-x-2">
          <button
            className="btn btn-square btn-xs glass"
            onClick={() => copy(props.address)}
          >
            <DuplicateIcon className="w-5 h-5" />
          </button>
          <Link
            href={`${defaultChain?.blockExplorers?.default.url}/address/${props.address}`}
          >
            <a className="btn btn-square btn-xs glass">
              <ExternalLinkIcon className="w-5 h-5" />
            </a>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <footer className="footer footer-center text-base-content py-8">
      <div>
        <div className="grid grid-cols-4 lg:gird-cols-none gap-10 lg:gap-6">
          {linkItems.map((item, index) => (
            <div
              key={index}
              className="tooltip tooltip-info"
              data-tip={item.name}
            >
              <Link href={item.href}>
                <a key={index}>{item.icon}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <AddressLink name={"Contract:"} address={address} />
      <AddressLink name={"Donate:"} address={DONATION_ADDRESS} />
      <div className="grid grid-flow-col gap-4">
        {textLinkItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <a className="link link-hover">{item.name}</a>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
