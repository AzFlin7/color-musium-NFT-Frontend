import { useMotionValue } from 'framer-motion';
import { Slide } from '@chakra-ui/transition';
import { AiFillPlusCircle, AiFillTwitterCircle } from 'react-icons/ai';
import { SiDiscord } from 'react-icons/si';
import styles from '../../../styles/modules/nav.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { DockItem } from './DockItem';
import { isMobile } from 'react-device-detect';
import { RiWallet3Fill } from 'react-icons/ri';
import {
  ConnectAddress,
  LocalStorage,
  Toggle,
} from '../../../store/actions/toggle';
import { useEffect, useRef, useState } from 'react';
import { RiExchangeBoxFill } from 'react-icons/ri';
import { MdAllInclusive, MdLibraryBooks } from 'react-icons/md';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import SlideConnectWallet from '../../navbar/SlideConnectWallet';
import toast from 'react-hot-toast';
import { IoClose, IoCloseSharp } from 'react-icons/io5';

export const Dock = () => {
  const router = useRouter();

  const dockItems = isMobile
    ? {
        connect: {
          appName: 'Connect',
          icon: RiWallet3Fill,
          path: null,
          action: () => setConnectWallet(true),
        },
        mint: {
          appName: 'Mint',
          icon: AiFillPlusCircle,
          path: `${
            router.pathname === '/choose'
              ? '/choose'
              : isMobile
              ? '/choose'
              : '/mint-colors'
          }`,
        },
        trade: {
          appName: 'Trade',
          icon: RiExchangeBoxFill,
          path: '/gallery/color-nft',
        },
        earn: {
          appName: 'Earn',
          icon: MdAllInclusive,
          path: '/earn',
        },
        discord: {
          appName: 'Discord',
          icon: SiDiscord,
          external: true,
          path: 'https://discord.gg/colormuseum',
        },
        twitter: {
          appName: 'Twitter',
          icon: AiFillTwitterCircle,
          external: true,
          path: 'https://twitter.com/colordotmuseum',
        },
      }
    : {
        mint: {
          appName: 'Mint',
          icon: AiFillPlusCircle,
          path: `${
            router.pathname === '/choose'
              ? '/choose'
              : isMobile
              ? '/choose'
              : '/mint-colors'
          }`,
        },
        trade: {
          appName: 'Trade',
          icon: RiExchangeBoxFill,
          path: '/gallery/color-nft',
        },
        earn: {
          appName: 'Earn',
          icon: MdAllInclusive,
          path: '/earn',
        },
        discord: {
          appName: 'Discord',
          icon: SiDiscord,
          external: true,
          path: 'https://discord.gg/colormuseum',
        },
        twitter: {
          appName: 'Twitter',
          icon: AiFillTwitterCircle,
          external: true,
          path: 'https://twitter.com/colordotmuseum',
        },
      };

  const [scroll, setScroll] = useState(false);
  const [homePagescroll, setHomePageScroll] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY);
    });
  }, [scroll]);

  const { toggle } = useSelector((state) => state.toggle);
  const dispatch = useDispatch();
  const mouseX = useMotionValue(null);
  const dockItemsKeys = Object.keys(dockItems);
  const wrapperRef = useRef(null);
  if (isMobile) {
    useOutsideAlerter(wrapperRef);
  }
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          dispatch(Toggle());
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const [connectWallet, setConnectWallet] = useState(false);
  const { deactivate } = useWeb3React();
  const { connectedAddress } = useSelector((state) => state.minting);
  const [userData, setUserData] = useState({});
  const [type, setType] = useState({});

  // localstorage
  useEffect(() => {
    // userDate
    let userData = localStorage.getItem('userData');
    if (userData == undefined || userData == '' || userData == {}) {
      localStorage.removeItem('userData');
    }
    userData = localStorage.getItem('userData');
    if (userData) {
      userData = JSON.parse(userData);
      setUserData(userData);
    }

    // type
    let color_museum_wallet_type = localStorage.getItem(
      'color_museum_wallet_type'
    );
    if (
      color_museum_wallet_type == undefined ||
      color_museum_wallet_type == '' ||
      color_museum_wallet_type == {}
    ) {
      localStorage.removeItem('color_museum_wallet_type');
    }
    color_museum_wallet_type = localStorage.getItem('color_museum_wallet_type');
    if (color_museum_wallet_type) {
      color_museum_wallet_type = JSON.parse(color_museum_wallet_type);
      setType(color_museum_wallet_type);
    }
  }, []);

  const handleDisconnect = () => {
    localStorage.clear('connectedAddress');
    localStorage.clear('color_museum_wallet_type');
    localStorage.clear('color_museum_wallet_expiry');
    deactivate();
    dispatch(LocalStorage());
    dispatch(ConnectAddress(''));
    toast(
      <div className={'toastComman'}>
        Wallet Disconnected
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
    if (window.dataLayer && userData) {
      window.dataLayer.push({
        event: 'wallet-disconnected',
        page_location: router.asPath, // existing page url should pass here.
        wallet_selected:
          type === 1 ? 'Metamask' : type === 2 ? 'Coinbase' : 'WalletConnect', //Metamask, Coinbase Wallet, WalletConnect dynamic wallet name should pass here.
        user_id: userData.id, //userbase, user ID should dynamically pass here.
      });
    }
  };

  return (
    <>
      <Slide
        direction={isMobile ? 'right' : 'bottom'}
        in={toggle}
        unmountOnExit
        style={{
          zIndex: isMobile ? 99999 : 111,
          width: isMobile ? '110px' : '900px',
          margin: '0 auto',
        }}
        className={`${isMobile ? styles.mobile : styles.bottom}`}
        ref={wrapperRef}
      >
        <section className={styles.dockWrapper}>
          <article className={styles.dockContainer}>
            <div
              className={styles.dockElement}
              onMouseMove={(event) => mouseX.set(event.nativeEvent.x)}
              onMouseLeave={() => mouseX.set(null)}
            >
              {dockItemsKeys.map((dockTitle, index) => {
                return [
                  <DockItem
                    key={dockTitle}
                    mouseX={mouseX}
                    {...dockItems[dockTitle]}
                  />,
                ];
              })}
            </div>
            {!isMobile && (
              <div className={styles.dockElement}>
                <div className={styles.right_btn_list}>
                  {connectedAddress !== '' ? (
                    <button
                      className={styles.light_btn}
                      onClick={() => handleDisconnect()}
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      className={styles.light_btn}
                      onClick={() => setConnectWallet(true)}
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            )}
          </article>
        </section>
      </Slide>
      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
    </>
  );
};
