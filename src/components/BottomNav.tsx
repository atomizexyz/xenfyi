import Link from "next/link";
import { ViewGridIcon, LockClosedIcon } from "@heroicons/react/outline";
import { DiamondIcon } from "./Icons";
import { xenContract } from "~/lib/xen-contract";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { useState, useEffect } from "react";

const navigationItems = [
  {
    id: 0,
    name: "Dashboard",
    icon: <ViewGridIcon className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    id: 1,
    name: "Mint",
    icon: <DiamondIcon />,
    href: "/mint",
  },
  {
    id: 2,
    name: "Stake",
    icon: <LockClosedIcon className="h-5 w-5" />,
    href: "/stake",
  },
];

const BottomNav = () => {
  const router = useRouter();
  const { chain } = useNetwork();
  const [mintPageOverride, setMintPageOverride] = useState(1);
  const [stakePageOverride, setStakePageOverride] = useState(1);
  const { address } = useAccount();

  const { data: userMint } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    watch: true,
  });

  const { data: userStake } = useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
    watch: true,
  });

  useEffect(() => {
    if (userMint && !userMint.term.isZero()) {
      setMintPageOverride(2);
      if (userMint.maturityTs < Date.now() / 1000) {
        setMintPageOverride(3);
      }
    }
    if (userStake && !userStake.term.isZero()) {
      setStakePageOverride(2);
      if (userStake.maturityTs < Date.now() / 1000) {
        setStakePageOverride(3);
      }
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
            {((item.id == 1 && mintPageOverride == 2) ||
              (item.id == 2 && stakePageOverride == 2)) && (
              <div className="absolute badge badge-lg -top-3 right-2 shadow-md glass">
                {item.id == 1 ? "💎" : "🔒"}
              </div>
            )}
          </a>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
