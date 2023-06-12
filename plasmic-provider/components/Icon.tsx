import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import * as ui from "@lidofinance/lido-ui";
export const registerIconComponent = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerComponent(Icon, {
    name: "@lidofinance/lido-ui/Icon",
    displayName: "Icon",
    importName: 'Icon',
    importPath: 'lido-plasmic/plasmic-provider/components',
    props: {
      color: { type: "color" },
      type: { type: "choice", options: icons }
    }
  });
}

const icons: Array<keyof typeof ui> = [
  "Ambire",
  "ArrowBack",
  "ArrowBottom",
  "ArrowLeft",
  "ArrowRight",
  "ArrowTop",
  "Balancer",
  "Beth",
  "BlochainwalletInversion",
  "Blochainwallet",
  "Brave",
  "CheckLarge",
  "Check",
  "Close",
  "Coin98Circle",
  "Coinbase",
  "CookieInverse",
  "Cookie",
  "Copy",
  "Curve",
  "Dark",
  "Deposit",
  "Edit",
  "Email",
  "Error",
  "Eth",
  "Exodus",
  "External",
  "Facebook",
  "Gamestop",
  "History",
  "ImtokenCircle",
  "Imtoken",
  "Ldo",
  "Ldopl",
  "LedgerCircleInversion",
  "LedgerCircle",
  "LedgerConfirm",
  "LedgerFail",
  "LedgerLoading",
  "LedgerSuccess",
  "Ledger",
  "Light",
  "Linkedin",
  "LockSmall",
  "Lock",
  "MathWalletCircleInversion",
  "MathWalletCircle",
  "MetaMaskCircleInversion",
  "MetaMaskCircle",
  "MetaMask",
  "OneInch",
  "OperaWallet",
  "Plus",
  "Question",
  "Referral",
  "Solana",
  "Stake",
  "Steth",
  "Stsol",
  "Success",
  "TallyCircle",
  "Telegram",
  "Terra",
  "TickSquare",
  "TimeSquare",
  "TrustCircle",
  "Trust",
  "Twitter",
  "Uniswap",
  "Unstoppabledomains",
  "Validators",
  "WalletConnectCircle",
  "WalletConnect",
  "Wallet",
  "Warning",
  "Weth",
  "Whitepaper",
  "Withdraw",
  "Wrap",
  "Wsteth",
  "XdefiWallet",
  "Zengo"
];

export const Icon = ({ color, type }: { color?: string; type: typeof icons[number] }) => {
  // eslint-disable-next-line import/namespace
  const Component = ui[type];

  if (!Component) {
    return null;
  }
  // @ts-expect-error bad types
  return <Component style={{ fill: color || `currentcolor` }} />;
}
