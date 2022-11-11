import { UniswapPairSettings, UniswapVersion } from "simple-uniswap-sdk";

interface DexNetwork {
  stableAddress: string;
  uniswapPairSettings?: UniswapPairSettings;
}

export const dexes: Record<number, DexNetwork> = {
  1: {
    stableAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  },
  56: {
    stableAddress: "0x55d398326f99059fF775485246999027B3197955", // USDT
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
          factoryAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
          pairAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        },
      },
      customNetwork: {
        nameNetwork: "Binance Smart Chain",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "BNB Token",
          symbol: "BNB",
        },
        nativeWrappedTokenInfo: {
          chainId: 56,
          contractAddress: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          decimals: 18,
          symbol: "WBNB",
          name: "Wrapped BNB",
        },
      },
    }),
  },
  137: {
    stableAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
          factoryAddress: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
          pairAddress: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
        },
        v3Override: {
          routerAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
          factoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
          quoterAddress: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
        },
      },
      customNetwork: {
        nameNetwork: "Polygon",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "Matic Token",
          symbol: "MATIC",
        },
        nativeWrappedTokenInfo: {
          chainId: 137,
          contractAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
          decimals: 18,
          symbol: "WMATIC",
          name: "Wrapped Matic",
        },
      },
    }),
  },
  250: {
    stableAddress: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // USDC
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
          factoryAddress: "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3",
          pairAddress: "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3",
        },
      },
      customNetwork: {
        nameNetwork: "Fantom",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "Fantom",
          symbol: "FTM",
        },
        nativeWrappedTokenInfo: {
          chainId: 250,
          contractAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
          decimals: 18,
          symbol: "WFTM",
          name: "Wrapped FTM",
        },
      },
    }),
  },
  1284: {
    stableAddress: "0x931715FEE2d06333043d11F658C8CE934aC61D0c", // USDT
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0x70085a09D30D6f8C4ecF6eE10120d1847383BB57",
          factoryAddress: "0x68A384D826D3678f78BB9FB1533c7E9577dACc0E",
          pairAddress: "0x68A384D826D3678f78BB9FB1533c7E9577dACc0E",
        },
      },
      customNetwork: {
        nameNetwork: "Moonbeam",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "Glimmer",
          symbol: "GLMR",
        },
        nativeWrappedTokenInfo: {
          chainId: 1284,
          contractAddress: "0xAcc15dC74880C9944775448304B263D191c6077F",
          decimals: 18,
          symbol: "WGLMR",
          name: "Wrapped GLMR",
        },
      },
    }),
  },
  9001: {
    stableAddress: "0x7FF4a56B32ee13D7D4D405887E0eA37d61Ed919e", // USDT
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0xFCd2Ce20ef8ed3D43Ab4f8C2dA13bbF1C6d9512F",
          factoryAddress: "0x6abdda34fb225be4610a2d153845e09429523cd2",
          pairAddress: "0x6abdda34fb225be4610a2d153845e09429523cd2",
        },
      },
      customNetwork: {
        nameNetwork: "EVMOS",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "EVMOS",
          symbol: "EVMOS",
        },
        nativeWrappedTokenInfo: {
          chainId: 9001,
          contractAddress: "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517",
          decimals: 18,
          symbol: "WEVMOS",
          name: "Wrapped EVMOS",
        },
      },
    }),
  },
  10001: {
    stableAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0x6851e767Aaa9C4674Fe8cAE95AFCc819b7Fb0403",
          factoryAddress: "0x62009bD6349A3A1d7f1bcC7C69492Cd26F1FBF75",
          pairAddress: "0x62009bD6349A3A1d7f1bcC7C69492Cd26F1FBF75",
        },
      },
      customNetwork: {
        nameNetwork: "Ethereum PoW",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "ETHW",
          symbol: "ETHW",
        },
        nativeWrappedTokenInfo: {
          chainId: 10001,
          contractAddress: "0x7Bf88d2c0e32dE92CdaF2D43CcDc23e8Edfd5990",
          decimals: 18,
          symbol: "WETHW",
          name: "Wrapped ETHPoW",
        },
      },
    }),
  },
  43114: {
    stableAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC
    uniswapPairSettings: new UniswapPairSettings({
      cloneUniswapContractDetails: {
        v2Override: {
          routerAddress: "0x60aE616a2155Ee3d9A68541Ba4544862310933d4",
          factoryAddress: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
          pairAddress: "0x9Ad6C38BE94206cA50bb0d90783181662f0Cfa10",
        },
      },
      customNetwork: {
        nameNetwork: "Avalanche",
        multicallContractAddress: "0xcA11bde05977b3631167028862bE2a173976CA11",
        nativeCurrency: {
          name: "Avalance",
          symbol: "AVAX",
        },
        nativeWrappedTokenInfo: {
          chainId: 9001,
          contractAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
          decimals: 18,
          symbol: "WAVAX",
          name: "Wrapped AVAX",
        },
      },
    }),
  },
};
