import { DotsVerticalIcon, MoonIcon, SunIcon } from "@heroicons/react/outline";
import { clsx } from "clsx";
import { Avatar, ConnectKitButton } from "connectkit";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useTheme } from "next-themes";
import { useContext, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { chainIcons, linkItems, navigationItems } from "~/components/Constants";
import XENContext from "~/contexts/XENContext";
import { allChains } from "~/lib/client";
import { UTC_TIME } from "~/lib/helpers";

import { WalletIcon } from "../Icons";
import { StatusBadge } from "../StatusBadge";

export const Navbar: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const { connector, isConnected } = useAccount();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const chainDropdown = useRef<HTMLDivElement>(null);
  const menuDropdown = useRef<HTMLDivElement>(null);

  const { token } = useContext(XENContext);

  const NavigationItems: NextPage = () => {
    const [mintPageOverride, setMintPageOverride] = useState(1);
    const [stakePageOverride, setStakePageOverride] = useState(1);

    const { userMint, userStake } = useContext(XENContext);

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
              className={clsx("btn", {
                "btn-disabled text-neutral-content": router.pathname.startsWith(item.href),
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
            </Link>
          </li>
        ))}
      </>
    );
  };

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
        <div className="primary-text">Maintenance</div>
        {/* <ConnectKitButton.Custom>
          {({ show, address, truncatedAddress }) => {
            return (
              <>
                {isConnected ? (
                  <>
                    <div className="dropdown" ref={chainDropdown}>
                      <div
                        tabIndex={0}
                        className="btn glass btn-square text-neutral"
                        onClick={() => {
                          chainDropdown?.current?.classList.toggle("dropdown-open");
                          (document.activeElement as HTMLElement).blur();
                        }}
                      >
                        {chainIcons[chain?.id ?? 1]}
                      </div>
                      <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow glass rounded-box w-64 space-y-2"
                      >
                        <ChainList chains={allChains} />
                      </ul>
                    </div>

                    <button onClick={show} className="btn glass text-neutral">
                      <div className="flex space-x-2 items-center">
                        <div className="hidden lg:inline-flex">
                          <Avatar address={address} size={16} />
                        </div>
                        <pre className="text-base font-light">{truncatedAddress}</pre>
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
        </ConnectKitButton.Custom> */}
        <div className="dropdown dropdown-end" ref={menuDropdown}>
          <div
            tabIndex={0}
            className="btn glass btn-square text-neutral"
            onClick={() => {
              menuDropdown?.current?.classList.toggle("dropdown-open");
              (document.activeElement as HTMLElement).blur();
            }}
          >
            <DotsVerticalIcon className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content glass rounded-box w-72 space-y-2"
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
                <Link
                  href={item.href ?? "/"}
                  target="_blank"
                  className="justify-between text-neutral glass"
                  onClick={() => {
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  {t(item.t)}
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
