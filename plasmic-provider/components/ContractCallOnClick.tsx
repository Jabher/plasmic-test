import { NextJsPlasmicComponentLoader } from "@plasmicapp/loader-nextjs";
import { ComponentProps, FC, PropsWithChildren, useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import { SendTransactionResult } from "@wagmi/core";
import { CustomControl } from "@plasmicapp/host/dist/prop-types";
import * as ethers from "ethers";
import { AbiMethod, MethodDescription } from "./controls/AbiMethod";
import { getMethodLength } from "lido-plasmic/plasmic-provider/components/util/getMethodLength";
import { AbiDescriptionVal, useAbi } from "lido-plasmic/plasmic-provider/components/util/useAbi";
import { TxStageModal } from "lido-plasmic/plasmic-provider/components/internalComponents/TxStageModal";

type Props = {
  address?: `0x${string}`,
  method?: MethodDescription,
  setControlContextData: (data: AbiDescriptionVal) => void,
  arg1?: string,
  arg2?: string,
  arg3?: string,
  arg4?: string,
  arg5?: string,
}

type ImplProps = Omit<Props, "setControlContextData"> & {
  address: `0x${string}`,
  method: MethodDescription,
}

export const registerContractCallOnClickComponent = (plasmic: NextJsPlasmicComponentLoader) => {
  plasmic.registerComponent(ContractCallOnClick, {
    name: "ContractCallOnClick",
    displayName: "ContractCallOnClick",
    importName: "ContractCallOnClick",
    importPath: "lido-plasmic/plasmic-provider/components",
    isAttachment: true,
    styleSections: false,
    props: {
      children: "slot",
      address: {
        type: "string"
      },
      method: {
        type: "custom",
        control: AbiMethod as CustomControl<ComponentProps<typeof ContractCallOnClick>>
      },
      arg1: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractCallOnClick>) => getMethodLength(method?.methodAbi) < 1
      },
      arg2: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractCallOnClick>) => getMethodLength(method?.methodAbi) < 2
      },
      arg3: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractCallOnClick>) => getMethodLength(method?.methodAbi) < 3
      },
      arg4: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractCallOnClick>) => getMethodLength(method?.methodAbi) < 4
      },
      arg5: {
        type: "string",
        hidden: ({ method }: ComponentProps<typeof ContractCallOnClick>) => getMethodLength(method?.methodAbi) < 5
      }
    }
  });
};


export const ContractCallOnClick: FC<PropsWithChildren<Props>> =
  ({
     setControlContextData,
     address,
     method,
     children,
     ...rest
   }) => {
    if (setControlContextData) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { abi, implementationAbi } = useAbi(address);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        setControlContextData?.({
          abi: abi?.filter(({ stateMutability }) => ["nonpayable", "payable"].includes(stateMutability!)),
          implementationAbi: implementationAbi?.filter(({ stateMutability }) => ["nonpayable", "payable"].includes(stateMutability!))
        });
      }, [abi, implementationAbi, setControlContextData]);
    }
    if (!address || !method || !address || !address.startsWith("0x")) {
      return <div style={{ display: "contents" }}>{children}</div>;
    }
    return <ContractCallOnClickComponent address={address} method={method} isWithinPlasmic={!!setControlContextData} {...rest}>
      {children}
    </ContractCallOnClickComponent>;
  };
const ContractCallOnClickComponent: FC<PropsWithChildren<ImplProps> & {isWithinPlasmic?: boolean}> =
  ({
     children,
     address,
     method: { abi, methodAbi, functionName },
     isWithinPlasmic,
     ...rest
   }) => {
    const args = [rest.arg1, rest.arg2, rest.arg3, rest.arg4, rest.arg5].slice(0, methodAbi.inputs?.length ?? 0);

    let payload = "";
    try {
      payload = new ethers.utils.Interface(abi).encodeFunctionData(functionName, args);
    } catch { /* empty */ }
    const { writeAsync } = useContractWrite({
      address,
      abi,
      functionName,
      request: {
        data: payload,
        to: address,
        gasLimit: ethers.BigNumber.from(1_000_000)
      },
      mode: "prepared"
    });
    const [transactionPromise, setTransactionPromise] = useState<Promise<SendTransactionResult> | undefined>(undefined);

    return <>
      <div
        style={{ display: "contents" }}
        //there is some bug that makes button handle doubleclicks in Plasmic env
        onClick={isWithinPlasmic ? undefined : () => setTransactionPromise(writeAsync?.())}
      >
        {children}
      </div>
      {
        transactionPromise
          ? <TxStageModal
            transactionPromise={transactionPromise}
            retry={() => setTransactionPromise(writeAsync?.())}
            open
          />
          : null
      }
    </>;
  };

