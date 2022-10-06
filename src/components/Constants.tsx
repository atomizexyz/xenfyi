import {
  MoonIcon,
  SunIcon,
  BookOpenIcon,
  DotsVerticalIcon,
  ViewGridIcon,
  LockClosedIcon,
  GiftIcon,
} from "@heroicons/react/outline";
import {
  TwitterIcon,
  TelegramIcon,
  GitHubIcon,
  DiamondIcon,
  WalletIcon,
  DiscordIcon,
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
