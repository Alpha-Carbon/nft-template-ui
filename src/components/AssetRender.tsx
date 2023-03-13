import styled from 'styled-components'
import { AssetMetadata } from '../utils/decoding'
import { Processing } from './Processing'

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

interface Props {
    metadata?: AssetMetadata
}

const OwnerAssets: React.FC<Props> = ({ metadata }) => {
    return (
        <ImageWrap>
            <ImageContainer>
                <img src={metadata?.image} />
                <p>123432</p>
                <Burn>Burn</Burn>
            </ImageContainer>
        </ImageWrap>
    )
}

export default OwnerAssets
