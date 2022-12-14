import walletconnectLogo from "./assets/walletconnect-logo.png";
import { SUPPORTED_CHAINS } from "../constraints/chains";
import {
  MAINNET_CHAIN_ID,
  GOERLI_CHAIN_ID,
  ETH_STANDARD_PATH,
} from "../constraints/default";
import { getRpcEngine } from "../engines";
import { IChainData, IRpcEngine, IAppEvents } from "../helpers/types";
export interface IAppConfig {
  name: string;
  logo: string;
  chainId: number;
  derivationPath: string;
  numberOfAccounts: number;
  colors: {
    defaultColor: string;
    backgroundColor: string;
  };
  chains: IChainData[];
  styleOpts: {
    showPasteUri: boolean;
    showVersion: boolean;
  };
  rpcEngine: IRpcEngine;
  events: IAppEvents;
}


export const appConfig: IAppConfig = {
  name: "WalletConnect",
  logo: walletconnectLogo,
  // Change this to change to testnet
  chainId: GOERLI_CHAIN_ID,
  derivationPath: ETH_STANDARD_PATH,
  numberOfAccounts: 3,
  colors: {
    defaultColor: "12, 12, 13",
    backgroundColor: "40, 44, 52",
  },
  chains: SUPPORTED_CHAINS,
  styleOpts: {
    showPasteUri: true,
    showVersion: true,
  },
  rpcEngine: getRpcEngine(),
  events: {
    init: (state, setState) => Promise.resolve(),
    update: (state, setState) => Promise.resolve(),
  },
};

export function getAppConfig(): IAppConfig {
  return appConfig;
}
