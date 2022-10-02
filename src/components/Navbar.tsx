import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import {
  MoonIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  MenuIcon,
  DotsVerticalIcon,
  ViewGridIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import { TwitterIcon, TelegramIcon, GitHubIcon, Diamond, Event } from "./Icons";
import Avatar from "boring-avatars";

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
  {
    name: "Events",
    icon: <Event />,
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
  {
    name: "About",
    icon: <QuestionMarkCircleIcon className="h-5 w-5" />,
  },
];

const Navbar = () => {
  const NavigationItems = () => {
    return (
      <>
        {navigationItems.map((item, index) => (
          <li key={index}>
            <Link href={item.href}>
              <a className="text-neutral">
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
          <label tabIndex={0} className="btn glass lg:hidden text-neutral">
            <MenuIcon className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow glass rounded-box w-52 "
          >
            <NavigationItems />
          </ul>
        </div>
        <a className="text-neutral normal-case text-3xl font-light">XEN.fyi</a>
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
            <DotsVerticalIcon className="h-5 w-5" />
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
