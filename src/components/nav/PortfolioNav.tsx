import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { clsx } from "clsx";

const PortfolioNav: NextPage = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="tabs">
      <Link
        href="/portfolio/balance"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/portfolio/balance",
        })}>
        
          Balance
        
      </Link>
      <Link
        href="/portfolio/calendar"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/portfolio/calendar",
        })}>
        
          Calendar
        
      </Link>
      <Link
        href="/portfolio/manage"
        className={clsx("tab tab-lg tab-lifted text-neutral", {
          "tab-active glass": pathname == "/portfolio/manage",
        })}>
        
          Manage
        
      </Link>
    </div>
  );
};

export default PortfolioNav;
