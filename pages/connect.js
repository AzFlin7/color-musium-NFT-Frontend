import Head from 'next/head';
import React from 'react';
import Connect from '../components/Connect/Connect';

const connect = () => {
  return (
    <>
      <Head>
        <title>Connect Your Wallet</title>
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
      <Connect />
    </>
  );
};

export default connect;
