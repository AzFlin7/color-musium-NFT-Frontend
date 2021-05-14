import Head from 'next/head';
import Mint from '../components/Mint/Mint';
import styles from '../styles/modules/choose/choose.module.css';
import Header from '../components/Choose/Header';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectAddress } from '../store/actions/toggle';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connector';

const mint = () => {
  const { activate, account } = useWeb3React();
  const dispatch = useDispatch();
  const { logout } = useSelector((state) => state.toggle);
  // useEffect(() => {
  //   if (account !== undefined && !logout) {
  //     dispatch(ConnectAddress(account));
  //   }
  // }, [account, logout]);

  const [loader, setLoader] = useState(false);

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
        <Mint loader={loader} />
      </section>
    </>
  );
};

export default mint;
