import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import * as ui from "@lidofinance/lido-ui";
import { FC, PropsWithChildren } from "react";

export const registerThemeProvider = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerGlobalContext(ThemeProvider, {
    name: "Theme",
    importName: "ThemeProvider",
    importPath: "lido-plasmic/plasmic-provider/components",
    props: {
      useSystemTheme: "boolean"
    }
  });
};

export const ThemeProvider: FC<PropsWithChildren<{ useSystemTheme: boolean }>> = ({ children, useSystemTheme }) =>
  <ui.CookieThemeProvider overrideThemeName={useSystemTheme ? undefined : ui.ThemeName.light}>
    {children}
  </ui.CookieThemeProvider>;
