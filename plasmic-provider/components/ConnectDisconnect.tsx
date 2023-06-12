import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { Button } from "reef-knot/ui-react";
import { useDisconnect } from "reef-knot/web3-react";
import { WalletsModalForEth } from "reef-knot/connect-wallet-modal";
import { useState } from "react";
import { useAccount } from "wagmi";
import dynamic from "next/dynamic";

export const registerConnectDisconnectComponent = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerComponent(ConnectDisconnect, {
    name: "ReefKnot/ConnectDisconnect",
    displayName: "ConnectDisconnect",
    importName: 'ConnectDisconnect',
    importPath: 'lido-plasmic/plasmic-provider/components',
    props: {}
  });
}
export const ConnectDisconnect = dynamic(() => Promise.resolve(ConnectDisconnectClient), {ssr: false})

const ConnectDisconnectClient = () => {
  const [opened, setOpened] = useState(false);
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  return (
    <>
      {
        isConnected
          ? <>
            <Button
              style={{ width: "200px", marginTop: "10px", alignSelf: "center" }}
              variant="text"
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </>
          : <Button
            style={{ width: "300px", alignSelf: "center" }}
            onClick={() => setOpened(true)}
          >
            Connect wallet
          </Button>
      }
      <WalletsModalForEth
        open={opened}
        onClose={() => setOpened(false)}
      />
    </>
  );
};

