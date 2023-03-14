import { ethers, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContractState } from '../utils/contract'
import { AssetMetadata, decodeRendererV1 } from '../utils/decoding'
import Modal from './Modal'
import { Button } from '.'
import { updateTransaction } from '../hooks/useWeb3'

const ImageWrap = styled.div`
    display: flex;
    flex-wrap:wrap;
    gap: 20px;
    padding: 40px;
    background-color: #F7F8FF;
    border-radius: 8px;
    overflow: hidden;
`

const ImageContainer = styled.div`
    display:flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    & img {
        width:128px;
        height:128px;
    }

    &>p {
        margin:0px;
    }
`

const Burn = styled.button`
    cursor: pointer;
    background-color: #2B396A;
    outline: none;
    border: none;
    border-radius: 8px 0px;
    color: #FFFFFF;
    font-size: 14px;
    text-align: center;
    font-weight: 400;
    letter-spacing: 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px 14px;
`

const Buttons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
`

interface Props {
    metadata?: AssetMetadata;
    account?: string | null
    contract?: ethers.Contract
    provider?: providers.JsonRpcProvider | undefined
    contractState: ContractState
    readyToTransact: () => Promise<boolean>
}

const OwnerAssets: React.FC<Props> = ({
    metadata,
    contract,
    contractState,
    account,
    provider,
    readyToTransact,
}) => {
    const [assets, setAsset] = useState<AssetMetadata[] | null>();
    const [open, setOpen] = useState<boolean>(false);
    const [tokenId, setTokenId] = useState<number>();
    const [total, setTotal] = useState<number>();

    const getNft = async () => {
        if (contract) {
            const balanceOf = await contract.balanceOf(account);
            setTotal(balanceOf.toNumber());
            const nftArr = [];
            if (balanceOf.toNumber() === 0) {
                setAsset(null);
                return;
            } else {
                try {
                    for (let i = 0; i < balanceOf.toNumber(); i++) {
                        const owner = await contract.tokenOfOwnerByIndex(account, i);
                        let newNft = await contract.tokenURI(owner);
                        newNft = decodeRendererV1(newNft);
                        nftArr.push(newNft)
                    }
                    setAsset(nftArr);
                } catch (e) {
                    console.log('e', e);
                }
            }
        }else {
            setAsset(null);
            setTotal(0);
        }
    }

    useEffect(() => {
        console.log('contract', contract);
        (async () => {
            getNft();
        })()
    }, [account])

    const closeModal = () => {
        setOpen(false);
    }

    const openModal = (id: number) => {
        setOpen(true);
        setTokenId(id);
    }

    const handleBurn = async (evt: any) => {
        evt.preventDefault()
        let ready = await readyToTransact()
        if (!ready || !contract) return
        console.log('provider', provider);
        try {
            const res = await contract.burn(tokenId).then(async (b: any) => {
                closeModal();
                if (provider) {
                    provider.on(b.hash, async () => {
                        await updateTransaction(b.hash).then((tx) => {
                            console.log('burn tx', tx);
                            if (tx.receipt) {
                                provider.off(b.hash)
                                getNft();
                            }
                        })
                    })
                }

            })
            // console.log('burn result:', res);
        } catch (e) {
            console.log(`tx response: ${e}`)
        }
    }

    return (
        <>
            <h3>Assets {total ? `(${total})` : null}</h3>
            <ImageWrap>
                {assets ? assets.map((asset) => {
                    return (
                        <ImageContainer key={asset.image}>
                            <img src={asset.image} />
                            <p>{asset.name}</p>
                            <Burn onClick={(e) => {
                                openModal(Number(asset.name))
                            }}>Burn</Burn>
                        </ImageContainer>
                    )
                }) :
                    <h3>No Assets</h3>
                }
                <Modal isOpen={open} onClose={closeModal}>
                    <h3>Confirm Burn</h3>
                    <p>Burn token {tokenId}</p>
                    <Buttons>
                        <Button onClick={closeModal} color="#ACACAC" >Cancel</Button>
                        <Button onClick={handleBurn}>Burn</Button>
                    </Buttons>
                </Modal>
            </ImageWrap>
        </>
    )
}

export default OwnerAssets
