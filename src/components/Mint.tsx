import { BigNumber, ContractReceipt, ContractTransaction, ethers, providers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Button } from ".";
import { ContractState } from "../utils/contract";
import { formatEther } from '@ethersproject/units';
import { updateTransaction } from "../hooks/useWeb3";
import TransactionModal from "./TransactionModal";
import { Result } from "../types";


interface MintedProps {
    account?: string | null
    contract?: ethers.Contract
    provider?: providers.JsonRpcProvider | undefined
    contractState: ContractState
    readyToTransact: () => Promise<boolean>
}

const Flex = css`
    display: flex;
    align-items: center;
`

const Wrap = styled.div`
    &>h3 {
        margin-bottom: 16px;
    }
    &>p {
        margin-top: 0;
        margin-bottom: 24px;
    }
`
const MintedWrap = styled.div`
    ${Flex}
    justify-content: space-between;
`
const Minted = styled.h3`
    font-weight: 900;
    font-size: 16px;
`

const Num = styled.p`
    font-weight: 400;
    font-size: 14px;
    color: #BFBFBF;
`

const ProcessBar = styled.div`
    max-width: 800px;
    width: 100%;
    height: 10px;
    background-color: #EDEDED;
    border-radius: 8px;
    overflow: hidden;
`

const Process = styled.div<{ width?: string }>`
    height: 100%;
    background-color: #2B396A;
    /* width: ${({ width }) => width ? width : '20px'}; */
    width: ${props => props.width};
`

const Price = styled.div`
    font-weight: 700;
    font-size: 32px;
    display: flex;
    align-items: baseline;
    &>p {
        margin-left:8px;
        font-size:24px;
        font-weight: normal;
    }
`
const BuyWrap = styled.div`
    ${Flex};
    gap: 24px;
`
const BuyNum = styled.div`
    ${Flex};
    justify-content: space-evenly;
    border: 1px solid #EDEDED;
    border-radius: 8px;
    width: 139px;
    height: 46px;
    &>button {
        font-size: 20px;
        outline: none;
        background: none;
        border: none;
        cursor: pointer;
    }
`

const Mint: React.FC<MintedProps> = ({
    contract,
    contractState,
    account,
    readyToTransact,
    provider,
}) => {
    const { price, total, name } = contractState;
    const [num, setNum] = useState<number>(1);
    const [result, setResult] = useState<Result | null>();
    const [isOpen, setOpen] = useState<boolean>(false);
    const [receipt, setReceipt] = useState<
        undefined | null | Record<string, never> | Partial<ContractReceipt>
    >();

    const [transaction, setTransaction] = useState<
        | undefined
        | Record<string, never>
        | { failed: true; message?: string }
        | Partial<ContractTransaction>
    >();

    const closeModal = () => {
        setOpen(false);
        setReceipt(null);
        setTransaction(undefined);
        setResult(null);
    }

    const countNum = (conut: string) => {
        if (conut === '+') {
            setNum((prev) => prev + 1);
        } else {
            if (num <= 1) return;
            setNum((prev) => prev - 1);
        }
    }

    const WaitTransaction = async(hash:string)=> {
        if (provider && hash) {
            provider.on(hash, async () => {
                await updateTransaction(hash).then(async (tx) => {
                    console.log('res transaction', tx);
                    setReceipt(tx.receipt);
                    setTransaction(tx.transaction);
                    if (tx.transaction.confirmations > 1) {
                        console.log('clear');
                        provider.off(hash)
                    }
                });
            })
            provider.once('error', () => {
                setTransaction({ failed: true });
                provider.off(hash);
            })
        }
    }

    const handleMint = async (evt: any) => {
        evt.preventDefault()
        let ready = await readyToTransact()
        if (!ready || !contract) return
        setOpen(true);
        if (num === 1) {
            try {
                let res = await contract!.mint(account, { value: price });
                await WaitTransaction(res.hash);
            } catch (e: any) {
                console.log(`tx response: ${e.message}`)
                setTransaction({ failed: true });
            }
        } else {
            try {
                let res = await contract!.mintBatch(account, num, { value: price });
                await WaitTransaction(res.hash);
            } catch (e: any) {
                console.log(`tx response: ${e.message}`)
                setTransaction({ failed: true });
            }
        }

    }

    const totalSupply = useMemo(() => {
        return total;
    }, [total])

    return (
        <Wrap>
            <MintedWrap>
                <Minted>{totalSupply ? (totalSupply.toNumber() * 100) / 1000 : 0}% Minted</Minted>
                <Num>{totalSupply ? totalSupply.toString() : 0}/1000</Num>
            </MintedWrap>
            <ProcessBar>
                <Process width={`calc(100% * (${total ? total.toNumber() : 0} / 1000))`} />
            </ProcessBar>
            <MintedWrap>
                <Price>{formatEther(price)} <p>TACT</p></Price>
                <BuyWrap>
                    <BuyNum>
                        <button onClick={() => {
                            countNum('-')
                        }}>-</button>
                        <p>{num}</p>
                        <button onClick={() => {
                            countNum('+')
                        }}>+</button>
                    </BuyNum>
                    <Button onClick={handleMint}>Mint</Button>
                </BuyWrap>
            </MintedWrap>
            <TransactionModal
                isOpen={isOpen}
                closeModal={closeModal}
                receipt={receipt}
                transaction={transaction}
                name={name}
            />
        </Wrap>
    )
}

export default Mint;