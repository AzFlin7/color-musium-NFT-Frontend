import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  //--------------For styled-components only------------//
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  //---------------------------------------------------//
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link
            href='/fonts/Plaid-L/Plaid-L.eot'
            rel='preload'
            as='font'
            type='font/eot'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-L/Plaid-L.woff'
            rel='preload'
            as='font'
            type='font/woff'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-L/Plaid-L.woff2'
            rel='preload'
            as='font'
            type='font/woff2'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-L-Mono/Plaid-L-Mono.eot'
            rel='preload'
            as='font'
            type='font/eot'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-L-Mono/Plaid-L-Mono.woff'
            rel='preload'
            as='font'
            type='font/woff'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-L-Mono/Plaid-L-Mono.woff2'
            rel='preload'
            as='font'
            type='font/woff2'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-M/Plaid-M.woff'
            rel='preload'
            as='font'
            type='font/woff'
            crossOrigin=''
          />
          <link
            href='/fonts/Plaid-M/Plaid-M.woff2'
            rel='preload'
            as='font'
            type='font/woff2'
            crossOrigin=''
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
