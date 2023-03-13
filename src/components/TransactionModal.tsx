import { BigNumber, ContractReceipt, ContractTransaction, ethers } from "ethers";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Button } from ".";
import { ContractState } from "../utils/contract";
import { formatEther } from '@ethersproject/units';
import Modal from "./Modal";
import { updateTransaction } from "../hooks/useWeb3";
import { Result } from "../types";
import { Processing } from "./Processing";


interface TransactionModalProps {
    isOpen: boolean;
    closeModal: () => void;
    transaction:
    | undefined
    | Record<string, never>
    | { failed: true; message?: string }
    | Partial<ContractTransaction>
    | any;
    receipt: undefined | null | Record<string, never> | Partial<ContractReceipt>
    result: Result | null | undefined;

}

const ModalTitleBasic = css`
    text-align: center;
    font-weight:700;
    font-size: 32px;
`

const ModalTitle = styled.h3`
    ${ModalTitleBasic}
    color: #222222;
`

const ModalComplete = styled.h3`
    ${ModalTitleBasic}
    color: #2B396A;
`
const ModalFail = styled.h3`
    color: #6A2B2B;
    ${ModalTitleBasic}
`

const ModalText = styled.p`
    color: #222222;
    text-align: center;
    font-weight:400;
    font-size: 24px;
`

const TransactionModal: React.FC<TransactionModalProps> = ({
    isOpen,
    closeModal,
    transaction,
    receipt,
    result,
}) => {
    console.log(transaction,
        receipt,
        result, 'modal');
    if (transaction) {
        if ('failed' in transaction || (receipt && receipt.status === 0)) {
            return (
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <ModalFail>Your Mint Failed!</ModalFail>
                    <ModalText>Transaction failed: {transaction.blockHash}</ModalText>
                </Modal>
            )
        }
        if (transaction?.blockNumber && transaction?.confirmations) {
            return (
                <Modal isOpen={isOpen} onClose={closeModal}>
                    <ModalComplete>Your Mint Is Complete!</ModalComplete>
                </Modal>
            )
        }
        return (
            <Modal isOpen={isOpen} onClose={closeModal}>
                <Processing />
                <ModalTitle>Your Mint Is Processing</ModalTitle>
                <ModalText>Your mint of NFT_NAME is processing</ModalText>
            </Modal>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <ModalTitle>Mint Your NFT</ModalTitle>
            <ModalText>Please confirm the transaction in your wallet</ModalText>
        </Modal>
    )
}

export default TransactionModal;