import styles from '../../styles/modules/newTokenID/createAndLoginAccount.module.css';
import { IoIosArrowBack } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { useState, useEffect } from 'react';
import moment from 'moment';
import PuffLoader from 'react-spinners/PuffLoader';
import { Magic } from 'magic-sdk';
import { isMobile } from 'react-device-detect';
import {
  AddEmailOn,
  ConnectAddress,
  LocalStorage,
  LoginOff,
  LogoutOn,
} from '../../store/actions/toggle';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const MagicLinkLoginComponent = ({ loginOpen, setLoginOpen }) => {
  const backendUrl = `https://accounts.color.museum/`;
  const [token, setToken] = useState(null);
  const [createAccountError, setCreateAccountError] = useState('');
  const [ca, setConnectedAddress] = useState('');
  const makeid = (length) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(async () => {
    let userData = localStorage.getItem('userData');
    if (userData == undefined) {
      localStorage.removeItem('userData');
    }
    userData = localStorage.getItem('userData');
    if (userData) {
      userData = JSON.parse(userData);
      setUserData(userData);
      if (userData.id) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('account');
    localStorage.removeItem('utm_source');
    localStorage.removeItem('utm_medium');
    localStorage.removeItem('utm_campaign');
    localStorage.removeItem('utm_term');
    localStorage.removeItem('utm_content');
    localStorage.removeItem('utm_id');
    setLoggedIn(false);
    dispatch(ConnectAddress(''));
    localStorage.clear('connectedAddress');
    localStorage.clear('color_museum_wallet_type');
    localStorage.clear('color_museum_wallet_expiry');
    dispatch(LogoutOn());
  };

  useEffect(() => {
    setConnectedAddress(localStorage.getItem('connectedAddress'));
    if (ca !== 'undefined' || 'null') {
      setLoginOpen(true);
    }
  }, []);

  const getAccount = async (email) => {
    let user = await axios.get(`${backendUrl}getUserByEmail/${email}`);
    return user.data;
  };

  // function that generate character random string

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let connectedAddress = localStorage.getItem('account');
    const { elements } = e.target;
    const utm_source = localStorage.getItem('utm_source');
    const utm_medium = localStorage.getItem('utm_medium');
    const utm_campaign = localStorage.getItem('utm_campaign');
    const utm_term = localStorage.getItem('utm_term');
    const utm_content = localStorage.getItem('utm_content');
    const utm_id = localStorage.getItem('utm_id');

    // the Magic code
    const did = await new Magic(
      'pk_live_7437D653549954B9'
    ).auth.loginWithMagicLink({ email: elements.email.value });

    let random_id = makeid(30);

    if (did) {
      setToken(did);

      let { data: accounts, error } = await getAccount(elements.email.value);
      let insertObject = { email: elements.email.value, knock_id: random_id };

      if (connectedAddress) {
        insertObject[connectedAddress] = [connectedAddress];
      }

      if (connectedAddress) {
        insertObject['connectedAddress'] = [connectedAddress];
      }
      if (utm_medium !== 'null' && utm_medium !== 'undefined') {
        insertObject['utm_medium'] = utm_medium;
      }
      if (utm_campaign !== 'null' && utm_campaign !== 'undefined') {
        insertObject['utm_campaign'] = utm_campaign;
      }
      if (utm_term !== 'null' && utm_term !== 'undefined') {
        insertObject['utm_term'] = utm_term;
      }
      if (utm_source !== 'null' && utm_source !== 'undefined') {
        insertObject['utm_source'] = utm_source;
      }
      if (utm_content !== 'null' && utm_content !== 'undefined') {
        insertObject['utm_content'] = utm_content;
      }

      if (utm_id !== 'null' && utm_id !== 'undefined') {
        insertObject['utm_id'] = utm_id;
      }

      if (error1) {
        console.log(error1);
        setCreateAccountError('Something went wrong');
      } else {
        let { data: accounts, error } = await getAccount(elements.email.value);
        localStorage.setItem('userData', JSON.stringify(accounts[0]));
        if (accounts.length < 1) {
          // sign up to knock site

          const {
            data: { data: data1, error: error1 },
          } = await axios.post(
            'https://accounts.color.museum/createUser',
            insertObject
          );
          if (error1) {
            setCreateAccountError('Something went wrong');
          } else {
            let { data: accounts, error } = await getAccount(
              elements.email.value
            );
            localStorage.setItem('userData', JSON.stringify(accounts[0]));
            loginOpen();
          }
        } else {
          // update connected wallet address
          let updateAcount = false;
          if (connectedAddress) {
            updateAcount = true;
          }
          if (updateAcount) {
            let newAddresses = Array.from(
              new Set([...accounts[0].connectedAddress, connectedAddress])
            );
            const {
              data: { data: data1, error: error1 },
            } = await axios.post(`${backendUrl}updateAddress`, {
              email: elements.email.value,
              newAddresses: newAddresses,
            });
            if (error1) {
              setCreateAccountError('Something went wrong');
            } else {
              localStorage.setItem('userData', JSON.stringify(accounts[0]));
              loginOpen();
            }
          }
        }
      }
      setLoading(true);
    }

    // Once we have the token from magic,
    // update our own database
    // const authRequest = await fetch()

    // if (authRequest.ok) {
    // We successfully logged in, our API
    // set authorization cookies and now we
    // can redirect to the dashboard!
    // router.push('/dashboard')
    // } else { /* handle errors */ }
  };

  useEffect(() => {
    if (localStorage.getItem('skipDate')) {
      let newDate = new Date();
      let date = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      let hours = newDate.getHours();
      const nextDay = date + '/' + month + '/' + year + ' ' + hours;
      const day = localStorage.getItem('skipDate');
      let ms = moment(nextDay, 'DD/MM/YYYY HH').diff(
        moment(day, 'DD/MM/YYYY HH')
      );
      let d = moment.duration(ms);
      let diff = Math.floor(d.asHours()) + moment.utc(ms).format(' ');
      diff = Number(diff);
      if (diff < 24) {
        loginOpen();
      }
    }
  }, []);

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
  };
  const dispatch = useDispatch();

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack onClick={() => setLoginOpen(false)} />}
      className={styles.newSlideContainer}
      isOpen={loginOpen}
      title={
        <div className={styles.newPurchaseTitle}>
          {loggedIn ? 'Account' : 'Login'}
          <IoCloseSharp onClick={() => setLoginOpen(false)} />
        </div>
      }
      width={isMobile ? '100%' : '30%'}
      onRequestClose={() => {
        setLoginOpen(false);
      }}
    >
      {loggedIn ? (
        <>
          <div className={styles.content}>
            <h5 className={styles.newDesignHeader}>ACCOUNT {userData.email}</h5>
            {userData.email === null && (
              <button
                className={styles.newWhiteButton}
                onClick={() => {
                  dispatch(AddEmailOn());
                  dispatch(LoginOff());
                  setLoginOpen(false);
                }}
                style={{ marginTop: '1rem' }}
              >
                ADD EMAIL
              </button>
            )}
          </div>
          <div className={styles.leftSmallButton}>
            <button className={styles.newWhiteButton} onClick={logout}>
              Logout
            </button>
          </div>
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
                loginOpen();
                handleSkip();
              }}
            >
              Skip
            </button>
          </div>
        </>
      )}
    </SlidingPane>
  );
};

export default MagicLinkLoginComponent;
