import type { Page } from '../src/types/PageComponent'

import styled from 'styled-components'
import Head from 'next/head'
// import { useRouter } from 'next/router'
import Layout from '../src/components/Layout'
import useWeb3 from '../src/hooks/useWeb3'
import Descript from '../src/components/Descript'
import Mint from '../src/components/Mint'
import OwnerAssets from '../src/components/AssetRender'

const Home: Page = () => {
    // const { basePath } = useRouter()
    const [
        { address, contractState, contract, defaultContract,provider },
        actions,
    ] = useWeb3()
    // console.log('contractState web3',assets);
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
                        <Descript 
                            name={contractState?.name}
                        />
                        <Mint
                            contractState={contractState}
                            contract={contract}
                            account={address}
                            readyToTransact={actions.ready}
                            provider={provider}
                        />
                        <OwnerAssets
                            contractState={contractState}
                            contract={contract}
                            account={address}
                            readyToTransact={actions.ready}
                            provider={provider}
                        />
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
