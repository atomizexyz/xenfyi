import type { NextPage } from "next";
import { ConnectKitButton, Avatar } from "connectkit";
import { InjectedConnector } from "wagmi/connectors/injected";
import Link from "next/link";
import { MoonIcon, SunIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { WalletIcon } from "../Icons";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import { Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import { useState, useEffect, useContext } from "react";
import { isMobile } from "react-device-detect";
import { StatusBadge } from "../StatusBadge";
import { navigationItems, linkItems, chainIcons } from "~/components/Constants";
import { UTC_TIME } from "~/lib/helpers";
import XENContext from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";

export const Navbar: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const [mintPageOverride, setMintPageOverride] = useState(1);
  const [stakePageOverride, setStakePageOverride] = useState(1);
  const { connector, isConnected } = useAccount();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const { userMint, userStake, token } = useContext(XENContext);

  const NavigationItems = (props: any) => {
    return (
      <>
        {navigationItems.map((item, index) => (
          <li key={index}>
            <Link
              href={(() => {
                switch (index) {
                  case 1:
                    return `/mint/${mintPageOverride}`;
                  case 2:
                    return `/stake/${stakePageOverride}`;
                  default:
                    return item.href;
                }
              })()}
            >
              <a
                className={clsx({
                  "btn-disabled text-neutral-content":
                    router.pathname.startsWith(item.href),
                  "glass text-neutral": !router.pathname.startsWith(item.href),
                })}
                onClick={() => {
                  (document.activeElement as HTMLElement).blur();
                }}
              >
                {item.icon}
                {t(item.t)}
                <StatusBadge
                  status={{
                    id: item.id,
                    mintPageOverride: mintPageOverride,
                    stakePageOverride: stakePageOverride,
                    offset: "right-2 lg:-top-2 lg:-right-3",
                  }}
                />
              </a>
            </Link>
          </li>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (userMint && !userMint.term.isZero()) {
      if (userMint.maturityTs.toNumber() > UTC_TIME) {
        setMintPageOverride(2);
      } else {
        setMintPageOverride(3);
      }
    } else {
      setMintPageOverride(1);
    }
    if (userStake && !userStake.term.isZero()) {
      if (userStake.maturityTs.toNumber() > UTC_TIME) {
        setStakePageOverride(2);
      } else {
        setStakePageOverride(3);
      }
    } else {
      setStakePageOverride(1);
    }
  }, [userMint, userStake]);

  const ChainList: NextPage<{ chains: Chain[] }> = ({ chains }) => {
    return (
      <>
        {chains.map((item, index) => (
          <li key={index}>
            <button
              className={clsx("justify-between", {
                "btn-disabled text-neutral-content": chain?.id == item.id,
                "glass text-neutral": !(chain?.id == item.id),
              })}
              disabled={chain?.id == item.id}
              onClick={() => {
                switchNetwork?.(item.id);
                (document.activeElement as HTMLElement).blur();
              }}
            >
              <div className="text-left">{item.name}</div>
              {chainIcons[item.id]}
            </button>
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="navbar">
      <div className="navbar-start space-x-2">
        <a className="text-neutral normal-case text-3xl font-light">XEN</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal glass rounded-box p-2 space-x-4">
          <NavigationItems />
        </ul>
      </div>
      <div className="navbar-end space-x-4">
        <ConnectKitButton.Custom>
          {({ show, address, truncatedAddress }) => {
            return (
              <>
                {isConnected ? (
                  <>
                    <div className="dropdown">
                      <label
                        tabIndex={0}
                        className="btn glass btn-square text-neutral"
                      >
                        {chainIcons[chain?.id ?? 1]}
                      </label>
                      <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow glass rounded-box w-64 space-y-2"
                      >
                        <ChainList
                          chains={chains.filter((chain) => !chain.testnet)}
                        />
                      </ul>
                    </div>

                    <button onClick={show} className="btn glass text-neutral">
                      <div className="flex space-x-2 items-center">
                        <div className="hidden lg:inline-flex">
                          <Avatar address={address} size={32} />
                        </div>
                        <pre className="text-base font-light">
                          {truncatedAddress}
                        </pre>
                      </div>
                    </button>
                  </>
                ) : (
                  <button onClick={show} className="btn glass text-neutral">
                    {t("connect-wallet")}
                  </button>
                )}
              </>
            );
          }}
        </ConnectKitButton.Custom>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn glass btn-square text-neutral">
            <DotsVerticalIcon className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content glass rounded-box w-64 space-y-2"
          >
            <li>
              <label className="flex swap swap-rotate justify-between text-neutral glass">
                {t("theme")}
                <input
                  type="checkbox"
                  onChange={() => {
                    const t = isDark ? "light" : "dark";
                    setTheme(t);
                    (document.activeElement as HTMLElement).blur();
                  }}
                />
                <MoonIcon className="swap-on w-5 h-5 absolute right-4" />
                <SunIcon className="swap-off w-5 h-5 absolute right-4" />
              </label>
            </li>
            {!isMobile && token && (
              <li>
                <button
                  className="justify-between text-neutral glass"
                  onClick={() => {
                    (connector as InjectedConnector)?.watchAsset?.({
                      address: token.address,
                      decimals: token.decimals,
                      image: "https://xen.fyi/images/xen.png",
                      symbol: token.symbol ?? "XEN",
                    });
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  {t("add-to-wallet")}
                  <WalletIcon />
                </button>
              </li>
            )}
            {linkItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href ?? "/"}>
                  <a
                    target="_blank"
                    className="justify-between text-neutral glass"
                    onClick={() => {
                      (document.activeElement as HTMLElement).blur();
                    }}
                  >
                    {t(item.t)}
                    {item.icon}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
