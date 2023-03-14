import { ethers } from "ethers";
import styled from "styled-components";
import { SubTitle, Field } from ".";

interface DescriptProps {
    name?: string
}

const Wrap = styled.div`
    &>h3 {
        margin-bottom: 16px;
    }
    &>p {
        margin-top: 0;
        margin-bottom: 24px;
    }
`

const Descript: React.FC<DescriptProps> = ({ name }) => {
    return (
        <Wrap>
            <SubTitle>
                {name ? name : 'NFT Template'}
            </SubTitle>
            <Field>
                {name ? name : 'NFT Template'} is a showcase of ERC-721. Support simple operation such as mint, burn. There are four shapes of NFT can be minted right now: circle, cross, square and triangle. </Field>
        </Wrap>

    )
}

export default Descript;