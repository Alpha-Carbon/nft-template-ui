import React from 'react'
import styled from 'styled-components'

import useWeb3 from '../hooks/useWeb3'
import { Button } from './'
import { RINKEBY, supportedChains } from '../config'

const P = styled.p`
    color: #FFFFFF;
    font-weight: 700;
    background: #AE1717;
    border-radius: 20px;
    border: 1px solid #FFFFFF;
    padding: 10px 16px;
    font-size: 16px;
    line-height: 16px;
`

const Status = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    border: 1px solid #FFFFFF;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 700;
    background: none;
    outline: none;
    border-radius: 20px;
    cursor: pointer;
`

const Web3Connect: React.FC = () => {
    const [{ address, network, onboard, ens }, { disconnect }] = useWeb3()

    const buttonContent = address
        ? ens?.name
            ? ens.name
            : shorten(address)
        : 'Connect'

    const networkDisplay = network
        ? supportedChains.includes(network)
            ? network === RINKEBY
                ? '(Rinkeby)'
                : undefined
            : 'Unsupported Network!'
        : undefined

    const isConnected = !!address
    return (
        <>
            {/* {network && network === RINKEBY ? <P>(Rinkeby)</P> : null} */}
            {networkDisplay && <P>{networkDisplay}</P>}
            <Status
                disabled={isConnected}
                key="connect"
                onClick={async () => {
                    if (await onboard?.walletSelect())
                        await onboard?.walletCheck()
                }}
            >
                {buttonContent}
            </Status>
            {isConnected && (
                <Status
                    key="disconnect"
                    onClick={async () => {
                        disconnect()
                    }}
                >
                    Disconnect
                </Status>
            )}
        </>
    )
}

function shorten(address: string | null | undefined) {
    if (!address) return ''
    return address.slice(0, 5) + '...' + address.slice(-2)
}

export default Web3Connect
