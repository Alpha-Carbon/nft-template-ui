import React from 'react'
import Link from 'next/link'
// import { useRouter } from 'next/router'
import styled from 'styled-components'

import Web3Connect from './Web3Connect'
import useWeb3 from '../hooks/useWeb3'
import config, { MAINNET, RINKEBY } from '../config'
import { DefaultFont } from '../components'

const Container = styled.div`
    display: flex;
    flex-direction: row;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const Navigation = styled(Container)`
    ${DefaultFont}

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: space-between;
    padding: 24px 40px;
    background-color: #2B396A;
`

const Logo = styled.a`
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    margin-left: 160px;
    color: #FFFFFF;
    text-decoration: none;
    @media (max-width: 768px) {
        margin: auto;
    }
`

const NavItem = styled.a`
    color: #FFFFFF;

    font-size: 16px;
    margin-right: 40px;
    &:hover {
        opacity: 0.6;
    }
`

const Content = styled.div`
   margin-top: 176px;
   @media (max-width: 768px) {
        margin-top: 192px;
        margin: 192px 16px 24px 16px;
    }
`

const RightNav = styled(Container)`
    justify-content: space-evenly;
    align-items: center;
    order: 1;
    gap: 24px;
    @media (max-width: 768px) {
        flex-direction: row;
        margin-top: 24px;
    }
`

//#HACK for ghpages, we need to rewrite asset paths
const Layout: React.FC = ({ children }) => {
    // const { basePath } = useRouter()
    const [{ network }, ,] = useWeb3()
    const openSeaLink =
        network === RINKEBY
            ? 'https://testnets.opensea.io/collection/memenumbers-v3'
            : 'https://opensea.io/collection/memenumbers'

    const contractLink =
        network === RINKEBY
            ? `https://rinkeby.etherscan.io/address/${config(RINKEBY).contractAddress
            }`
            : `https://etherscan.io/address/${config(MAINNET).contractAddress
            }#code`

    return (
        <>
            <Navigation>
                <Link href="/" passHref>
                    <Logo>
                        NFTemplate
                    </Logo>
                </Link>
                <RightNav>
                    {/* <Link href={openSeaLink} passHref>
                        <NavItem target="_blank" rel="noopener noreferrer">
                            OpenSea
                        </NavItem>
                    </Link> */}
                    <Web3Connect />
                </RightNav>
            </Navigation>
            <Content>{children}</Content>
        </>
    )
}

export default Layout
