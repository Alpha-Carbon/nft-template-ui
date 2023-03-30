import { ethers } from "ethers"
import { useState } from "react"
import styled from "styled-components"
import { Button } from "."
import Modal from "./Modal"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-flip';
import 'swiper/css/navigation';
import { FreeMode, Navigation } from 'swiper';
import RightSVG from "./Right"
import LeftSVG from "./Left"
import { AssetData } from "./AssetRender"


const ModalTitle = styled.h3`
    text-align: center;
    font-weight: 700;
    font-size: 32px;
    margin-top: 0;
    margin-bottom: 24px;
`

const ModalText = styled.p`
    text-align: center;
    font-size: 24px;
    margin-bottom: 40px;
`

const ModalInput = styled.div`
    color: #222222;
    border-bottom: 1px solid #EDEDED;
    margin-bottom: 16px;
    position: relative;

    &>label {
        display: block;
        font-size: 14px;
    }
    &>p {
        margin-top: 8px;
        margin-bottom: 16px;
        font-weight: 700;
    }
    .swiper-wrap {
        margin-top: 8px;
        margin-bottom: 16px;
        position: relative;

        .mySwiper {
            width: 100%;
        }
        .swiper-button-next,
        .swiper-button-prev {
          position: absolute;
        
          &::after {
            content: '';
          }
        }
        .swiper-button-next {
            right: -24px;
        }
        .swiper-button-prev{
            left: -24px;
        }
    }
`

const Shape = styled.div`
    background: #2B396A;
    border-radius: 8px 0px;
    padding: 16px;
    text-align: center;
    &>span {
        color: #BFBFBF;
        margin-bottom: 8px;
        display: block;
    }
    &>p {
        color: #ffffff;
        margin: 0;
    }
`

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: ${(props) => props.justifyContent || 'unset'};
`

const Burn = styled.button`
    color: #AE1717;
    border: 1px solid #AE1717;
    border-radius: 8px;
    text-align: center;
    font-weight: 700;
    font-size: 16px;
    background: none;
    padding: 24px;
    margin: 0 16px;
    cursor: pointer;
`

const Buttons = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-bottom: 30px;
    margin-left: 16px;
    margin-right: 16px;
    &>button {
        flex: 1;
        font-weight: 700;
        padding: 24px;
        border-radius: 8px;
    }
`

type IAssetInfoModal = {
    asset: AssetData;
    open: boolean;
    setOpen: (boolean: boolean) => void;
    contract?: ethers.Contract
    readyToTransact: () => Promise<boolean>
}

export const AssetInfoModal = ({ asset, open, setOpen, readyToTransact, contract }: IAssetInfoModal) => {

    const [isBurnState, setIsBurnState] = useState<boolean>(false);

    const closeModal = () => {
        setOpen(false);
        setIsBurnState(false);
    }

    const handleBurn = async (evt: any) => {
        evt.preventDefault()
        let ready = await readyToTransact()
        if (!ready || !contract) return
        closeModal();
        try {
            const res = await contract.burn(asset?.name)
            // console.log('burn result:', res);
        } catch (e) {
            console.log(`tx response: ${e}`)
        }
    }

    return (
        <Modal isOpen={open} onClose={closeModal} height={'590px'}>
            {isBurnState ? <>
                <ModalContainer justifyContent={'center'}>
                    <ModalTitle>Confirm Burn</ModalTitle>
                    <ModalText>Burn token {asset?.tokenId}</ModalText>
                </ModalContainer>
                <Buttons>
                    <Button onClick={closeModal} color="#ACACAC" >Cancel</Button>
                    <Button onClick={handleBurn} color="#AE1717" >Burn</Button>
                </Buttons>
            </> :
                <>
                    <ModalTitle>Info</ModalTitle>
                    <ModalContainer>
                        <ModalInput>
                            <label htmlFor="">Token ID</label>
                            <p>{asset?.tokenId}</p>
                        </ModalInput>
                        <ModalInput>
                            <label htmlFor="">Name</label>
                            <p>{asset?.name}</p>
                        </ModalInput>
                        <ModalInput>
                            <label htmlFor="">Description</label>
                            <p>{asset?.description}</p>
                        </ModalInput>
                        <ModalInput>
                            <label htmlFor="">Attributes</label>
                            <div className="swiper-wrap">
                                <Swiper
                                    pagination={true}
                                    navigation={{
                                        nextEl: '.swiper-button-next',
                                        prevEl: '.swiper-button-prev',
                                    }}
                                    slidesPerView={3}
                                    spaceBetween={16}
                                    freeMode={true}
                                    modules={[FreeMode, Navigation]}
                                    className="mySwiper"
                                >
                                    {asset && asset.attributes.map((attr) => (
                                        <SwiperSlide key={attr.trait_type}>
                                            <Shape>
                                                <span>{attr.trait_type}</span>
                                                <p>{attr.value}</p>
                                            </Shape>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <div className="swiper-button-next">
                                    <RightSVG />
                                </div>
                                <div className="swiper-button-prev">
                                    <LeftSVG />
                                </div>
                            </div>
                        </ModalInput>
                    </ModalContainer>
                    <Burn onClick={() => {
                        setIsBurnState(true);
                    }}>Burn</Burn>
                </>
            }

        </Modal>
    )
}