import * as ui from "@lidofinance/lido-ui";
import type { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";

export const registerTheme = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerGlobalContext(({ children, useSystemTheme }) =>
    <ui.CookieThemeProvider
      overrideThemeName={useSystemTheme ? undefined : ui.ThemeName.light}
    >
      {children}
    </ui.CookieThemeProvider>, {
    name: "Theme",
    props: {
      useSystemTheme: {
        type: "boolean"
      }
    }
  });
};
