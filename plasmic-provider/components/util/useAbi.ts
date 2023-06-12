import { useChainId, useProvider } from "wagmi";
// @ts-expect-error no types
import Etherscan from "etherscan-api";
import { useEffect, useState } from "react";
import { JsonFragment } from "@ethersproject/abi";
import { Contract } from "ethers";
import { Provider } from "@wagmi/core";

export type AbiMethod = JsonFragment;

const ETHERSCAN_API_KEY = "GNEXDC1YAB8PYEC6NH8BCQFM76VJEQMBBQ";

export type AbiDescriptionVal = { abi?: JsonFragment[], implementationAbi?: JsonFragment[] }

const cache: Record<number, Record<string, AbiDescriptionVal>> = {};
const getAbi = async (provider: Provider, chainId: number, _address: `0x${string}`) => {
  const address = _address.toLowerCase();
  const chain = {
    1: "homestead",
    3: "ropsten",
    69: "kovan",
    4: "rinkeby",
    5: "goerli",
    11155111: "sepolia"
  }[chainId];
  if (!chain) {
    return {};
  }
  const etherscanApi = Etherscan.init(ETHERSCAN_API_KEY, chain);
  cache[chainId] ??= {};
  if (cache[chainId][address]) {
    return cache[chainId][address];
  }
  const fetchAbi = async (addr: string): Promise<AbiMethod[] | undefined> => {
    const { result } = await etherscanApi.contract.getabi(addr).catch(() => ({}));
    return result
      ? JSON.parse(result).filter((abiRecord: JsonFragment): abiRecord is AbiMethod => "name" in abiRecord && abiRecord.type === "function")
      : undefined;
  };


  const abi = await fetchAbi(address);
  if (!abi) {
    return cache[chainId][address] = { abi: undefined };
  }
  const proxyTypeMethodAbi = abi.find(({ name }) => name === "proxyType");
  const implementationMethodAbi = abi.find(({ name }) => name === "implementation");

  const isProxy = proxyTypeMethodAbi !== undefined && implementationMethodAbi !== undefined;

  if (!isProxy) {
    return cache[chainId][address] = { abi };
  }

  const implementation = await new Contract(address, abi).connect(provider).implementation();
  if (!implementation) {
    return cache[chainId][address] = { abi };
  }

  const implementationAbi = await fetchAbi(implementation);
  return cache[chainId][address] = { abi, implementationAbi};
};

export const useAbi = (address: string | undefined): AbiDescriptionVal => {
  const chainId = useChainId();
  const provider = useProvider();
  const [abi, setAbi] = useState<{ abi?: JsonFragment[], implementationAbi?: JsonFragment[] }>({});

  useEffect(() => {
    if (chainId && address && address.startsWith('0x')) {
      void getAbi(provider, chainId, address as `0x${string}`).then(setAbi);
    }
  }, [address, chainId, provider]);

  return abi;
};
