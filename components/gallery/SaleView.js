import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from '../../styles/modules/gallery/sale.module.css';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { WSS_PROVIDER } from '../../utils/constants';
import webSocket from 'websocket';

var W3CWebSocket = webSocket.w3cwebsocket;

var client = new W3CWebSocket(WSS_PROVIDER, 'echo-protocol');
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
const SaleView = () => {
  const { allReceivedData } = useSelector((state) => state.data);

  const [displayCard, setDisplayCard] = useState(false);
  const [cardId, setCardId] = useState();
  const [saleList, setSaleList] = useState([]);

  client.onmessage = function (e) {
    if (typeof e.data === 'string') {
      var saleL = [];
      var sellList = JSON.parse(e.data);
      for (var i = 0; i < sellList.length; ++i) {
        for (var j = 0; j < allReceivedData.length; ++j) {
          var item = allReceivedData[j];
          if (item.uint256 == sellList[i]) saleL.push(item);
        }
      }
      setSaleList(saleL);
    }
  };

  client.onopen = function () {
    if (client.readyState === client.OPEN) {
      var number = Math.round(Math.random() * 0xffffff);
      client.send(number.toString());
    }
  };

  return (
    <article className={styles.container}>
      <div className={styles.saleCardFilterContainer}></div>
      <div className={styles.saleCardContainer}>
        <h3 className={styles.forSale}>for sale</h3>
        <div className={styles.flexContainer}>
          <h1>23 Colors</h1>
          <h2>4.35%</h2>
          <h3>of suply listed</h3>
        </div>
        <div className={styles.colorBoxView}>
          {allReceivedData &&
            allReceivedData.slice(0, 4).map((item, index) => {
              return (
                <>
                  <div className={styles.mainBox} key={index}>
                    <div className={styles.colorBox}>
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                      />
                    </div>
                  </div>
                </>
              );
            })}
        </div>
        <div className={styles.colorBoxViewSmall}>
          {allReceivedData &&
            allReceivedData.slice(0, 5).map((item, index) => {
              return (
                <>
                  <div className={styles.mainBox} key={index}>
                    <div className={styles.colorBox}>
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                      />
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </article>
  );
};

export default SaleView;

const NFTCardContainerOnHover = ({ id, name, color, number }) => {
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
        setFontSizeAmount(`${width < 350 ? '16' : '12'}`);
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
  return (
    <div
      className={`${styles.recentlyBoxContainer} recentlyContainer`}
      style={{
        borderColor: `${whiteBorders.includes(color) ? '#1c1c1c' : color}`,
        textDecoration: 'none',
        background: '#000',
      }}
    >
      <div className={styles.containerContent}>
        <div
          className='recentlyHeader'
          style={{
            borderBottom: `${
              whiteBorders.includes(color) ? '3px solid #1c1c1e' : 'none'
            }`,
          }}
        >
          <div className='flex_cardContainer'>
            <div className={styles.logo_cardImage}>
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
          <a className={styles.gridItem}>
            <>
              <div
                className={`${styles.backgroundBoxContainer} backgroundContainer`}
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
        <div className={styles.bottomPart}>
          <div className={styles.colorBoxTime}>
            <div className={styles.colorBoxProcessBar}>
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
          <div className={styles.colorDetails}>
            <div className={styles.flexContainerBottom}>
              <div className={styles.ethSection}>
                <h1>0.50 ETH</h1>
                <button className={styles.buyButton}>BUY</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
