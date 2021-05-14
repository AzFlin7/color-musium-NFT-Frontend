import Head from 'next/head';
import Privacy from '../components/Privacy/Privacy';

const privacy = () => {
  return (
    <>
      <Head>
        <title>Color Museum | Privacy</title>
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
      <Privacy />
    </>
  );
};

export default privacy;
