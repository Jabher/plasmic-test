import * as ui from "@lidofinance/lido-ui";
import { ComponentProps } from "react";
import { useAccount } from "wagmi";
import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import dynamic from "next/dynamic";
import { range } from "../util/types";

export const registerAddressComponent = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerComponent(Address, {
    name: "@lidofinance/lido-ui/Address",
    displayName: "Address",
    importName: "Address",
    importPath: "lido-plasmic/plasmic-provider/components",
    props: {
      address: {
        type: "string"
      },
      symbols: range(3, 21)
    }
  });
}

export const Address = dynamic(() => Promise.resolve(AddressClient), {ssr: false})

export const AddressClient = ({ address, ...rest }: ComponentProps<typeof ui.Address>) =>
  address
    ? <ui.Address address={address} {...rest} />
    : <CurrentAddress {...rest} />



const CurrentAddress = ({ symbols, ...rest }: { symbols?: number }) => {
  const account = useAccount();
  if (!account || !account.address) {
    return <pre>missing account data; check provider connection</pre>;
  }
  return <ui.Address address={account.address} symbols={symbols} {...rest} />;
};
