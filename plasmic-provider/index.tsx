import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { ReefKnotProvider, ConnectDisconnect, Icon, Address, ThemeProvider } from "./components";
import { registerLidoUi } from "./registerLidoUi";

let initialized = false
export const setupPlasmic = (plasmic: NextJsPlasmicComponentLoader) => {
  if (initialized) {
    return;
  }
  initialized = true;
  registerLidoUi(plasmic);
  plasmic.registerGlobalContext(ThemeProvider, {
    name: "Theme",
    importName: 'ThemeProvider',
    importPath: 'lido-plasmic/plasmic-provider/components',
    ...ThemeProvider.plasmicConfig
  });
  plasmic.registerGlobalContext(ReefKnotProvider, {
    name: "ReefKnot",
    importName: 'ReefKnotProvider',
    importPath: 'lido-plasmic/plasmic-provider/components',
    ...ReefKnotProvider.plasmicConfig
  });
  plasmic.registerComponent(ConnectDisconnect, {
    name: "ReefKnot/ConnectDisconnect",
    displayName: "ConnectDisconnect",
    importName: 'ConnectDisconnect',
    importPath: 'lido-plasmic/plasmic-provider/components',
    props: {}
  });
  plasmic.registerComponent(Icon, {
    name: "@lidofinance/lido-ui/Icon",
    displayName: "Icon",
    importName: 'Icon',
    importPath: 'lido-plasmic/plasmic-provider/components',
    ...Icon.plasmicConfig
  });
  plasmic.registerComponent(Address, {
    name: "@lidofinance/lido-ui/Address",
    displayName: "Address",
    importName: 'Address',
    importPath: 'lido-plasmic/plasmic-provider/components',
    ...Address.plasmicConfig
  });
};
