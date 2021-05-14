import Head from 'next/head';
import React from 'react';
import Issues from '../components/Issues/Issues';

const issues = () => {
  return (
    <>
      <Head>
        <title>Issues</title>
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
      <Issues />
    </>
  );
};

export default issues;
