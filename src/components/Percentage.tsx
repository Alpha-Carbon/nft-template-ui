import { ethers } from "ethers";
import { useState } from "react";
import styled, { css } from "styled-components";
import { Button } from ".";
import { ContractState } from "../utils/contract";
import { formatEther } from '@ethersproject/units'


interface PercentageProps {
    account?: string | null
    contract?: ethers.Contract
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

const Percentage: React.FC<PercentageProps> = ({
    contract,
    contractState,
    account,
    readyToTransact,
}) => {
    const { price } = contractState;
    console.log('contractState',contractState);
    const [num, setNum] = useState<number>(1);

    const countNum = (conut: string) => {
        if (conut === '+') {
            setNum((prev) => prev + 1);
        } else {
            if (num <= 1) return;
            setNum((prev) => prev - 1);
        }
    }
    return (
        <Wrap>
            <MintedWrap>
                <Minted>21.9% Minted</Minted>
                <Num>9527/60000</Num>
            </MintedWrap>
            <ProcessBar>
                <Process width="calc(100% * (1000 / 6000))" />
            </ProcessBar>
            <MintedWrap>
                <Price>{formatEther(price)} <p>ETH</p></Price>
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
                    <Button>Mint</Button>
                </BuyWrap>
            </MintedWrap>
        </Wrap>

    )
}

export default Percentage;