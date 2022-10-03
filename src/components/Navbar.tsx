import { ConnectKitButton } from "connectkit";
import { InjectedConnector } from "wagmi/connectors/injected";
import Link from "next/link";
import {
  MoonIcon,
  SunIcon,
  BookOpenIcon,
  MenuIcon,
  DotsVerticalIcon,
  ViewGridIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import {
  TwitterIcon,
  TelegramIcon,
  GitHubIcon,
  Diamond,
  SmartContraact,
  Wallet,
} from "./Icons";
import Avatar from "boring-avatars";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { clsx } from "clsx";
import { useAccount } from "wagmi";

const navigationItems = [
  {
    name: "Dashboard",
    icon: <ViewGridIcon className="h-5 w-5" />,
    href: "/",
  },
  {
    name: "Mint",
    icon: <Diamond />,
    href: "/mint",
  },
  {
    name: "Stake",
    icon: <LockClosedIcon className="h-5 w-5" />,
    href: "/stake",
  },
];

const linkItems = [
  {
    name: "Docs",
    icon: <BookOpenIcon className="h-5 w-5" />,
    href: "https://xensource.gitbook.io/www.xenpedia.io/",
  },
  {
    name: "Twitter",
    icon: <TwitterIcon />,
    href: "https://twitter.com/XEN_Crypto​",
  },
  {
    name: "Telegram",
    icon: <TelegramIcon />,
    href: "https://t.me/XENCryptoTalk",
  },
  {
    name: "GitHub",
    icon: <GitHubIcon />,
    href: "https://github.com/FairCrypto",
  },
  {
    name: "Contract",
    icon: <SmartContraact />,
    href: "https://scan.v2b.testnet.pulsechain.com/address/0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
  },
];

const Navbar = () => {
  const router = useRouter();
  const { connector, address } = useAccount();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const NavigationItems = () => {
    return (
      <>
        {navigationItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              onClick={() => {
                (document.activeElement as HTMLElement).blur();
              }}
            >
              <a
                className={clsx("text-neutral", {
                  "btn-disabled": router.pathname == item.href,
                })}
                // onclick blur to remove focus
              >
                {item.icon}
                {item.name}
              </a>
            </Link>
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="navbar">
      <div className="navbar-start space-x-2">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-square glass lg:hidden text-neutral"
          >
            <MenuIcon className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow glass rounded-box w-52 space-y-1"
          >
            <NavigationItems />
          </ul>
        </div>
        <a className="text-neutral normal-case text-3xl font-light">XEN</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal glass rounded-box p-2 space-x-2">
          <NavigationItems />
        </ul>
      </div>
      <div className="navbar-end space-x-2">
        <ConnectKitButton.Custom>
          {({ isConnected, show, address, truncatedAddress }) => {
            return (
              <button onClick={show} className="btn glass text-neutral">
                {isConnected ? (
                  <div className="flex space-x-2 items-center">
                    <Avatar size={24} name={address} variant="marble" />
                    <pre className="text-base font-light">
                      {truncatedAddress}
                    </pre>
                  </div>
                ) : (
                  "Connect Wallet"
                )}
              </button>
            );
          }}
        </ConnectKitButton.Custom>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn glass btn-square text-neutral">
            <DotsVerticalIcon className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content glass rounded-box w-52 space-y-1"
          >
            <li>
              <label className="flex swap swap-rotate justify-between text-neutral">
                Theme
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
            <li>
              <button
                className="justify-between text-neutral"
                onClick={() => {
                  (connector as InjectedConnector)?.watchAsset?.({
                    address: "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB",
                    decimals: 18,
                    image: "https://xen.fyi/images/xen.png",
                    symbol: "XEN",
                  });
                  (document.activeElement as HTMLElement).blur();
                }}
              >
                Add XEN to Wallet
                <Wallet />
              </button>
            </li>
            {linkItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href ?? "/"}
                  onClick={() => {
                    (document.activeElement as HTMLElement).blur();
                  }}
                >
                  <a className="justify-between text-neutral">
                    {item.name}
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

export default Navbar;
