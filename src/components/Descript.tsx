import styled from "styled-components";
import { SubTitle, Field } from ".";

const Wrap = styled.div`
    &>h3 {
        margin-bottom: 16px;
    }
    &>p {
        margin-top: 0;
        margin-bottom: 24px;
    }
`

const Descript: React.FC = () => {
    return (
        <Wrap>
            <SubTitle>
                NFT_NAME
            </SubTitle>
            <Field>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type.
            </Field>
        </Wrap>

    )
}

export default Descript;