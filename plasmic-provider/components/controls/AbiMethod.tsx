import { CustomControl } from "@plasmicapp/host/dist/prop-types";
import { JsonFragment } from "@ethersproject/abi";
import { AbiDescriptionVal } from "../util/useAbi";

export type MethodDescription = {
  isProxied: boolean,
  functionName: string,
  hasDecimalsMethod: boolean,
  methodAbi: JsonFragment,
  abi: [JsonFragment, ...JsonFragment[]]
}
export const AbiMethod: CustomControl<{
  setControlContextData: (data: AbiDescriptionVal) => void,
}> =
  ({
     contextData,
     value,
     updateValue,
   }) => {
    if (!contextData) {
      return <select></select>;
    }
    const {abi = [], implementationAbi = []} = contextData;
    const abiDecimalsMethod = [...abi, ...implementationAbi].find(({ name }) => name === "decimals");
    let idValue = "";
    if (value) {
      const index = (value.isProxied ? implementationAbi : abi)?.findIndex(({ name }) => name === value.functionName) ?? -1;
      if (index !== -1) {
        idValue = `${value.isProxied ? "proxied" : "ordinary"}|${index}`;
      }
    }


    return <select
      value={idValue}
      onChange={(e) => {
        const [type, index] = e.target.value.split("|");
        const isProxied = type === "proxied";
        const method = (isProxied ? implementationAbi : abi)?.[parseInt(index)];
        updateValue(method ? {
          isProxied,
          functionName: method.name,
          hasDecimalsMethod: abiDecimalsMethod !== undefined,
          methodAbi: method,
          abi: abiDecimalsMethod ? [method, abiDecimalsMethod] : [method]
        } : undefined);
      }}
    >
      {
        abi?.map((fn, i) =>
          <option value={`ordinary|${i}`} key={`ordinary|${i}`}>{fn.name}</option>) ?? []
      }
      {
        implementationAbi?.map((fn, i) =>
          <option value={`proxied|${i}`} key={`proxied|${i}`}>{fn.name} (impl)</option>) ?? []
      }
    </select>;
  };
