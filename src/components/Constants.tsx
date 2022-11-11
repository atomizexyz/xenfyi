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

import {
  EthereumIcon,
  PulseChainIcon,
  PolygonIcon,
  AvalancheIcon,
  BinanceSmartChainIcon,
  EthereumPOWIcon,
  EVMOSIcon,
  MoonbeamIcon,
  FantomIcon,
  DogeChainIcon,
  OKChainIcon,
} from "~/components/ChainIcons";

export const chainIcons: Record<number, JSX.Element> = {
  1: <EthereumIcon />,
  5: <EthereumIcon />,
  56: <BinanceSmartChainIcon />,
  66: <OKChainIcon />,
  97: <BinanceSmartChainIcon />,
  137: <PolygonIcon />,
  250: <FantomIcon />,
  941: <PulseChainIcon />,
  1284: <MoonbeamIcon />,
  2000: <DogeChainIcon />,
  9001: <EVMOSIcon />,
  10001: <EthereumPOWIcon />,
  43114: <AvalancheIcon />,
  80001: <PolygonIcon />,
};

export const navigationItems = [
  {
    id: 0,
    t: "dashboard.title",
    icon: <ViewGridIcon className="h-5 w-5" />,
    href: "/dashboard",
    canDisable: false,
  },
  {
    id: 1,
    t: "mint.title",
    icon: <DiamondIcon />,
    href: "/mint",
    canDisable: true,
  },
  {
    id: 2,
    t: "stake.title",
    icon: <LockClosedIcon className="h-5 w-5" />,
    href: "/stake",
    canDisable: true,
  },
];

export const textLinkItems = [
  {
    name: "Developer",
    t: "link.developer",
    href: "http://twitter.com/joeblau",
  },

  {
    name: "Website Source Code",
    t: "link.website-source-code",
    href: "https://github.com/atomizexyz/xenfyi",
  },
];

export const linkItems = [
  {
    name: "Whitepaper",
    t: "link.whitepaper",
    icon: <DocumentTextIcon className="h-5 w-5" />,
    href: "https://faircrypto.org/xencryptolp.pdf",
  },
  {
    name: "Docs",
    t: "link.docs",
    icon: <BookOpenIcon className="h-5 w-5" />,
    href: "https://xensource.gitbook.io/www.xenpedia.io/",
  },
  {
    name: "Twitter",
    t: "link.twitter",
    icon: <TwitterIcon />,
    href: "https://twitter.com/XEN_Crypto",
  },
  {
    name: "Telegram",
    t: "link.telegram",
    icon: <TelegramIcon />,
    href: "https://t.me/XENCryptoTalk",
  },
  {
    name: "Discord",
    t: "link.discord",
    icon: <DiscordIcon />,
    href: "https://discord.gg/rcAhrKWJb6",
  },
  {
    name: "GitHub",
    t: "link.github",
    icon: <GitHubIcon />,
    href: "https://github.com/FairCrypto",
  },
  {
    name: "CoinMarketCap",
    t: "link.coinmarketcap",
    icon: <CoinmarketCapIcon />,
    href: "https://coinmarketcap.com/currencies/xen-crypto/",
  },
  {
    name: "Dune Analytics",
    t: "link.dune",
    icon: <DuneIcon />,
    href: "https://dune.com/sixdegree/xen-crypto-overview",
  },
];
