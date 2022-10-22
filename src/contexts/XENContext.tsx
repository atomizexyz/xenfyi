import React, { createContext, useState } from "react";
import {
  Chain,
  useToken,
  useBalance,
  useAccount,
  useNetwork,
  useContractRead,
  useContractReads,
} from "wagmi";
import { chainList } from "~/lib/client";
import { xenContract } from "~/lib/xen-contract";

interface UserMint {
  user: string;
  amplifier: BigNumber;
  eaaRate: BigNumber;
  maturityTs: BigNumber;
  rank: BigNumber;
  term: BigNumber;
}

interface UserStake {
  amount: BigNumber;
  apy: BigNumber;
  maturityTs: BigNumber;
  term: BigNumber;
}

const XENContext = createContext({
  setChainOverride: (chain?: Chain) => {},
  userMint: null,
  userStake: null,
  xenBalance: 0,
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
  token: null,
});

export const XENProvider = ({ chainId, children }) => {
  const [chainOverride, setChainOverride] = useState<Chain>();
  const [userMint, setUserMint] = useState<UserMint>();
  const [userStake, setUserStake] = useState<UserStake>();
  const [xenBalance, setXenBalance] = useState(0);
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
  const [token, setToken] = useState<any>();

  const { address } = useAccount();
  const { chain: networkChain } = useNetwork();

  const chain = chainOverride ?? networkChain ?? chainList[0];

  useBalance({
    ...xenContract(chain),
    onSuccess(data) {
      setXenBalance(data);
    },
    // watch: true,
  });

  useContractRead({
    ...xenContract(chain),
    functionName: "getUserMint",
    overrides: { from: address },
    onSuccess(data) {
      setUserMint(data);
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
      setUserStake(data);
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
          Number(globalRank) - (userMint?.rank ?? 0),
          Number(userMint?.amplifier ?? 0),
          Number(userMint?.term ?? 0),
          1000 + Number(userMint?.eaaRate ?? 0),
        ],
        enable: userMint != null,
      },
    ],

    onSuccess(data) {
      setGlobalRank(Number(data[0]));
      setActiveMinters(Number(data[1]));
      setActiveStakes(Number(data[2]));
      setTotalXenStaked(Number(data[3]));
      setTotalSupply(Number(data[4]));
      setGenesisTs(Number(data[5]));
      setCurrentMaxTerm(Number(data[6]));
      setCurrentAMP(Number(data[7]));
      setCurrentEAAR(Number(data[8]));
      setCurrentAPY(Number(data[9]));
      setGrossReward(Number(data[10]));
    },
    cacheOnBlock: true,
    // watch: true,
  });

  useToken({
    address: xenContract(chain).address,
    onSuccess(data) {
      setToken(data);
    },
  });

  return (
    <XENContext.Provider
      value={{
        setChainOverride,
        userMint,
        userStake,
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
