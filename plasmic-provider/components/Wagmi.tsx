import { FC, PropsWithChildren } from "react";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import * as chains from "wagmi/chains";
import { getConnectors } from "reef-knot/core-react";
import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { ProviderWeb3 } from "reef-knot/web3-react";
import { rpcUrls } from "./util/rpcUrls";

const connectors = getConnectors({ rpc: rpcUrls });

const emptyAccount = { address: undefined, isConnected: false, isConnecting: false, status: "disconnected", isDisconnected: true, isReconnecting: false }
const WagmiIsomorphic: FC<PropsWithChildren<{ networks?: Array<keyof typeof chains> }>> = ({children, networks}) => {
  if (typeof window !== undefined) {
    return <Wagmi networks={networks}>
      {children}
    </Wagmi>
  }
  return <DataProvider
    name="account"
    data={emptyAccount}
  >
    {children}
  </DataProvider>;
}
const WagmiDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address, isConnected, isConnecting, status, isDisconnected, isReconnecting } = useAccount();
  return <DataProvider
    name="account"
    data={{ address, isConnected, isConnecting, status, isDisconnected, isReconnecting }}
  >
    {children}
  </DataProvider>;
};


export const Wagmi: FC<PropsWithChildren<{ networks?: Array<keyof typeof chains> }>> =
  ({
     children,
     networks = []
   }) => {
    if (networks.length === 0) {
      return <DataProvider name="account" data={emptyAccount}>{children}</DataProvider>;
    }

    const networkConfigs = networks.map(n => chains[n]);

    const client = createClient({
      connectors,
      autoConnect: true,
      ...configureChains(
        networkConfigs,
        [publicProvider()]
      )
    });
    const chainIds = networkConfigs.map(config => config.id);
    const defaultChainId = networkConfigs[0].id;

    return <WagmiConfig client={client}>
      {/* @ts-expect-error react 18 type issue */}
      <ProviderWeb3
        defaultChainId={defaultChainId}
        supportedChainIds={chainIds}
        rpc={rpcUrls}
      >
        <WagmiDataProvider>
          {children}
        </WagmiDataProvider>
      </ProviderWeb3>
    </WagmiConfig>;
  };

// todo walletConnectProjectId prop
export const registerWagmi = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerGlobalContext(WagmiIsomorphic, {
    name: "Wagmi",
    providesData: true,
    props: {
      network: {
        type: "choice",
        multiSelect: true,
        options: Object.keys(chains)
      }
    }
  });
};
