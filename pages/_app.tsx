import type { AppProps } from 'next/app'
import type { Page } from '../src/types/PageComponent'

import { Fragment } from 'react'
import { createGlobalStyle } from 'styled-components'

import { Web3Provider } from '../src/hooks/useWeb3'

const GlobalStyle = createGlobalStyle`
body {
    font-family: 'Inter', sans-serif;
	background:#F5F5F5;
}

a {
    color: #222222;
}

#__next {
    max-width: 800px;
    margin: 0 auto;
}
`

type Props = AppProps & {
    Component: Page
}

function MyApp({ Component, pageProps }: Props) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)
    const Layout = Component.layout ?? Fragment

    // console.log(getLayout)
    // console.log(Component)
    // console.log(Layout)

    return (
        <Web3Provider>
            <GlobalStyle />
            <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
        </Web3Provider>
    )
}

export default MyApp
