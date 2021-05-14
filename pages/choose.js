import Head from 'next/head';
import React from 'react';
import Choose from '../components/Choose/Choose';
import Header from '../components/Choose/Header';
import styles from '../styles/modules/choose/choose.module.css';

const choose = () => {
  return (
    <>
      <Head>
        <title>Color Museum | Choose A Color</title>
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
      <section className={styles.wrapper}>
        <Header choose={true} />
        <Choose />
      </section>
    </>
  );
};

export default choose;
