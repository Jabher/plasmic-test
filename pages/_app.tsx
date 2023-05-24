import "../styles/globals.css";
import "../components/plasmic/plasmic__default_style.module.css";
import type { AppProps } from "next/app";
import { setupPlasmic } from "../plasmic-provider";
import { PLASMIC } from "../plasmic-provider/plasmic";

setupPlasmic(PLASMIC);
// eslint-disable-next-line react/display-name
export default ({ Component, pageProps }: AppProps) => <div className="plasmic_default__all">
  <Component {...pageProps} />
</div>
