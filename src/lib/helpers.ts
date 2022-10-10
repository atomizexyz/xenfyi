import { daysSince } from "~/components/StatCards";
import { ethers } from "ethers";

export const UTC_TIME = new Date().getTime() / 1000;
const WITHDRAWAL_WINDOW_DAYS = 7;
const MAX_PENALTY_PCT = 99;
const DAYS_IN_YEAR = 365;
export const WALLET_ADDRESS_REGEX = new RegExp(
  `^(0x[0-9a-fA-F]{40})(,0x[0-9a-fA-F]{40})*$`
);
export const DONATION_ADDRESS = "0x806F5d470ee7dd7B7a8CEB092D3fA7ef00A70576";

export const daysRemaining = (timestamp?: number) => {
  if (timestamp && timestamp > 0) {
    return (Number(timestamp) - UTC_TIME) / 86400;
  } else {
    return 0;
  }
};

export const progressDays = (maturityTs: number, term: number) => {
  if (maturityTs > 0 && term > 0) {
    const startTs = maturityTs - term * 86400;
    const progress = (UTC_TIME - startTs) / 86400;
    return progress;
  }
  return 0;
};

export interface MintData {
  amplifier: number; // use
  rank: number; // used
  term: number; // term
  globalRank: number; // used
  eaaRate?: number;
  maturityTs?: number;
  user?: string;
  genesisTs?: number;
}

export const estimatedXEN = (data?: MintData) => {
  if (data) {
    const EAA = 0.1 - 0.001 * (data.rank / 1e5);

    const XEN =
      Math.log2(data.globalRank - data.rank) *
      data.term *
      data.amplifier *
      (1 + EAA);

    return XEN;
  } else {
    return 0;
  }
};

interface StakeData {
  xenBalance: number;
  genesisTs: number;
  term: number;
  apy: number;
}

export const stakeYield = (data?: StakeData) => {
  if (data) {
    const ds = daysSince(data.genesisTs * 1000);
    const y = (data.xenBalance * data.apy * data.term) / (100 * 365);
    return y;
  } else {
    return 0;
  }
};

export const gasCalculator = (gwei: number) => {
  return ethers.utils.formatUnits(gwei, "gwei");
};

interface MintRewardData {
  maturityTs: number;
  grossReward: number;
}

export const mintPenalty = (maturityTs: number) => {
  const daysLate = (UTC_TIME - maturityTs) / 86400;
  if (daysLate > 1) {
    if (daysLate > WITHDRAWAL_WINDOW_DAYS - 1) return MAX_PENALTY_PCT;
    const penalty = (1 << (daysLate + 3)) / WITHDRAWAL_WINDOW_DAYS - 1;
    return Math.min(penalty, MAX_PENALTY_PCT);
  }
  return 0;
};

export const calculateMintReward = (data: MintRewardData) => {
  return (data.grossReward * (100 - mintPenalty(data.maturityTs))) / 100;
};

export interface StakeRewardData {
  maturityTs: number;
  term: number;
  amount: number;
  apy: number;
}

export const calculateStakeReward = (data: StakeRewardData) => {
  if (UTC_TIME > data.maturityTs) {
    const rate = (data.apy * data.term * 1_000_000) / DAYS_IN_YEAR;
    return (data.amount * rate) / 100_000_000 / 1e18;
  }
  return 0;
};

export const truncatedAddress = (address: string) => {
  return `${address.slice(0, 6)}••••${address.slice(-4)}`;
};

export const estimatedStakeRewardXEN = (data: StakeRewardData) => {
  const amount = Number(ethers.utils.formatUnits(data.amount ?? 0, 18));
  if (data.maturityTs != 0 && UTC_TIME > data.maturityTs) {
    console.log(UTC_TIME, data.maturityTs);

    const rate = (data.apy * data.term * 1_000_000) / DAYS_IN_YEAR;
    const totalReward = (data.amount * rate) / 100_000_000 / 1e18;
    const progress = progressDays(data.maturityTs, data.term);

    return amount + (progress / data.term) * totalReward;
  }
  return amount;
};
