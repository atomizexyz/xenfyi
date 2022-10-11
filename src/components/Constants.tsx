import {
  BookOpenIcon,
  ViewGridIcon,
  LockClosedIcon,
  DocumentTextIcon,
} from "@heroicons/react/outline";
import {
  DuneIcon,
  TwitterIcon,
  TelegramIcon,
  GitHubIcon,
  DiamondIcon,
  DiscordIcon,
  CoinmarketCapIcon,
} from "~/components/Icons";

export const navigationItems = [
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

export const textLinkItems = [
  {
    name: "Developer",
    href: "http://twitter.com/joeblau",
  },

  {
    name: "Website Source Code",
    href: "https://github.com/joeblau/xenfyi",
  },
];

export const linkItems = [
  {
    name: "Whitepaper",
    icon: <DocumentTextIcon className="h-5 w-5" />,
    href: "https://faircrypto.org/xencryptolp.pdf",
  },
  {
    name: "Docs",
    icon: <BookOpenIcon className="h-5 w-5" />,
    href: "https://xensource.gitbook.io/www.xenpedia.io/",
  },
  {
    name: "Twitter",
    icon: <TwitterIcon />,
    href: "https://twitter.com/XEN_Crypto",
  },
  {
    name: "Telegram",
    icon: <TelegramIcon />,
    href: "https://t.me/XENCryptoTalk",
  },
  {
    name: "Discord",
    icon: <DiscordIcon />,
    href: "https://discord.gg/rcAhrKWJb6",
  },
  {
    name: "GitHub",
    icon: <GitHubIcon />,
    href: "https://github.com/FairCrypto",
  },
  {
    name: "CoinMarketCap",
    icon: <CoinmarketCapIcon />,
    href: "https://coinmarketcap.com/currencies/xen-crypto/",
  },
  {
    name: "Dune Analytics",
    icon: <DuneIcon />,
    href: "https://dune.com/sixdegree/xen-crypto-overview",
  },
];
