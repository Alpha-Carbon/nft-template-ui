import styled, { css } from 'styled-components'

export const DefaultFont = css`
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
`

export const DefaultFontSpan = styled.span`
    ${DefaultFont}
    font-weight: 400;
    font-size: 14px;
    color: #BFBFBF;
`

export const EtherSymbol = () => <DefaultFontSpan>Ξ</DefaultFontSpan>

export const SubTitle = styled.h3`
    ${DefaultFont}
    font-weight: 700;
    font-size: 24px;
    color: #222222;
`

export const Field = styled.p`
    ${DefaultFont}
    font-size: 16px;
    opacity: 1;
`

export const Value = styled.p`
    ${DefaultFont}
    color: rgba(166, 250, 255, 1);
    font-size: 26px;
    opacity: 1;
`

export const FieldSet = styled.fieldset`
    font-size: 1em;
    padding: 0.5em;
    border-radius: 1em;
    border-width: 0;
`

export const Input = styled.input`
    ${DefaultFont}
    font-size: inherit;
    padding: 0.3em 0.4em;
    margin: 0.1em 0.2em;
    -moz-box-sizing: content-box;
    -webkit-box-sizing: content-box;
    box-sizing: content-box;

    background: rgba(51, 51, 51, 1);
    border: 2px solid rgba(255, 255, 255, 1);
`

export const Select = styled.select`
    ${DefaultFont}
    color: rgba(51, 51, 51, 1);
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border-width: 0px;
    outline: none;
    transition: 0.15s;
    text-align: center;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    height: 2.1rem;
    min-width: 6em;
    margin: 2px;

    &:active {
        background-color: #f1ac15;
    }
`

export const Submit = styled.input.attrs({
    type: 'submit',
})`
    ${DefaultFont}
    color: rgba(51, 51, 51, 1);
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    border-width: 0px;
    outline: none;
    transition: 0.15s;
    text-align: center;

    height: 2.1rem;
    min-width: 6em;
    margin: 2px;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    &:active {
        background-color: #f1ac15;
    }
`

export const Button = styled.button`
    ${DefaultFont}
    color: #FFFFFF;
    background: #2B396A;
    border-radius: 2px;
    border-width: 0px;
    outline: none;
    transition: 0.15s;
    text-align: center;
    border-radius: 52px;
    min-width: 6em;
    margin: 2px;
    padding: 14px 16px;
    cursor: pointer;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    &:active {
        opacity: 0.6;
    }
`

export const LongInput = styled(Input)`
    width: 35%;
`

export const Status = styled.div<{ isError: Error | undefined }>`
    color: ${(props) => (props.isError ? '#d30000' : 'green')};
`
