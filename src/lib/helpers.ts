import { daysSince } from "~/components/StatCards";
import { BigNumber, ethers } from "ethers";

export const UTC_TIME = new Date().getTime() / 1000;
const WITHDRAWAL_WINDOW_DAYS = 7;
const MAX_PENALTY_PCT = 99;
const DAYS_IN_YEAR = 365;
export const WALLET_ADDRESS_REGEX = new RegExp(
  `^(0x[0-9a-fA-F]{40})(,0x[0-9a-fA-F]{40})*$`
);

export const MAX_PROFILE_WALLETS = 20;
export const DONATION_ADDRESS = "0x06e50E3802cC7A8990Fd7624dB6216138375a709";

export const formatDecimals = (
  value: number,
  decimals: number,
  suffix?: string
) => {
  return (
    value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + (suffix ? ` ${suffix}` : "")
  );
};

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

export const estimatedXEN = (data?: UserMint, globalRank: number) => {
  if (data) {
    const EAA = 0.1 - 0.001 * (data.rank / 1e5);
    const XEN =
      Math.log2(globalRank - data.rank) *
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

export interface FeeData {
  gas: BigNumber;
  transaction: BigNumber;
}

export const toGwei = (value: BigNumber) => {
  return Number(ethers.utils.formatUnits(value, "gwei"));
};

export const gasCalculator = (fee?: FeeData) => {
  if (fee) {
    const totalFee = fee.gas.mul(fee.transaction);
    const totalFeeGwei = toGwei(totalFee);
    return formatDecimals(totalFeeGwei, 0, "gwei");
  }
  return formatDecimals(0, 0, "gwei");
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

export const estimatedStakeRewardXEN = (data: UserStake) => {
  const amount = Number(ethers.utils.formatUnits(data.amount ?? 0, 18));
  if (data.maturityTs != 0 && UTC_TIME > data.maturityTs) {
    const rate = (data.apy * data.term * 1_000_000) / DAYS_IN_YEAR;
    const totalReward = (data.amount * rate) / 100_000_000 / 1e18;
    const progress = progressDays(data.maturityTs, data.term);

    return amount + (progress / data.term) * totalReward;
  }
  return amount;
};

export const formatFullDate = (date: number) => {
  const d = new Date(date * 1000);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = `0${d.getDate()}`.slice(-2);
  const hour = `0${d.getHours()}`.slice(-2);
  const minute = `0${d.getMinutes()}`.slice(-2);
  const second = `0${d.getSeconds()}`.slice(-2);
  return `${year}/${month}/${_date} ${hour}:${minute}:${second}`;
};

export const formatDate = (date: number) => {
  const d = new Date(date * 1000);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const _date = `0${d.getDate()}`.slice(-2);
  return `${year}/${month}/${_date}`;
};

export const formatTime = (date: number) => {
  const d = new Date(date * 1000);
  const hour = `0${d.getHours()}`.slice(-2);
  const minute = `0${d.getMinutes()}`.slice(-2);
  const second = `0${d.getSeconds()}`.slice(-2);
  return `${hour}:${minute}:${second}`;
};
