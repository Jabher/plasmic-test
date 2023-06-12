import { CanvasComponentProps, CustomControl } from "@plasmicapp/host/dist/prop-types";
import { useContractRead } from "wagmi";
import { ComponentProps, FC, useEffect } from "react";
import * as ethers from "ethers";
import { BigNumber } from "ethers";
import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { AbiDescriptionVal, useAbi } from "./util/useAbi";
import { isDecimalReturningMethod } from "./util/isDecimalReturningMethod";
import { AbiMethod, MethodDescription } from "./controls/AbiMethod";
import { getMethodLength } from "./util/getMethodLength";

type Props = {
  address?: string,
  respectDecimals: boolean,
  method?: MethodDescription,
  setControlContextData?: (data: AbiDescriptionVal) => void,
  arg1: string,
  arg2: string,
  arg3: string,
  arg4: string,
  arg5: string,
}

export const registerContractValueComponent = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerComponent(ContractValue, {
    name: "ContractValue",
    displayName: "ContractValue",
    importName: "ContractValue",
    importPath: "lido-plasmic/plasmic-provider/components",
    props: {
      address: {
        type: "string"
      },
      method: {
        type: "custom",
        control: AbiMethod as CustomControl<ComponentProps<typeof ContractValue>>
      },
      respectDecimals: {
        type: "boolean",
        hidden: ({ method }: ComponentProps<typeof ContractValue>) => !isDecimalReturningMethod(method?.methodAbi)
      },
      arg1: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractValue>) => getMethodLength(method?.methodAbi) < 1
      },
      arg2: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractValue>) => getMethodLength(method?.methodAbi) < 2
      },
      arg3: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractValue>) => getMethodLength(method?.methodAbi) < 3
      },
      arg4: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractValue>) => getMethodLength(method?.methodAbi) < 4
      },
      arg5: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractValue>) => getMethodLength(method?.methodAbi) < 5
      }
    }
  });
};

export const ContractValue: FC<CanvasComponentProps<Partial<Props>> & Props> =
  ({ address, method, setControlContextData, ...rest }) => {
    const { abi, implementationAbi } = useAbi(address);

    if (setControlContextData) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        setControlContextData({
          abi: abi?.filter(({ stateMutability }) => ["view", "pure"].includes(stateMutability!)),
          implementationAbi: implementationAbi?.filter(({ stateMutability }) => ["view", "pure"].includes(stateMutability!))
        });
      }, [abi, implementationAbi, setControlContextData])
    }

    if (!address || !address.startsWith("0x") || !method || !abi)
      return null;

    return <ContractValueComponent
      address={address as `0x${string}`}
      method={method}
      {...rest}
    />;
  };



type ImplProps = Omit<Required<Props>, "setControlContextData"> & { address: `0x${string}` }
const ContractValueComponent =
  ({
     address,
     method: {abi, methodAbi, functionName, hasDecimalsMethod},
     respectDecimals,
     ...rest
   }: ImplProps) => {
    const args = [rest.arg1, rest.arg2, rest.arg3, rest.arg4, rest.arg5].slice(0, methodAbi.inputs?.length ?? 0);
    const useDecimals = hasDecimalsMethod && respectDecimals && isDecimalReturningMethod(methodAbi);

    const value = useContractRead({ abi, address, functionName, args, watch: true });
    const decimals = useContractRead({ abi, address, functionName: "decimals", enabled: useDecimals, watch: false });

    switch (true) {
      case value.status === "error":
      case useDecimals && decimals.status === "error":
        return <span {...rest}>method call failed</span>;
      case ["idle", "loading"].includes(value.status):
      case useDecimals && ["idle", "loading"].includes(value.status):
        return <span {...rest}>...</span>;
      case useDecimals: {
        const valueData = value.data as BigNumber;
        const decimalsData = decimals.data as number;
        const remainder = valueData.mod(BigNumber.from(10).pow(decimalsData - 3));
        return <span {...rest}>{ethers.utils.formatUnits(valueData.sub(remainder), decimalsData)}</span>;
      }
      default: {
        const valueData = value.data as BigNumber;
        return <span {...rest}>{valueData.toString()}</span>;
      }
    }
  };
