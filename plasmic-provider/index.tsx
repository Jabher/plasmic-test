import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { registerLidoUi } from "./registerLidoUi";
import * as components from './components'

let initialized = false;
export const setupPlasmic = (plasmic: NextJsPlasmicComponentLoader) => {
  if (initialized) {
    return;
  }
  initialized = true;
  registerLidoUi(plasmic);
  components.registerThemeProvider(plasmic);
  components.registerReefKnotProvider(plasmic);
  components.registerConnectDisconnectComponent(plasmic);
  components.registerIconComponent(plasmic);
  components.registerAddressComponent(plasmic);
  components.registerContractValueComponent(plasmic);
  components.registerContractCallOnClickComponent(plasmic);
};
