import * as ui from "@lidofinance/lido-ui";
import { themeLight } from "@lidofinance/lido-ui";
import * as primitives from "@lidofinance/ui-primitives";
import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { registerWagmi } from "./components/Wagmi";
import { registerConnectDisconnect } from "./components/ConnectDisconnect";
import { registerTheme } from "./components/Theme";
import { registerIcon } from "./components/Icon";
import { registerAddress } from "./components/Address";
import { choice } from "./util/types";


export const registerPlasmic = (plasmic: NextJsPlasmicComponentLoader) => {
  if (!globalThis.document) {
    return;
  }
  for (const [key] of Object.entries(themeLight.colors)) {
    if (/Opacity$/.test(key)) {
      continue;
    }
    plasmic.registerToken({
      name: `lido/${key}`,
      displayName: key,
      value: `var(--lido-color-${key})`,
      type: "color"
    });
  }
  for (const [key, value] of Object.entries(themeLight.spaceMap)) {
    plasmic.registerToken({
      name: `lido/${key}`,
      displayName: key,
      value: `${value}px`,
      type: "spacing"
    });
  }
  for (const [key, value] of Object.entries(themeLight.fontSizesMap)) {
    plasmic.registerToken({
      name: `lido/${key}`,
      displayName: key,
      value: `${value}px`,
      type: "font-size"
    });
  }


  registerTheme(plasmic);
  registerWagmi(plasmic);
  registerConnectDisconnect(plasmic);
  registerIcon(plasmic);

  plasmic.registerComponent(ui.Accordion, {
    name: `Lido/Accordion`,
    displayName: `Accordion`,
    props: {
      defaultExpanded: {
        type: "boolean"
      },
      summary: {
        type: "string"
      }
    }
  });


  registerAddress(plasmic);

  plasmic.registerComponent(ui.Button, {
    name: `Lido/Button`,
    displayName: `Button`,
    props: {
      children: "slot",
      size: choice`xxs|xs|sm|md|lg`,
      variant: choice`filled|outlined|text|ghost|translucent`,
      color: choice`primary|secondary|warning|error|success`
    }
  });

  plasmic.registerComponent(ui.Chip, {
    name: "Lido/Chip",
    displayName: "Chip",
    props: {
      children: "slot",
      variant: choice`positive|negative|warning|gray`
    }
  });

  plasmic.registerComponent(ui.Checkbox, {
    name: "Lido/Checkbox",
    displayName: "Checkbox",
    props: {}
  });

  plasmic.registerComponent(ui.Divider, {
    name: "Lido/Divider",
    displayName: "Divider",
    props: {
      type: choice`vertical|horizontal`,
      indents: choice`xs|sm|md|lg|xl`
    }
  });

  plasmic.registerComponent(ui.Heading, {
    name: "Lido/Heading",
    displayName: "Heading",
    props: {
      children: "slot",
      color: choice`text|secondary`
    }
  });

  plasmic.registerComponent(ui.Identicon, {
    name: "Lido/Identicon",
    displayName: "Identicon",
    props: {
      diameter: {
        type: "number",
        min: 4,
        max: 64,
        step: 4
      }
    }
  });

  plasmic.registerComponent(ui.LidoLogo, {
    name: "Lido/LidoLogo",
    displayName: "LidoLogo",
    props: {}
  });

  plasmic.registerComponent(ui.InlineLoader, {
    name: "Lido/InlineLoader",
    displayName: "InlineLoader",
    props: {
      color: choice`text|secondary|foreground`
    }
  });

  plasmic.registerComponent(ui.Loader, {
    name: "Lido/Loader",
    displayName: "Loader",
    props: {
      color: choice`primary|secondary|foreground|success`,
      size: choice`small|medium|large`
    }
  });

  plasmic.registerComponent(ui.MainMenu, {
    name: "Lido/MainMenu",
    displayName: "MainMenu",
    props: {
      active: choice`stake|wrap|wallet`
    }
  });

  plasmic.registerComponent(ui.Table, {
    name: "Lido/Table",
    displayName: "Table",
    props: {
      textColor: choice`primary|secondary|warning|error|success|default`,
      align: choice`left|center|right`
    }
  });
  plasmic.registerComponent(primitives.WalletCard, {
    name: "Lido/primitives/WalletCard",
    displayName: "WalletCard",
    props: {
      children: "slot"
    }
  });
  plasmic.registerComponent(primitives.WalletCardAccount, {
    name: "Lido/primitives/WalletCardAccount",
    displayName: "WalletCardAccount",
    props: {
      children: "slot",
      account: {
        type: "string"
      }
    }
  });
  plasmic.registerComponent(primitives.WalletCardBalance, {
    name: "Lido/primitives/WalletCardBalance",
    displayName: "WalletCardBalance",
    props: {
      children: "slot",
      title: {
        type: "string"
      },
      loading: {
        type: "boolean"
      },
      value: {
        type: "string"
      }
    }
  });
};
