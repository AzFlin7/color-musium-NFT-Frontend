import React, { useState } from 'react';
import styles from '../../styles/modules/fixedCollapeFooter.module.css';
import PuffLoader from 'react-spinners/PuffLoader';
import toast from 'react-hot-toast';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { IoClose, IoCloseSharp } from 'react-icons/io5';
import { FiArrowUpRight } from 'react-icons/fi';
import axios from 'axios';

const DiscountContainer = () => {
  const backendUrl = `https://accounts.color.museum/`;
  // const backendUrl = `http://localhost:3000/`;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    let connectedAddress = localStorage.getItem('userWalletAccountData');
    e.preventDefault();
    const { elements } = e.target;
    const email = elements.email.value;
    console.log('submit');
    setLoading(true);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let res;
    let insertObject = {};
    const utm_source = localStorage.getItem('utm_source');
    const utm_medium = localStorage.getItem('utm_medium');
    const utm_campaign = localStorage.getItem('utm_campaign');
    const utm_term = localStorage.getItem('utm_term');
    const utm_content = localStorage.getItem('utm_content');
    const utm_id = localStorage.getItem('utm_id');
    insertObject['Address'] = connectedAddress;
    insertObject['email'] = email;
    insertObject['utm_source'] = utm_source;
    insertObject['utm_medium'] = utm_medium;
    insertObject['utm_campaign'] = utm_campaign;
    insertObject['utm_term'] = utm_term;
    insertObject['utm_content'] = utm_content;
    insertObject['utm_id'] = utm_id;
    if (email && re.test(email))
      res = await axios.post(`${backendUrl}createDiscountPin/`, {
        insertObject: insertObject,
      });
    console.log(res, 'result_createPIn');
    toast(
      <div className={'toastComman'}>
        {email && re.test(email) && res.data.status == 'success'
          ? `Code sent to ${email}`
          : email && re.test(email) && res.data.status == 'failed'
          ? `createPin failed. ${email} is used before!`
          : email && re.test(email) && res.data.status == 'Creating Pin failed'
          ? 'Create Pin Failed'
          : !email
          ? 'Enter an email address.'
          : !re.test(email) && 'Invalid email address'}
        <IoClose
          size={25}
          onClick={(t) => {
            toast.dismiss(t.id);
          }}
        />
      </div>,
      {
        style: {
          border: '1px solid #f0291a',
        },
      }
    );
    setTimeout(() => {
      elements.email.value = null;
      setLoading(false);
    }, 1000);
  };

  const [whiteTheme, setWhiteTheme] = useState(true);

  return (
    <div
      className={`${styles.fixedCollapeFooter} ${styles.activeHome} ${styles.mobileHeigth}`}
      style={{
        position: 'relative',
        width: '100%',
        zIndex: '1',
        backgroundColor: whiteTheme && '#FAFAF6',
        borderColor: whiteTheme && '#272727',
      }}
    >
      <div className={styles.openFixedCollpe}>
        <div className={styles.leftContent}>
          <div className={styles.innerLeftContent}>
            <h2
              style={{
                color: whiteTheme && '#060606',
              }}
            >
              SPECIAL OFFER
            </h2>
            <h1
              style={{
                color: whiteTheme && '#060606',
              }}
            >
              {' '}
              EXPAND YOUR PALETTE AND GET 30% OFF.
            </h1>
            <p
              style={{
                color: whiteTheme && '#060606',
                marginBottom: '18px',
              }}
            >
              Mint 1 Color NFT and save 30% on each color you add to your
              collection.
            </p>
            <p
              style={{
                color: whiteTheme && '#060606',
                display: 'flex',
                alignItems: ' center',
                gap: '10px',
              }}
            >
              Offer expires:{' '}
              <a
                href='https://www.youtube.com/watch?v=zaR3sVpTB98&t=389s'
                target='_blank'
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 700,
                }}
              >
                Soon.
                <span
                  style={{
                    marginLeft: '0.25rem',
                    height: '20px',
                    width: '20px',
                  }}
                >
                  <FiArrowUpRight />
                </span>
              </a>
            </p>
          </div>
        </div>
        <div className={styles.rightContent}>
          <form
            className={styles.newCreateLoginAccount}
            onSubmit={handleSubmit}
          >
            <p
              style={{
                color: whiteTheme && '#060606',
              }}
            >
              Code required to activate discount pricing.
            </p>
            <div className={styles.inputAndButton}>
              <input
                placeholder='Enter your email'
                type='text'
                name='email'
                style={{
                  borderColor: whiteTheme && '#060606',
                }}
              />
              <button
                type='submit'
                className={`${styles.newWhiteButton} ${
                  loading && styles.loadButton
                }`}
                style={{
                  borderColor: whiteTheme && '#060606',
                }}
              >
                {loading && (
                  <div className={styles.puffLoader}>
                    <PuffLoader color='#000' size={30} />
                  </div>
                )}
                SEND MY CODE
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* <div className={styles.collapeIcon}>
        <MdKeyboardArrowDown size={50} color={'#fff'} />
      </div> */}
    </div>
  );
};

export default DiscountContainer;
