import { ethers, providers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ContractState } from '../utils/contract'
import { AssetMetadata, decodeRendererV1 } from '../utils/decoding'
import { BornModal } from './BornModal'

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

const Info = styled.button`
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

interface Props {
    metadata?: AssetMetadata;
    account?: string
    contract?: ethers.Contract
    provider?: providers.JsonRpcProvider
    tokenBalance?: number;
    contractState: ContractState
    readyToTransact: () => Promise<boolean>
}

const getAssets = async (contract: ethers.Contract | undefined, account: string | undefined, tokenBalance: number) => {
    const assetList = [];

    if (contract && account && tokenBalance) {
        for (let i = 0; i < tokenBalance; i++) {
            try {
                // await delay(300);
                const tokenId = await contract.tokenOfOwnerByIndex(account, i);
                const token = await contract.tokenURI(tokenId);
                const asset = decodeRendererV1(token);
                // console.log('asset', asset);
                assetList.push(asset);
            } catch (e) {
                console.log('e', e);
                i -= 1;
                // await delay(3000);
            }
        }
    }
    return assetList;
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
    const [assetList, setAssetList] = useState<AssetMetadata[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [asset, setAsset] = useState<AssetMetadata>();

    useEffect(() => {
        if (tokenBalance) {
            (async () => {
                setAssetList(await getAssets(contract, account, tokenBalance));
            })()
        }
    }, [contract, account, tokenBalance])

    const closeModal = () => {
        setOpen(false);
    }

    const openModal = (asset: AssetMetadata) => {
        setOpen(true);
        setAsset(asset);
    }

    const handleBurn = async (evt: any) => {
        evt.preventDefault()
        let ready = await readyToTransact()
        if (!ready || !contract) return
        try {
            const res = await contract.burn(asset?.name).then(async (b: any) => {
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
                {assetList && assetList.length > 0 ? assetList.map((asset) => {
                    return (
                        <ImageContainer key={asset.image}>
                            <img src={asset.image} />
                            <p>{asset.name}</p>
                            <Info onClick={(e) => {
                                openModal(asset)
                            }}>Info</Info>
                        </ImageContainer>
                    )
                }) :
                    <h3>No Assets</h3>
                }
                {
                    asset && contract && readyToTransact && <BornModal
                        asset={asset}
                        open={open}
                        setOpen={setOpen}
                        contract={contract}
                        readyToTransact={readyToTransact}
                    />
                }

            </ImageWrap>
        </>
    )
}

export default OwnerAssets
