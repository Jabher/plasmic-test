import * as ui from "@lidofinance/lido-ui";

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

export const Icon = Object.assign(
  ({ color, type }: { color?: string; type: typeof icons[number] }) => {
    // eslint-disable-next-line import/namespace
    const Component = ui[type];

    return <Component style={{ fill: color || `currentcolor` }} />;
  },
  {
    plasmicConfig: {
      props: {
        color: { type: "color" },
        type: { type: "choice", options: icons }
      }
    } as const
  }
)

