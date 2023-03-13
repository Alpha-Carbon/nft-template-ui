import styled from 'styled-components'

import { AssetMetadata } from '../utils/decoding'

const ImageContainer = styled.div`
    display:inline-block;
    & img {
        width:200px;
        height:200px;
    }
`

interface Props {
    metadata: AssetMetadata
}

const AssetRenderer: React.FC<Props> = ({ metadata }) => {
    return (
        <ImageContainer>
            <img src={metadata.image} />
        </ImageContainer>
    )
}

export default AssetRenderer
