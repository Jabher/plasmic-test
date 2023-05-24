import * as ui from "@lidofinance/lido-ui";
import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { useAccount } from "wagmi";

export const registerAddress = (plasmic: NextJsPlasmicComponentLoader) => {
  const CurrentAddress = ({ symbols, ...rest }: { symbols?: number }) => {
    const account = useAccount();
    if (!account || !account.address) {
      return <pre>missing account data; check provider connection</pre>;
    }
    return <ui.Address address={account.address} symbols={symbols} {...rest} />;
  };
  const Address = ({ address, ...rest }: { address?: string, symbols?: number }) => {
    if (address) {
      return <ui.Address address={address} {...rest} />;
    } else {
      return <CurrentAddress {...rest} />;
    }
  };
  plasmic.registerComponent(Address, {
    name: `Lido/Address`,
    displayName: `Address`,
    props: {
      "address": {
        "type": "string"
      },
      "symbols": {
        "type": "number",
        "min": 3,
        "max": 21,
        "step": 1
      }
    }
  });

  plasmic.registerComponent(ui.AddressBadge, {
    name: "Lido/AddressBadge",
    displayName: "AddressBadge",
    props: {
      "address": {
        "type": "string"
      },
      "symbolsMobile": {
        "type": "number",
        "min": 3,
        "max": 21,
        "step": 1
      },
      "symbolsDesktop": {
        "type": "number",
        "min": 3,
        "max": 21,
        "step": 1
      }
    }
  });

};
