import * as ui from "@lidofinance/lido-ui";
import { PropsWithChildren } from "react";

export const ThemeProvider = Object.assign(
  ({ children, useSystemTheme }: PropsWithChildren<{useSystemTheme: boolean}>) =>
    <ui.CookieThemeProvider
      overrideThemeName={useSystemTheme ? undefined : ui.ThemeName.light}
    >
      {children}
    </ui.CookieThemeProvider>,
  {
    plasmicConfig: {
      props: {
        useSystemTheme: {
          type: "boolean"
        }
      }
    } as const
  }
)
