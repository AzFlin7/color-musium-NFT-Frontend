import styles from '../styles/modules/choose/choose.module.css';
import Head from 'next/head';
import Header from '../components/Choose/Header';
import Pending from '../components/Mint/Pending';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const mint_pending = () => {
  const { localStorageChange } = useSelector((state) => state.toggle);
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('mint-pending-access')) {
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
        <Pending />
      </section>
    </>
  );
};

export default mint_pending;
