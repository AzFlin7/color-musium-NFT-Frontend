import Head from 'next/head';
import Terms from '../components/Terms/Terms';

const terms = () => {
  return (
    <>
      <Head>
        <title>Color Museum | Terms and Conditions</title>
        <meta
          name='description'
          content='Own and earn royalties from color on the Ethereum blockchain.'
        />
        <meta property='og:title' content='Color NFT by Color Museum' />
        <meta
          property='og:description'
          content='Own and earn royalties from color on the Ethereum blockchain.'
        />
        <meta property='twitter:title' content='Color NFT by Color Museum' />
        <meta
          property='twitter:description'
          content='Own and earn royalties from color on the Ethereum blockchain.'
        />
      </Head>
      <Terms />
    </>
  );
};

export default terms;
