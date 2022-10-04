export const daysRemaining = (timestamp?: number) => {
  if (timestamp && timestamp > 0) {
    return (Number(timestamp) - Date.now() / 1000) / 86400;
  } else {
    return 0;
  }
};

export const percentComplete = (daysRemaining: number, term?: number) => {
  if (term && term > 0) {
    return term - daysRemaining;
  } else {
    return 0;
  }
};

export interface MintData {
  amplifier: number;
  eaaRate: number;
  maturityTs: number;
  rank: number;
  term: number;
  user: string;
  globalRank: number;
  genesisTs: number;
}

export const estimatedXEN = (data?: MintData) => {
  if (data) {
    const EEA = 0.1 - 0.001 * (data.rank / 1e5);

    const XEN =
      Math.log2(data.globalRank - data.rank) *
      data.term *
      data.amplifier *
      (1 + EEA);
    return XEN;
  } else {
    return 0;
  }
};
