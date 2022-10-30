import { linkItems, textLinkItems } from "~/components/Constants";
import { chain, useNetwork, Chain } from "wagmi";
import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import { useState } from "react";
import { DONATION_ADDRESS } from "~/lib/helpers";
import AddressLink from "~/components/AddressLink";
import { useTranslation } from "next-i18next";

const Footer = () => {
  const { t } = useTranslation("common");

  const { chain: currentChain } = useNetwork();

  const defaultChain: Chain = currentChain ?? chain.mainnet;
  const [address] = useState(xenContract(defaultChain).addressOrName);

  return (
    <footer className="footer footer-center text-base-content py-8">
      <div>
        <div className="grid grid-cols-4 lg:grid-flow-col gap-10 lg:gap-6 text-neutral">
          {linkItems.map((item, index) => (
            <div
              key={index}
              className="tooltip tooltip-info"
              data-tip={t(item.t)}
            >
              <Link href={item.href}>
                <a target="_blank">{item.icon}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <AddressLink
        name={t("contract")}
        address={address}
        chain={defaultChain}
      />
      <AddressLink
        name={t("donate")}
        address={DONATION_ADDRESS}
        chain={defaultChain}
      />
      <div className="grid grid-flow-col gap-4">
        {textLinkItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <a target="_blank" className="link link-hover text-neutral">
              {t(item.t)}
            </a>
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
