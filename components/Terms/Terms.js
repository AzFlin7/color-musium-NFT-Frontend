import React, { useEffect } from 'react';
import styles from '../../styles/modules/terms/terms.module.css';
import { WarningOff } from '../../store/actions/toggle';
import { useDispatch } from 'react-redux';

const Terms = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(WarningOff());
  }, []);
  return (
    <>
      <div className={styles.Wrapper}>
        <div className={styles.HeaderContainer}>
          <h1>Terms and Conditions</h1>
          <p>
            This website, located at www.color.museum, is an
            interface created to help users interact with the Color NFT and 0xv4 NFT 
            trade settlement smart contracts deployed on the Ethereum mainnet. Ownership
            of Color NFTs is not managed on this website or by Color Museum Limited. Users 
            are responsible for the safety and management of their Ethereum wallets.
            By using this website, you agree to hold Color Museum Limited
            harmless from all problems, errors and failures, despite cause or
            source of the aforementioned and accept sole responsibility for all
            transactions conducted.{' '}
          </p>
          <p>
            These terms and conditions are subject to change, all revisions will
            be posted on this page.
          </p>
          <p>Last updated on June 21, 2022</p>
        </div>
      </div>
    </>
  );
};

export default Terms;
