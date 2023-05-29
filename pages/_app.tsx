import "../styles/globals.css";
import "../components/plasmic/plasmic__default_style.module.css";
import type { AppProps } from "next/app";
import { setupPlasmic } from "../plasmic-provider";
import { PLASMIC } from "../plasmic-provider/plasmic";

setupPlasmic(PLASMIC);
export default Object.assign(
  ({ Component, pageProps }: AppProps) => <Component {...pageProps} />,
  {displayName: 'App'}
)
