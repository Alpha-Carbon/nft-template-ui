import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { formatEther } from '@ethersproject/units'

import { ContractState } from '../utils/contract'
import { DefaultFont, Field, Value, EtherSymbol } from '../components'

const Set = styled.div`
    display: inline-block;
    padding-right: 100px;
`

const Num = styled.span`
    ${DefaultFont}
    vertical-align: top;
    margin-right: 20px;

    color: rgba(166, 250, 255, 1);
    font-size: 36px;
    opacity: 1;
    cursor: pointer;

    &:hover {
        opacity: 0.4;
    }
`

// const DelNum = styled.del`
//     ${PangolinFont}
//     display: inline-block;
//     vertical-align: top;
//     margin-right: 20px;

//     font-size: 36px;
//     opacity: 1;
// `

interface DutchAuctionProps {
    contractState: ContractState
    onSelect: (name: string) => void
}

const AuctionItem: React.FC<DutchAuctionProps> = ({
    contractState: { price },
    onSelect,
}) => {
    // const batch = forSale.map((x) => {
    //     const num = x.toString()
    //     return (
    //         <React.Fragment key={`auctionItem${num}`}>
    //             <Num onClick={() => onSelect(num)}>{num}</Num>{' '}
    //         </React.Fragment>
    //     )
    // })

    return (
        <div>
            <Set>
                <Field>Time Left:</Field>
            </Set>
            <Set>
                <Field>Price:</Field>
                <Value>
                    <EtherSymbol /> {formatEther(price)}
                </Value>
            </Set>

            <Field>For Sale:</Field>
            {/* {batch} */}
        </div>
    )
}

export default AuctionItem
