import chainRPCs from "./chainid-network-chains-mini.json";

export const rpcUrls: Record<number, string> = {};

for (const { chainId, rpc: rpcUrl } of chainRPCs) {
  const rpc = rpcUrl.find(url => !url.includes("$"));
  if (rpc) {
    rpcUrls[chainId] = rpc;
  }
}
