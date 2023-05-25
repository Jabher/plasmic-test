import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import * as ui from "@lidofinance/lido-ui";
import * as primitives from "@lidofinance/ui-primitives"
import { themeLight } from "@lidofinance/lido-ui";
import { choice, range } from "./util/types";

export const registerLidoUi = (plasmic: NextJsPlasmicComponentLoader) => {
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


  const register = (title: string, props: unknown = {}) => {
    //@ts-expect-error sometimes I hate plasmic
    plasmic.registerComponent(ui[title], {
      name: `@lidofinance/lido-ui#${title}`,
      displayName: title,
      importPath: `@lidofinance/lido-ui`,
      importName: title,
      props
    });
  };
  const registerPrimitive = (title: string, props: unknown = {}) => {
    //@ts-expect-error I hate plasmic
    plasmic.registerComponent(primitives[title], {
      name: `@lidofinance/ui-primitives#${title}`,
      displayName: title,
      importPath: "@lidofinance/ui-primitives",
      importName: title,
      props
    });
  };

  register("Accordion", {
    defaultExpanded: {
      type: "boolean"
    },
    summary: {
      type: "string"
    }
  });

  register("button", {
    children: "slot",
    size: choice`xxs|xs|sm|md|lg`,
    variant: choice`filled|outlined|text|ghost|translucent`,
    color: choice`primary|secondary|warning|error|success`
  });
  register("Chip", {
    children: "slot",
    variant: choice`positive|negative|warning|gray`
  });


  register("Checkbox");

  register("Divider", {
    type: choice`vertical|horizontal`,
    indents: choice`xs|sm|md|lg|xl`
  });

  register("Heading", {
    children: "slot",
    color: choice`text|secondary`
  });

  register("Identicon", {
    diameter: range(4, 64, 4)
  });

  register("LidoLogo", {});

  register("InlineLoader", {
    color: choice`text|secondary|foreground`
  });

  register("Loader", {
    color: choice`primary|secondary|foreground|success`,
    size: choice`small|medium|large`
  });

  register("MainMenu", {
    active: choice`stake|wrap|wallet`
  });


  register("AddressBadge", {
    "address": {
      "type": "string"
    },
    "symbolsMobile": range(3, 21),
    "symbolsDesktop": range(3, 21)
  });


  register("Table", {
    textColor: choice`primary|secondary|warning|error|success|default`,
    align: choice`left|center|right`
  });

  registerPrimitive("WalletCard", {
    children: "slot"
  });

  registerPrimitive("WalletCardAccount", {
    children: "slot",
    account: {
      type: "string"
    }
  });

  registerPrimitive("WalletCardBalance", {
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
  });
};
