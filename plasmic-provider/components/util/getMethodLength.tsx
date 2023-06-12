import { JsonFragment } from "@ethersproject/abi";

export const getMethodLength = (methodAbi?: JsonFragment) => {
  return methodAbi?.inputs?.length ?? 0;
}
