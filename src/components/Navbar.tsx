import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import {
  MoonIcon,
  BeakerIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { TwitterIcon, TelegramIcon, GitHubIcon } from "./Icons";
import Avatar from "boring-avatars";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Mint",
    href: "/mint",
  },
  {
    name: "Stake",
    href: "/stake",
  },
  {
    name: "Events",
    href: "/events",
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
    href: "https://twitter.com/xen_fyi",
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
];

const Navbar = () => {
  const NavigationItems = () => {
    return (
      <>
        {navigationItems.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>
              <a className="text-neutral">{item.name}</a>
            </Link>
          </li>
        ))}
      </>
    );
  };

  return (
    <div className="navbar">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn glass lg:hidden text-neutral">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow glass rounded-box w-52 "
          >
            <NavigationItems />
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-3xl font-light">XEN</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal glass rounded-box p-2">
          <NavigationItems />
        </ul>
      </div>
      <div className="navbar-end space-x-2">
        <ConnectKitButton.Custom>
          {({
            isConnected,
            isConnecting,
            show,
            hide,
            address,
            truncatedAddress,
            ensName,
          }) => {
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content glass rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Theme <MoonIcon className="h-5 w-5" />
              </a>
            </li>
            {linkItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href ?? ""}>
                  <a className="justify-between">
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
