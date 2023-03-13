import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { SubTitle, Field } from ".";

interface DescriptProps {
    contract?: ethers.Contract
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

const Descript: React.FC<DescriptProps> = ({ contract }) => {
    const [name, setName] = useState<any>();
    useEffect(() => {
        (async () => {
            if (contract) {
                const name = await contract.name().then((res: any) => {
                    setName(res)
                })
            }
        })()
    }, [])
    return (
        <Wrap>
            <SubTitle>
                {name}
            </SubTitle>
            <Field>
                {name} is a showcase of ERC-721. Support simple operation such as mint, burn. There are four shapes of NFT can be minted right now: circle, cross, square and triangle. </Field>
        </Wrap>

    )
}

export default Descript;