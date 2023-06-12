import { JsonFragment } from "@ethersproject/abi";

export const isDecimalReturningMethod = (methodAbi?: JsonFragment) => {
  if (!methodAbi) {
    return false;
  }
  if (!methodAbi.outputs || methodAbi.outputs.length !== 1) {
    return false;
  }
  return methodAbi.outputs[0].type?.startsWith("uint") || methodAbi.outputs[0].type?.startsWith("int");
};
