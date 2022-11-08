import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { clsx } from "clsx";

const PortfolioNav: NextPage = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="tabs">
      <Link href="/portfolio/balance">
        <a
          className={clsx("tab tab-lg tab-lifted text-neutral", {
            "tab-active glass": pathname == "/portfolio/balance",
          })}
        >
          Balance
        </a>
      </Link>
      <Link href="/portfolio/calendar">
        <a
          className={clsx("tab tab-lg tab-lifted text-neutral", {
            "tab-active glass": pathname == "/portfolio/calendar",
          })}
        >
          Calendar
        </a>
      </Link>
      <Link href="/portfolio/manage">
        <a
          className={clsx("tab tab-lg tab-lifted text-neutral", {
            "tab-active glass": pathname == "/portfolio/manage",
          })}
        >
          Manage
        </a>
      </Link>
    </div>
  );
};

export default PortfolioNav;
