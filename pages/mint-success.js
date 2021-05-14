import Head from 'next/head';
import React from 'react';
import Header from '../components/Choose/Header';
import Success from '../components/Mint/Success';
import styles from '../styles/modules/choose/choose.module.css';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const mint_success = () => {
  const { localStorageChange } = useSelector((state) => state.toggle);
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('mint-success-access')) {
      router.push('/');
    }
  }, [localStorageChange]);
  return (
    <>
      <Head>
        <title>Color Museum | Mint Color NFT</title>
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
        <Header mint={true} />
        <Success />
      </section>
    </>
  );
};

export default mint_success;