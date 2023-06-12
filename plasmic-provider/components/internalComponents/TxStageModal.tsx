import { FC, useCallback, useEffect, useState } from "react";
import { useChainId, useProvider } from "wagmi";
import { useConnectorInfo } from "reef-knot/web3-react";
import { LedgerConfirm, LedgerFail, LedgerLoading, LedgerSuccess, Link, Modal, ModalProps } from "@lidofinance/lido-ui";
import { getEtherscanTxLink } from "@lido-sdk/helpers";
import { SendTransactionResult } from "@wagmi/core";
import * as styles from "./TxStageModal.styles";

export enum TX_STAGE {
  IDLE,
  SIGN,
  BLOCK,
  SUCCESS,
  FAIL,
}

enum ETHERS_TX_STATUS {
  SUCCESS = 1,
  REVERTED = 0
}

interface TxStageModalProps extends ModalProps {
  transactionPromise: Promise<SendTransactionResult>;
  retry: () => void;
}

const iconsDict = {
  ledger: {
    [TX_STAGE.SUCCESS]: (
      <styles.LedgerIconWrapper>
        <LedgerSuccess fill="transparent" />
      </styles.LedgerIconWrapper>
    ),
    [TX_STAGE.SIGN]: (
      <styles.LedgerIconWrapper>
        <LedgerConfirm fill="transparent" />
      </styles.LedgerIconWrapper>
    ),
    [TX_STAGE.FAIL]: (
      <styles.LedgerIconWrapper>
        <LedgerFail fill="transparent" />
      </styles.LedgerIconWrapper>
    ),
    [TX_STAGE.BLOCK]: (
      <styles.LedgerIconWrapper>
        <LedgerLoading fill="transparent" />
      </styles.LedgerIconWrapper>
    )
  },
  default: {
    [TX_STAGE.SUCCESS]: (
      <styles.IconWrapper>
        <styles.SuccessIcon />
      </styles.IconWrapper>
    ),
    [TX_STAGE.FAIL]: (
      <styles.IconWrapper>
        <styles.FailIcon />
      </styles.IconWrapper>
    ),
    [TX_STAGE.SIGN]: <styles.TxLoader size="large" />,
    [TX_STAGE.BLOCK]: <styles.TxLoader size="large" />
  }
};

const EtherscanTxLinkBlock: FC<{ txHash?: string }> = ({ txHash }) => {
  const chainId = useChainId();
  return txHash
    ? <styles.LightText size="xxs" color="secondary" marginTop={38}>
      <Link href={getEtherscanTxLink(chainId, txHash)}>
        View on Etherscan
      </Link>
    </styles.LightText>
    : null;
};

export const TxStageModal: FC<TxStageModalProps> =
  ({
     transactionPromise,
     retry,
     ...modalProps
   }) => {
    const { isLedger } = useConnectorInfo();
    const currentIconDict = iconsDict[isLedger ? "ledger" : "default"];
    const [txStage, setTxStage] = useState(TX_STAGE.IDLE);
    const [txHash, setTxHash] = useState<string | undefined>(undefined);
    const [open, setOpen] = useState(true);
    const onClose = useCallback(() => {
      setOpen(false);
      setTxStage(TX_STAGE.IDLE);
    }, []);
    const provider = useProvider();
    useEffect(() => {
      setTxStage(TX_STAGE.SIGN);
      setTxHash(undefined);
      setOpen(true);
    }, [transactionPromise]);
    useEffect(() => {
      void transactionPromise.then(
        async (tx) => {
          setTxHash(tx.hash);
          setTxStage(TX_STAGE.BLOCK);
          const receipt = await provider.waitForTransaction(tx.hash);
          setTxStage(receipt.status === ETHERS_TX_STATUS.REVERTED ? TX_STAGE.FAIL : TX_STAGE.SUCCESS);
        },
        () => {
          setTxStage(TX_STAGE.FAIL);
        });
    }, [provider, transactionPromise]);

    if (!open) {
      return null;
    }

    switch (txStage) {
      case TX_STAGE.SIGN:
        return <Modal {...modalProps}>
          {currentIconDict[TX_STAGE.SIGN]}
          <styles.LightText size="xxs" color="secondary" marginTop={38}>
            Confirm this transaction in your wallet
          </styles.LightText>
        </Modal>;
      case TX_STAGE.BLOCK:
        return <Modal {...modalProps}>
          {currentIconDict[TX_STAGE.BLOCK]}
          <styles.LightText size="xs" color="secondary" marginTop={4}>
            Awaiting block confirmation
          </styles.LightText>
          <EtherscanTxLinkBlock txHash={txHash} />
        </Modal>;
      case TX_STAGE.SUCCESS:
        return <Modal {...modalProps} onClose={onClose}>
          <styles.LightText size="xs" color="secondary" marginTop={4}>
            Transaction complete.
          </styles.LightText>
          <EtherscanTxLinkBlock txHash={txHash} />
        </Modal>;
      case TX_STAGE.FAIL:
        return (
          <Modal {...modalProps} onClose={onClose}>
            {currentIconDict[TX_STAGE.FAIL]}
            <styles.BoldText size="sm">Transaction Failed</styles.BoldText>
            <styles.LightText size="xxs" color="secondary" marginTop={38}>
              <styles.StylableLink onClick={retry}>
                Retry
              </styles.StylableLink>
            </styles.LightText>
          </Modal>
        );
      case TX_STAGE.IDLE:
      default:
        return null;
    }
  };
