import { ethers, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContractState } from '../utils/contract'
import { AssetMetadata, decodeRendererV1 } from '../utils/decoding'
import Modal from './Modal'
import { Button } from '.'
import { updateTransaction } from '../hooks/useWeb3'
import delay from '../utils/delay'

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

    & p {
        margin:4px 8px;
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
    margin-bottom: 30px;
    &>button {
        padding: 8px 16px;
    }
`

const ModalTitle = styled.h3`
    text-align: center;
    font-weight: 700;
    font-size: 32px;
    margin-bottom: 24px;
`

const ModalText = styled.p`
    text-align: center;
    font-size: 24px;
    margin-bottom: 40px;
`

interface Props {
    metadata?: AssetMetadata;
    account?: string | null
    contract?: ethers.Contract
    provider?: providers.JsonRpcProvider | undefined
    tokenBalance?: number;
    contractState: ContractState
    readyToTransact: () => Promise<boolean>
}

const OwnerAssets: React.FC<Props> = ({
    metadata,
    contract,
    contractState,
    account,
    provider,
    tokenBalance,
    readyToTransact,
}) => {
    const [assetList, setAssetList] = useState<AssetMetadata[] | null>();
    const [open, setOpen] = useState<boolean>(false);
    const [tokenId, setTokenId] = useState<number>();

    const getNft = async () => {
        if (contract && tokenBalance) {
            const nftArr = [];
            if (tokenBalance === 0) {
                setAssetList(null);
                return;
            } else {
                for (let i = 0; i < tokenBalance; i++) {
                    try {
                        await delay(300);
                        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
                        const token = await contract.tokenURI(tokenId);
                        const asset = decodeRendererV1(token);
                        nftArr.push(asset)
                    } catch (e) {
                        console.log('e', e);
                        i -= 1;
                        await delay(3000);
                    }
                }
                setAssetList([...nftArr]);
            }
        } else {
            setAssetList(null);
        }
    }

    useEffect(() => {
        (async () => {
            await getNft();
        })()
    }, [account, tokenBalance])

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
        try {
            const res = await contract.burn(tokenId).then(async (b: any) => {
                closeModal();
            })
            // console.log('burn result:', res);
        } catch (e) {
            console.log(`tx response: ${e}`)
        }
    }

    return (
        <>
            <h3>Assets {tokenBalance ? `(${tokenBalance})` : null}</h3>
            <ImageWrap>
                {assetList ? assetList.map((asset) => {
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
                    <ModalTitle>Confirm Burn</ModalTitle>
                    <ModalText>Burn token {tokenId}</ModalText>
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
