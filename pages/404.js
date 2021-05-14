import Head from 'next/head';
import React from 'react';
import Error from '../components/404/404';
import styles from '../styles/modules/choose/choose.module.css';

const ErrorPage = () => {
  return (
    <>
      <Head>
        <title>Error</title>
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
      <section className={styles.wrapper} style={{ background: '#000' }}>
        <Error />
      </section>
    </>
  );
};

export default ErrorPage;
