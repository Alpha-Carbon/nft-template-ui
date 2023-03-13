import Document, {
    Head,
    Html,
    Main,
    NextScript,
    DocumentContext,
    DocumentInitialProps,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps> {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    render() {
        return (
            <Html>
                <Head />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
                {/* <style */}
                {/*     dangerouslySetInnerHTML={{ */}
                {/*         __html: fontFace, */}
                {/*     }} */}
                {/* /> */}
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

const fontFace = `
@font-face {
  font-family: 'Fredericka the Great';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local(''),
       url('/memenumbers-ui/fonts/fredericka-the-great-v10-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/memenumbers-ui/fonts/fredericka-the-great-v10-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

/* pangolin-regular - latin */
@font-face {
  font-family: 'Pangolin';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local(''),
       url('/memenumbers-ui/fonts/pangolin-v6-latin-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('/memenumbers-ui/fonts/pangolin-v6-latin-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}
`
