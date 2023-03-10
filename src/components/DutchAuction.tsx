import { Fragment, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ethers, BigNumber } from 'ethers'

import { ContractState } from '../utils/contract'
import AuctionItem from './AuctionItem'
import { Status, Field, LongInput, Submit, Button } from '../components'
import { Result } from '../types'
import { decodeRendererV1, AssetMetadata } from '../../src/utils/decoding'
import AssetRenderer from './AssetRendererV1'
import { updateTransaction } from '../hooks/useWeb3'
import Modal from './Modal'

const Selection = styled.div`
    display: inline-block;
    padding-right: 10px;
`

const NftWrap = styled.div`
    display:flex;
    flex-wrap:wrap;
    gap:12px;
`

interface DutchAuctionProps {
    account?: string | null
    contract?: ethers.Contract
    contractState: ContractState
    readyToTransact: () => Promise<boolean>
}

const DutchAuction: React.FC<DutchAuctionProps> = ({
    contract,
    contractState,
    account,
    readyToTransact,
}) => {
    const { forSale, price } = contractState
    const [num, setNum] = useState(trySelectSale(contractState))
    const [result, setResult] = useState<Result>()
    const [asset, setAsset] = useState<AssetMetadata[] | null>()
    const [open,setOpen] = useState<boolean>(false)

    useEffect(() => {
        console.log('asset', asset);
    }, [asset])
    const getNFT = async (contract: ethers.Contract, forSale: BigNumber[]) => {
        const nftArr = [];
        for (const i of forSale) {
            try {
                let newNft = await contract.tokenURI(BigNumber.from(i));
                newNft = decodeRendererV1(newNft)
                nftArr.push(newNft)
            } catch (error) {
                console.log('error', error);
            }
        }
        setAsset(nftArr);
    }
    const closeModal = () => {
        setOpen(false);
    }
    const onSelectNum = (selection: string) => setNum(selection)
    const handleMint = async (evt: any) => {
        evt.preventDefault()
        let ready = await readyToTransact()
        if (!ready || !contract) return

        try {
            let selectedNum = BigNumber.from(num)

            let exists = false
            for (var i = 0; i < forSale.length; i++) {
                if (forSale[i].eq(selectedNum)) {
                    exists = true
                    break
                }
            }

            if (!exists) {
                setResult({
                    message: `MemeNumber is not part of the current batch: ${selectedNum}`,
                    err: new Error('invalid memenumber'),
                })
                return
            }
            console.log(contract)

            let res = await contract!.mint(account, selectedNum, {
                value: price,
            })

            console.log('mint result:', res)
            setResult({
                message: `Mint Transaction Sent, Tx Hash: ${res.hash}`,
            })
            const transaction = await updateTransaction(res.hash).then(async (res) => {
                if (res.transaction.blockNumber && res.transaction.confirmations) {
                    console.log('show nft');

                    let nft = await contract.tokenURI(BigNumber.from(selectedNum));
                    nft = decodeRendererV1(nft)
                    setAsset([nft]);
                }
            });

        } catch (e: any) {
            console.log(`tx response: ${e.message}`)
            setResult({
                message: `Mint Transaction Error: ${e.message}`,
                err: e as Error,
            })
        }
    }

    const handleMintAll = async (evt: any, forSale: BigNumber[]) => {
        evt.preventDefault()
        let ready = await readyToTransact()
        if (!ready || !contract) return
        try {
            let res = await contract!.mintAll(account, {
                value: price,
            })

            console.log('mint all result:', res)
            setResult({
                message: `Mint All Sent, Tx Hash: ${res.hash}`,
            })
            const transaction = await updateTransaction(res.hash).then(async (res) => {
                if (res.transaction.blockNumber && res.transaction.confirmations) {
                    console.log('show nft');
                    getNFT(contract, forSale);
                }
            });
        } catch (e: any) {
            console.log(`tx response: ${e.message}`)
            setResult({
                message: `Mint All Error: ${e.message}`,
                err: e as Error,
            })
        }
    }

    // #FIXME
    // the bidPrice loop conversion is nasty but BigNumber can't parse decimals and formatEther gives decimals
    // so, figure something out later
    return (
        <div>
            <AuctionItem contractState={contractState} onSelect={onSelectNum} />
            <form onSubmit={handleMint}>
                <Field>Mint Number:</Field>
                <LongInput
                    type="text"
                    value={num}
                    onChange={(e) => setNum(e.target.value)}
                />
                <Selection>
                    <Submit value="Mint" />
                </Selection>
                <Selection>
                    <Button onClick={(e) => {
                        handleMintAll(e, forSale);
                    }}>Mint All</Button>
                </Selection>
            </form>
            {result && <Status isError={result.err}>{result.message}</Status>}
            <NftWrap>
                {asset && asset.map((nft: any) => (<Fragment key={nft.image}>
                    <AssetRenderer metadata={nft} />
                </Fragment>))}
            </NftWrap>
            <button onClick={()=>{
                setOpen(!open)
            }}>
                open
            </button>
            <Modal isOpen={open} onClose={closeModal}>
                <p>123</p>
            </Modal>
        </div>
    )
}

function trySelectSale({ forSale }: ContractState): string | undefined {
    return forSale[0] ? forSale[0].toString() : undefined
}

export default DutchAuction
