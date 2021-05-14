import styles from '../../styles/modules/newTokenID/createAndLoginAccount.module.css';
import { IoIosArrowBack } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { Magic } from 'magic-sdk';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
  AddEmailOn,
  ConnectAddress,
  LocalStorage,
  LoginOff,
  LogoutOn,
} from '../../store/actions/toggle';
import PuffLoader from 'react-spinners/PuffLoader';
import SlideConnectWallet from '../navbar/SlideConnectWallet';
import { useWeb3React } from '@web3-react/core';
import { API_URL } from '../../utils/constants';

// import components for in-app feed frontend integration
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from '@knocklabs/react-notification-feed';

import Knock from '@knocklabs/client';
// const knockClient = new Knock(
//   'pk_test_9gKEPDBTQiLow2LZqcJDLn8lHJ7Em4Xmaso05fAi-rQ'
// );

// Required CSS import, unless you're overriding the styling
import '@knocklabs/react-notification-feed/dist/index.css';
import jwt from 'jsonwebtoken';
import { UserState } from 'realm-web';
import { jsonInterfaceMethodToString } from 'web3-utils';

const LoginComponent = ({}) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const backendUrl = `https://accounts.color.museum/`;

  const { connectedAddress } = useSelector((state) => state.minting);
  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('account');
    setLoggedIn(false);
    dispatch(ConnectAddress(''));
    localStorage.clear('connectedAddress');
    localStorage.clear('color_museum_wallet_type');
    localStorage.clear('color_museum_wallet_expiry');
    dispatch(LogoutOn());
  };

  const getAccount = async (email) => {
    let user = await axios.get(`${backendUrl}getUserByEmail/${email}`);
    return user.data;
  };
  const [connectWallet, setConnectWallet] = useState(false);

  const checkConectedAddress = () => {
    if (connectedAddress) null;
    else setConnectWallet(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let connectedAddress = localStorage.getItem('account');
    console.log(connectedAddress);
    const { elements } = event.target;
    console.log(process.env.NEXT_PUBLIC_MAGIC_PUB_KEY);

    // the Magic code
    const did = await new Magic(
      'pk_live_7437D653549954B9'
    ).auth.loginWithMagicLink({ email: elements.email.value });

    if (did) {
      setToken(did);
      let insertObject = { email: elements.email.value };

      let {
        data: { data: users, error: error1 },
      } = await axios.get(`${backendUrl}getUserByAddress/${connectedAddress}`);
      let accounts = [];
      if (users.length > 0) {
        let {
          data: { data: accounts, error },
        } = await axios.get(`${backendUrl}getAccountByUserId/${users[0].id}`);
        insertObject['user_id'] = users[0].id;
      } else {
        const {
          data: { data: insertedUser, error: error2 },
        } = await axios.post(`${backendUrl}insertData`, {
          tableName: 'users',
          insertData: [{ connectedAddress: account }],
          upsert: true,
        });
        insertObject['user_id'] = insertedUser[0].id;
      }

      console.log(`Accounts`);
      console.log(accounts);

      if (accounts.length < 1) {
        const {
          data: { data: data1, error: error1 },
        } = await axios.post(
          'https://accounts.color.museum/createUser',
          insertObject
        );
        console.log(data1, error1);

        if (error1) {
          console.log(error1);
          setCreateAccountError('Something went wrong');
        } else {
          let { data: accounts, error } = await getAccount(
            elements.email.value
          );
          localStorage.setItem('userData', JSON.stringify(accounts[0]));

          dispatch(LoginOff());
        }
      } else {
        // // update connected wallet address
        // let updateAcount = false;
        // if (connectedAddress) {
        //   updateAcount = true;
        // }
        // if (updateAcount) {
        //   let newAddresses = Array.from(
        //     new Set([...accounts[0].connectedAddress, connectedAddress])
        //   );
        //   const { data:{data:data1, error:error1} } = await axios.post(`${backendUrl}updateAddress`,{email:elements.email.value, newAddresses:newAddresses})
        //   if (error1) {
        //     console.log(error1);
        //     setCreateAccountError("Something went wrong");
        //   } else {
        localStorage.setItem('userData', JSON.stringify(accounts[0]));
        checkConectedAddress();
        dispatch(LoginOff());
        //     }
        //   }
        // }
      }
      setLoading(false);

      // Once we have the token from magic,
      // update our own database
      // const authRequest = await fetch()

      // if (authRequest.ok) {
      // We successfully logged in, our API
      // set authorization cookies and now we
      // can redirect to the dashboard!
      // router.push('/dashboard')
      // } else { /* handle errors */ }
    }
  };
  //
  const dispatch = useDispatch();
  const { loginComponent } = useSelector((state) => state.toggle);

  const handleSkip = () => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let hours = newDate.getHours();
    const day = date + '/' + month + '/' + year + ' ' + hours;
    if (localStorage.getItem('skipDate')) {
      localStorage.clear('skipDate');
      localStorage.setItem('skipDate', day);
      dispatch(LocalStorage());
    } else {
      localStorage.setItem('skipDate', day);
      dispatch(LocalStorage());
    }
    dispatch(LocalStorage());
  };
  const isiOS = function iOS() {
    return (
      [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod',
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    );
  };
  const lockScroll = React.useCallback(() => {
    document.body.dataset.scrollLock = 'true';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = 'var(--scrollbar-compensation)';

    if (isiOS) {
      const scrollOffset = window.pageYOffset;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollOffset.current}px`;
      document.body.style.width = '100%';
    }
  }, []);

  const unlockScroll = React.useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    if (isiOS) {
      const scrollOffset = window.pageYOffset;

      document.body.style.position = '';
      document.body.style.top = ``;
      document.body.style.width = '';
      window.scrollTo(0, scrollOffset.current);
    }
    delete document.body.dataset.scrollLock;
  }, []);
  useEffect(() => {
    if (loginComponent) lockScroll();
    if (!loginComponent) unlockScroll();
  }, [loginComponent]);

  return (
    <>
      <SlidingPane
        closeIcon={<IoIosArrowBack onClick={() => dispatch(LoginOff())} />}
        className={styles.newSlideContainer}
        isOpen={loginComponent}
        title={
          <div className={styles.newPurchaseTitle}>
            {loggedIn ? 'Account' : 'Login'}
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <IoCloseSharp onClick={() => dispatch(LoginOff())} />
            </span>
          </div>
        }
        width={isMobile ? '100%' : '30%'}
        onRequestClose={() => {
          dispatch(LoginOff());
        }}
      >
        {loggedIn ? (
          <>
            <div className={styles.content}>
              <h5 className={styles.newDesignHeader}>
                ACCOUNT {userData.email}
              </h5>
              {(userData.email === null || userData.email == '') && (
                <button
                  className={styles.newWhiteButton}
                  onClick={() => {
                    dispatch(AddEmailOn());
                    dispatch(LoginOff());
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  ADD EMAIL
                </button>
              )}
            </div>
            <div className={styles.leftSmallButton} style={{ opacity: '1' }}>
              <button
                className={styles.newWhiteButton}
                onClick={logout}
                style={{ opacity: '1' }}
              >
                Logout
              </button>
            </div>
            {/* tag for in-app feed */}
          </>
        ) : (
          <>
            <div className={styles.content}>
              <div className={styles.contentTitle}>
                <h1 className={styles.newDesignHeader}>CREATE ACCOUNT </h1>
                <span>OR LOGIN</span>
              </div>
              <form
                className={styles.newCreateLoginAccount}
                onSubmit={handleSubmit}
              >
                <label>Email Address:</label>
                <input
                  placeholder='Enter your email to create an account or login'
                  type='text'
                  name='email'
                />
                <button
                  type='submit'
                  className={`${styles.newWhiteButton} ${
                    loading && styles.loadButton
                  }`}
                >
                  {loading && (
                    <PuffLoader
                      className={styles.BtnPuffLoader}
                      color='#000'
                      size={30}
                    />
                  )}
                  proceed
                </button>
              </form>
            </div>
            <div className={styles.leftSmallButton}>
              <button
                className={styles.newBorderButton}
                onClick={() => {
                  dispatch(LoginOff());
                  handleSkip();
                  dispatch(LocalStorage());
                  checkConectedAddress();
                }}
              >
                Skip
              </button>
            </div>
          </>
        )}
      </SlidingPane>
      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
    </>
  );
};

export default LoginComponent;
