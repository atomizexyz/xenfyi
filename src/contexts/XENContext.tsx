import React, { createContext, useState } from "react";
import {
  Chain,
  useToken,
  useFeeData,
  useBalance,
  useAccount,
  useNetwork,
  useContractRead,
  useContractReads,
} from "wagmi";
import { BigNumber } from "ethers";
import { chainList } from "~/lib/client";
import { xenContract } from "~/lib/xen-contract";

export interface UserMint {
  user: string;
  amplifier: BigNumber;
  eaaRate: BigNumber;
  maturityTs: BigNumber;
  rank: BigNumber;
  term: BigNumber;
}

export interface UserStake {
  amount: BigNumber;
  apy: BigNumber;
  maturityTs: BigNumber;
  term: BigNumber;
}

export interface Formatted {
  gasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface FeeData {
  formatted: Formatted;
  gasPrice: BigNumber;
  lastBaseFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
}

export interface TotalSupply {
  formatted: string;
  value: BigNumber;
}

export interface Token {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  totalSupply: TotalSupply;
}

export interface Balance {
  decimals: number;
  formatted: string;
  symbol: string;
  value: BigNumber;
}

interface IXENContext {
  setChainOverride: (chain: Chain) => void;
  userMint?: UserMint;
  userStake?: UserStake;
  feeData?: FeeData;
  xenBalance?: Balance;
  globalRank: number;
  activeMinters: number;
  activeStakes: number;
  totalXenStaked: number;
  totalSupply: number;
  genesisTs: number;
  currentMaxTerm: number;
  currentAMP: number;
  currentEAAR: number;
  currentAPY: number;
  grossReward: number;
  token?: Token;
}

const XENContext = createContext<IXENContext>({
  setChainOverride: (chain: Chain) => {},
  userMint: undefined,
  userStake: undefined,
  feeData: undefined,
  xenBalance: undefined,
  globalRank: 0,
  activeMinters: 0,
  activeStakes: 0,
  totalXenStaked: 0,
  totalSupply: 0,
  genesisTs: 0,
  currentMaxTerm: 0,
  currentAMP: 0,
  currentEAAR: 0,
  currentAPY: 0,
  grossReward: 0,
  token: undefined,
});

export const XENProvider = ({ children }: any) => {
  const [chainOverride, setChainOverride] = useState<Chain | undefined>();
  const [userMint, setUserMint] = useState<UserMint | undefined>();
  const [userStake, setUserStake] = useState<UserStake | undefined>();
  const [feeData, setFeeData] = useState<FeeData | undefined>();
  const [xenBalance, setXenBalance] = useState<Balance | undefined>();
  const [globalRank, setGlobalRank] = useState(0);
  const [activeMinters, setActiveMinters] = useState(0);
  const [activeStakes, setActiveStakes] = useState(0);
  const [totalXenStaked, setTotalXenStaked] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [genesisTs, setGenesisTs] = useState(0);
  const [currentMaxTerm, setCurrentMaxTerm] = useState(0);
  const [currentAMP, setCurrentAMP] = useState(0);
  const [currentEAAR, setCurrentEAAR] = useState(0);
  const [currentAPY, setCurrentAPY] = useState(0);
  const [grossReward, setGrossReward] = useState(0);
  const [token, setToken] = useState<Token | undefined>();

  const { address } = useAccount();
  const { chain: networkChain } = useNetwork();

  const chain = chainOverride ?? networkChain ?? chainList[0];

  useBalance({
    addressOrName: address,
    token: xenContract(chain).addressOrName,
    onSuccess(data) {
      setXenBalance({
        decimals: data.decimals,
        formatted: data.formatted,
        symbol: data.symbol,
        value: data.value,
      });
    },
    // watch: true,
  });

  useToken({
    address: xenContract(chain).addressOrName,
    chainId: chain?.id,
    onSuccess(data) {
      setToken({
        address: data.address,
        decimals: data.decimals,
        name: data.name,
        symbol: data.symbol,
        totalSupply: {
          formatted: data.totalSupply.formatted,
          value: data.totalSupply.value,
        },
      });
    },
  });

  useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    onSuccess(data) {
      setUserMint({
        user: data.user,
        amplifier: data.amplifier,
        eaaRate: data.eaaRate,
        maturityTs: data.maturityTs,
        rank: data.rank,
        term: data.term,
      });
    },
    enabled: address != null,
    cacheOnBlock: true,
    // watch: true,
  });

  useContractRead({
    ...xenContract(chain),
    functionName: "getUserStake",
    overrides: { from: address },
    onSuccess(data) {
      setUserStake({
        amount: data.amount,
        apy: data.apy,
        maturityTs: data.maturityTs,
        term: data.term,
      });
    },
    enabled: address != null,
    cacheOnBlock: true,
    // watch: true,
  });

  useContractReads({
    contracts: [
      {
        ...xenContract(chain),
        functionName: "globalRank",
      },
      {
        ...xenContract(chain),
        functionName: "activeMinters",
      },
      {
        ...xenContract(chain),
        functionName: "activeStakes",
      },
      {
        ...xenContract(chain),
        functionName: "totalXenStaked",
      },
      {
        ...xenContract(chain),
        functionName: "totalSupply",
      },
      {
        ...xenContract(chain),
        functionName: "genesisTs",
      },
      {
        ...xenContract(chain),
        functionName: "getCurrentMaxTerm",
      },
      {
        ...xenContract(chain),
        functionName: "getCurrentAMP",
      },
      {
        ...xenContract(chain),
        functionName: "getCurrentEAAR",
      },
      {
        ...xenContract(chain),
        functionName: "getCurrentAPY",
      },
      {
        ...xenContract(chain),
        functionName: "getGrossReward",
        args: [
          Number(globalRank) - (userMint?.rank.toNumber() ?? 0),
          Number(userMint?.amplifier ?? 0),
          Number(userMint?.term ?? 0),
          1000 + Number(userMint?.eaaRate ?? 0),
        ],
      },
    ],
    onSuccess(data) {
      setGlobalRank(Number(data[0]));
      setActiveMinters(Number(data[1]));
      setActiveStakes(Number(data[2]));
      setTotalXenStaked(Number(data[3]));
      setTotalSupply(Number(data[4]));
      setGenesisTs(Number(data[5]));
      setCurrentMaxTerm(Number(data[6] ?? 100 * 86400));
      setCurrentAMP(Number(data[7]));
      setCurrentEAAR(Number(data[8]));
      setCurrentAPY(Number(data[9]));
      setGrossReward(Number(data[10]));
    },
    cacheOnBlock: true,
    watch: true,
  });

  useFeeData({
    formatUnits: "gwei",
    onSuccess(data) {
      setFeeData({
        formatted: {
          gasPrice: data.formatted.gasPrice ?? "",
          maxFeePerGas: data.formatted.maxFeePerGas ?? "",
          maxPriorityFeePerGas: data.formatted.maxPriorityFeePerGas ?? "",
        },
        gasPrice: data.gasPrice ?? BigNumber.from(0),
        lastBaseFeePerGas: data.lastBaseFeePerGas ?? BigNumber.from(0),
        maxFeePerGas: data.maxFeePerGas ?? BigNumber.from(0),
        maxPriorityFeePerGas: data.maxPriorityFeePerGas ?? BigNumber.from(0),
      });
    },
    // watch: true,
  });

  return (
    <XENContext.Provider
      value={{
        setChainOverride,
        userMint,
        userStake,
        feeData,
        xenBalance,
        globalRank,
        activeMinters,
        activeStakes,
        totalXenStaked,
        totalSupply,
        genesisTs,
        currentMaxTerm,
        currentAMP,
        currentEAAR,
        currentAPY,
        grossReward,
        token,
      }}
    >
      {children}
    </XENContext.Provider>
  );
};

export default XENContext;
