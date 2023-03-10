import type { Page } from '../src/types/PageComponent'

import styled from 'styled-components'
import Head from 'next/head'
// import { useRouter } from 'next/router'

import Layout from '../src/components/Layout'
import OwnerCheck from '../src/components/OwnerCheck'
import DutchAuction from '../src/components/DutchAuction'
import Operations from '../src/components/Operations'
import useWeb3 from '../src/hooks/useWeb3'

const Home: Page = () => {
    // const { basePath } = useRouter()
    const [
        { address, contractState, contract, defaultContract },
        actions,
    ] = useWeb3()

    return (
        <div>
            <Head>
                <title>MemeNumbers</title>
                <meta name="description" content="MemeNumbers" />
                <link rel="icon" href={'/favicon.ico'} />
            </Head>

            <Main>
                {/* <Web2 /> */}

                {contractState && (
                    <div>
                        <Segment />
                        <DutchAuction
                            contractState={contractState}
                            contract={contract}
                            account={address}
                            readyToTransact={actions.ready}
                        />

                        <Segment />
                        <OwnerCheck
                            account={address}
                            contract={defaultContract}
                        />

                        <Segment />
                        {/* <Operations
                            account={address}
                            contract={contract}
                            readyToTransact={actions.ready}
                        /> */}
                    </div>
                )}
            </Main>
        </div>
    )
}

/*
 */

Home.layout = Layout

export default Home

const Main = styled.main`
    // background-color: hsl(0deg 0% 10%);
`

const Segment = styled.div`
    width: 100%;
    height: 3px;
    background: rgba(196, 196, 196, 1);
    opacity: 0.1;
    overflow: hidden;
    margin: 2em auto;
`

// sad
const Web2 = () => {
    return (
        <div>
            <h1>
                {
                    "You don't have to be a mathematician to have a feel for numbers."
                }
            </h1>

            <p>- John Forbes Nash, Jr.</p>
        </div>
    )
}
