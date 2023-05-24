import "../styles/globals.css";
import type { AppProps } from "next/app";
import { registerPlasmic } from "../plasmic-provider";
import { PLASMIC } from "../plasmic-provider/plasmic";

registerPlasmic(PLASMIC);
// eslint-disable-next-line react/display-name
export default ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
}
