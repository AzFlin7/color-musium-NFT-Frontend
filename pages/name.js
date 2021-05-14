import Head from 'next/head';
import Header from '../components/Choose/Header';
import Name from '../components/Name/Name';
import styles from '../styles/modules/choose/choose.module.css';

const name = () => {
  return (
    <>
      <Head>
        <title>Color Museum | Name Your Color</title>
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
        <Header name={true} />
        <Name />
      </section>
    </>
  );
};

export default name;
