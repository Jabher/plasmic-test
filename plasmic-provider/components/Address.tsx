import * as ui from "@lidofinance/lido-ui";
import { useAccount } from "wagmi";
import { range } from "../util/types";
import { ComponentProps } from "react";

const CurrentAddress = ({ symbols, ...rest }: { symbols?: number }) => {
  const account = useAccount();
  if (!account || !account.address) {
    return <pre>missing account data; check provider connection</pre>;
  }
  return <ui.Address address={account.address} symbols={symbols} {...rest} />;
};
export const Address = Object.assign(
  ({ address, ...rest }: ComponentProps<typeof ui.Address>) =>
    address
      ? <ui.Address address={address} {...rest} />
      : <CurrentAddress {...rest} />,
  {
    plasmicConfig: {
      props: {
        address: {
          type: "string"
        },
        symbols: range(3, 21)
      }
    } as const
  }
);
