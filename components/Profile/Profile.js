import React, { useEffect, useState } from 'react';
import styles from '../../styles/modules/profile/profile.module.css';
import 'react-tabs/style/react-tabs.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Switch from 'react-switch';
import { useENSName } from 'use-ens-name';
import stylesSale from '../../styles/modules/gallery/sale.module.css';
import { useRouter } from 'next/router';

const Profile = () => {
  const [sale, setSale] = useState(false);
  const [largeView, setLargeView] = useState(true);
  const [receivedNfts, setReceivedNfts] = useState();
  const { connectedAddress } = useSelector((state) => state.minting);
  const router = useRouter();

  useEffect(() => {
    if (connectedAddress) {
      router.push(`/profile/${connectedAddress}`);
    }
  }, [connectedAddress]);
  // 0x7d3e3834ddf4a3852ef85db39ebaf50b415ad3ed;
  const ens = useENSName(connectedAddress);
  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.profileTop}>
          <div
            className={styles.profileTopColor}
            style={{
              backgroundColor:
                receivedNfts &&
                receivedNfts.length > 0 &&
                receivedNfts[0].extra_metadata.hex,
            }}
          ></div>
          <div className={styles.profileDetails}>
            <img
              src={'/images/boredApe.png'}
              alt=''
              className={styles.profileImage}
            />
            <div className={styles.title}>
              <h1>
                {ens
                  ? ens
                  : `${connectedAddress.substring(
                      0,
                      6
                    )}...${connectedAddress.substring(
                      connectedAddress.length - 6
                    )}`}
              </h1>
            </div>
            {connectedAddress && ens && (
              <div className={styles.connectToken}>
                {connectedAddress.substring(0, 6)}...
                {connectedAddress.substring(connectedAddress.length - 6)}
                <div className={styles.greenConnected} />
              </div>
            )}
            {receivedNfts && receivedNfts.length > 0 && (
              <div className={styles.userOwns}>
                <h3>Owns {receivedNfts.length} NFTs</h3>
              </div>
            )}
          </div>
        </div>
        <div className={styles.colorBoxWrapper}>
          <div className={styles.colorBoxControler}>
            <div className={styles.colorSelect}></div>
            <div className={styles.rightController}>
              <div className={styles.switchItem}>
                <label
                  className={styles.switchLabel}
                  htmlFor='small-radius-switch'
                >
                  <p>For Sale</p>
                  <Switch
                    checked={sale}
                    onChange={() => setSale(!sale)}
                    onColor='#00FF0A'
                    onHandleColor='#000'
                    offColor='#fff'
                    offHandleColor='#000'
                    handleDiameter={15}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
                    activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
                    height={20}
                    width={35}
                    className={styles.react_witch}
                  />
                </label>
              </div>
              <div className={styles.colorSmallGrid}>
                <img
                  src={'/images/icon/color-list2.svg'}
                  alt=''
                  className={styles.icon}
                  onClick={() => setLargeView(false)}
                />
              </div>
              <div className={styles.colorLargeGrid}>
                <img
                  src={'/images/icon/color-list1.svg'}
                  alt=''
                  className={styles.icon}
                  onClick={() => setLargeView(true)}
                />
              </div>
            </div>
          </div>
          {receivedNfts && receivedNfts.length === 0 ? (
            <h1 className={styles.dontOwnColors}>
              This address don't own any color.
            </h1>
          ) : (
            <div
              className={
                largeView ? styles.colorBoxView : styles.colorBoxViewSmall
              }
            >
              {receivedNfts &&
                receivedNfts.map((item, index) => {
                  if (item.collection.name === 'Color Museum') {
                    return (
                      <>
                        <div className={stylesSale.mainBox} key={index}>
                          <div className={stylesSale.colorBox}>
                            <NFTCardContainer
                              id={item.uint256}
                              color={item.hex}
                              name={item.name}
                              number={item.nftNo}
                              price={
                                item.price_in_eth &&
                                item.price_in_eth.toFixed(2)
                              }
                            />
                          </div>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div className={stylesSale.mainBox} key={index}>
                          <div className={stylesSale.colorBox}>
                            <NFTCardContainerImage
                              image={item.previews.image_medium_url}
                              name={item.name}
                              price={
                                item.price_in_eth &&
                                item.price_in_eth.toFixed(2)
                              }
                            />
                          </div>
                        </div>
                      </>
                    );
                  }
                })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Profile;

const NFTCardContainer = ({ id, name, color, number, price }) => {
  const [fontSizeAmount, setFontSizeAmount] = useState('25');
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    if (name) {
      if (name.length < 10) {
        setFontSizeAmount(`${width < 350 ? '17.6' : '20'}`);
      } else if (name.length > 9 && name.length < 15) {
        setFontSizeAmount(`${width < 350 ? '16' : '17'}`);
      } else {
        setFontSizeAmount(`${width < 350 ? '12.8' : '12'}`);
      }
    }
    // eslint-disable-next-line
  }, [name]);
  //
  //
  const percentage = 30;

  const { whiteBorders } = useSelector((state) => state.minting);

  const [isOnSale, setIsOnSale] = useState(false);
  return (
    <div
      className={`${stylesSale.recentlyBoxContainer} recentlyContainer`}
      style={{
        borderColor: `${whiteBorders.includes(color) ? '#1c1c1c' : color}`,
        textDecoration: 'none',
        background: '#000',
      }}
    >
      <div className={stylesSale.containerContent}>
        <div
          className='recentlyHeader'
          style={{
            borderBottom: `${
              whiteBorders.includes(color) ? '3px solid #1c1c1e' : 'none'
            }`,
          }}
        >
          <div className='flex_cardContainer'>
            <div className={stylesSale.logo_cardImage}>
              <Image
                src={'/images/logo.png'}
                alt='logo NFTs'
                data-atropos-offset='5'
                layout='fill'
                objectFit='contain'
              />
            </div>
          </div>
          <div className='address' data-atropos-offset='5'>
            {number}
          </div>
        </div>
        <Link href={`/gallery/color-nft/${id}`} passHref>
          <a className={stylesSale.gridItem}>
            <>
              <div
                className={`${stylesSale.backgroundBoxContainer} backgroundContainer`}
                style={{ background: `${color}` }}
              ></div>
              <div
                className='recentlyHeader'
                style={{
                  marginTop: '3px',
                  borderBottom: '1px solid #292929',
                }}
              >
                <div
                  className='recentlyP'
                  style={{
                    fontSize: `${fontSizeAmount}px`,
                  }}
                >
                  {name}
                </div>
                <div
                  className='recentlyP margin_right'
                  style={{
                    textTransform: 'uppercase',
                    fontSize: `${fontSizeAmount}px`,
                    color: '#fff',
                  }}
                >
                  {color}
                </div>
              </div>
            </>
          </a>
        </Link>
        {isOnSale ? (
          <div className={stylesSale.bottomPart}>
            <div className={stylesSale.colorBoxTime}>
              <div className={stylesSale.colorBoxProcessBar}>
                <CircularProgressbar
                  strokeWidth={20}
                  value={percentage}
                  styles={buildStyles({
                    trailColor: '#4A4A4A',
                    pathColor: '#fff',
                  })}
                />
              </div>
              <span>Expires in 32 minutes</span>
            </div>
            <div className={stylesSale.colorDetails}>
              <div className={stylesSale.flexContainerBottom}>
                <div className={stylesSale.ethSection}>
                  <h1>{price} ETH</h1>
                  <button className={stylesSale.buyButton}>BUY</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={stylesSale.bottomPart}>
            <div className={stylesSale.colorDetails}>
              <h4 style={{ color: '#FFF', margin: '0', fontWeight: '300' }}>
                Last Price
              </h4>
              <div className={stylesSale.flexContainerBottom}>
                <div className={stylesSale.ethSection}>
                  <h1>{price} ETH</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const NFTCardContainerImage = ({ name, price, image }) => {
  const [isOnSale, setIsOnSale] = useState(false);
  return (
    <div
      className={`${stylesSale.recentlyBoxContainer} recentlyContainer`}
      style={{
        borderColor: '#292929',
        textDecoration: 'none',
        background: '#000',
      }}
    >
      <div className={stylesSale.containerContent}>
        <img src={image} />
        {isOnSale ? (
          <div className={stylesSale.bottomPart}>
            <div className={stylesSale.colorBoxTime}>
              <div className={stylesSale.colorBoxProcessBar}>
                <CircularProgressbar
                  strokeWidth={20}
                  value={percentage}
                  styles={buildStyles({
                    trailColor: '#4A4A4A',
                    pathColor: '#fff',
                  })}
                />
              </div>
              <span>Expires in 32 minutes</span>
            </div>
            <div className={stylesSale.colorDetails}>
              <div className={stylesSale.flexContainerBottom}>
                <div className={stylesSale.ethSection}>
                  <h1>{price} ETH</h1>
                  <button className={stylesSale.buyButton}>BUY</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          price && (
            <div className={stylesSale.bottomPart}>
              <div className={stylesSale.colorDetails}>
                <h4 style={{ color: '#FFF', margin: '0', fontWeight: '300' }}>
                  Last Price
                </h4>
                <div className={stylesSale.flexContainerBottom}>
                  <div className={stylesSale.ethSection}>
                    <h1>{price} ETH</h1>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
