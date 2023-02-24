import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useContext } from "react";

import AddressLink from "~/components/AddressLink";
import { linkItems, textLinkItems } from "~/components/Constants";
import XENContext from "~/contexts/XENContext";
import { DONATION_ADDRESS } from "~/lib/helpers";
import { xenContract } from "~/lib/xen-contract";

const Footer = () => {
  const { t } = useTranslation("common");

  const { currentChain } = useContext(XENContext);

  return (
    <footer className="footer footer-center text-base-content py-8">
      <div>
        <div className="grid grid-cols-4 lg:grid-flow-col gap-10 lg:gap-6 text-neutral">
          {linkItems.map((item, index) => (
            <div key={index} className="tooltip tooltip-info" data-tip={t(item.t)}>
              <Link href={item.href} target="_blank">
                {item.icon}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <AddressLink name={t("contract")} address={xenContract(currentChain).address} chain={currentChain} />
      <AddressLink name={t("donate")} address={DONATION_ADDRESS} chain={currentChain} />
      <div className="grid grid-flow-col gap-4">
        {textLinkItems.map((item, index) => (
          <Link href={item.href} key={index} target="_blank" className="link link-hover text-neutral">
            {t(item.t)}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
