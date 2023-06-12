import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { DataProvider } from "@plasmicapp/loader-nextjs";
import { FC, PropsWithChildren, useMemo } from "react";
import { WagmiConfig, configureChains, createClient, useAccount } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import * as chains from "wagmi/chains";
import { Chain } from "wagmi/chains";
import { getConnectors } from "reef-knot/core-react";
import { ProviderWeb3 } from "reef-knot/web3-react";
import { rpcUrls } from "./util/rpcUrls";

export const registerReefKnotProvider = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerGlobalContext(ReefKnotProvider, {
    name: "ReefKnot",
    importName: "ReefKnotProvider",
    importPath: "lido-plasmic/plasmic-provider/components",
    providesData: true,
    props: {
      network: {
        type: "choice",
        multiSelect: false,
        options: Object.keys(chains)
      }
    }
  });
};

const connectors = getConnectors({ rpc: rpcUrls });

const emptyAccount = {
  address: undefined,
  isConnected: false,
  isConnecting: false,
  status: "disconnected",
  isDisconnected: true,
  isReconnecting: false
};
export const ReefKnotProvider = ({ children, network }: PropsWithChildren<{ network?: keyof typeof chains }>) =>
  typeof window !== undefined
    ? <WagmiProvider network={network}>{children}</WagmiProvider>
    : <DataProvider name="account" data={emptyAccount}>{children}</DataProvider>;

const WagmiDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address, isConnected, isConnecting, status, isDisconnected, isReconnecting } = useAccount();
  return <DataProvider
    name="account"
    data={{ address, isConnected, isConnecting, status, isDisconnected, isReconnecting }}
  >{children}</DataProvider>;
};

const WagmiProvider: FC<PropsWithChildren<{ network?: keyof typeof chains }>> =
  ({ children, network }) => {
    const [networkConfigs, client] = useMemo(() => {
      const networkConfig = network ? (chains as Record<keyof typeof chains, Chain>)[network] : null;
      return !networkConfig
        ? [[], null] as const
        : [
          [networkConfig],
          createClient({
            connectors,
            autoConnect: true,
            ...configureChains(
              [networkConfig],
              [publicProvider()]
            )
          })
        ] as const;
    }, [network]);

    return !client
      ? <DataProvider name="account" data={emptyAccount}>{children}</DataProvider>
      : <WagmiConfig client={client}>
        {/* @ts-expect-error react 18 type issue */}
        <ProviderWeb3
          defaultChainId={networkConfigs[0].id}
          supportedChainIds={networkConfigs.map(({ id }) => id)}
          rpc={rpcUrls}
        >
          <WagmiDataProvider>
            {children}
          </WagmiDataProvider>
        </ProviderWeb3>
      </WagmiConfig>;

  };

