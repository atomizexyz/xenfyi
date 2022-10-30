import Link from "next/link";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import React, { useState, useContext, useEffect } from "react";
import { StatusBadge } from "../StatusBadge";
import { navigationItems } from "~/components/Constants";
import { UTC_TIME } from "~/lib/helpers";
import type { NextPage } from "next";
import XENContext from "~/contexts/XENContext";
import { useTranslation } from "next-i18next";
import { isMobile } from "react-device-detect";

export const BottomNav: NextPage = () => {
  const { t } = useTranslation("common");

  const router = useRouter();
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
    <div
      className={clsx("btm-nav lg:hidden", {
        "h-24 pb-6":
          isMobile && ((window.navigator as any).standalone ?? false),
      })}
    >
      {navigationItems.map((item, index) => (
        <Link
          key={index}
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
            className={clsx("text-neutral", {
              "disabled active": router.pathname.startsWith(item.href),
              glass: !router.pathname.startsWith(item.href),
            })}
          >
            {item.icon}
            <span className="btm-nav-label">{t(item.t)}</span>

            <StatusBadge
              status={{
                id: item.id,
                mintPageOverride: mintPageOverride,
                stakePageOverride: stakePageOverride,
                offset: "-top-3 right-2",
              }}
            />
          </a>
        </Link>
      ))}
    </div>
  );
};
