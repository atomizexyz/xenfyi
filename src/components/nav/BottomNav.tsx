import Link from "next/link";
import { xenContract } from "~/lib/xen-contract";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { useState, useEffect } from "react";
import { StatusBadge } from "../StatusBadge";
import { navigationItems } from "~/components/Constants";
import { UTC_TIME } from "~/lib/helpers";
import type { NextPage } from "next";

export const BottomNav: NextPage = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const [mintPageOverride, setMintPageOverride] = useState(1);
  const [stakePageOverride, setStakePageOverride] = useState(1);
  const { address } = useAccount();

  const { data: userMint } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    // watch: true,
  });

  const { data: userStake } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
    // watch: true,
  });

  useEffect(() => {
    if (userMint && !userMint.term.isZero()) {
      if (userMint.maturityTs > UTC_TIME) {
        setMintPageOverride(2);
      } else {
        setMintPageOverride(3);
      }
    } else {
      setMintPageOverride(1);
    }
    if (userStake && !userStake.term.isZero()) {
      if (userStake.maturityTs > UTC_TIME) {
        setStakePageOverride(2);
      } else {
        setStakePageOverride(3);
      }
    } else {
      setStakePageOverride(1);
    }
  }, [userMint, userStake]);

  return (
    <div className="btm-nav lg:hidden">
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
            <span className="btm-nav-label">{item.name}</span>

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
