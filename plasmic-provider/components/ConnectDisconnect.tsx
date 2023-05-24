import { Button } from "reef-knot/ui-react";
import { useDisconnect } from "reef-knot/web3-react";
import { WalletsModalForEth } from "reef-knot/connect-wallet-modal";
import { useState } from "react";
import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { useAccount } from "wagmi";

export const ConnectDisconnect = () => {
  console.log(typeof navigator !== "undefined" ? navigator : "navigator not found")
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


export const registerConnectDisconnect = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerComponent(ConnectDisconnect, {
    name: "ReefKnot/ConnectDisconnect",
    displayName: "ConnectDisconnect",
    props: {}
  });
};

