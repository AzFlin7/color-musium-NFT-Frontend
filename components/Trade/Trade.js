import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/modules/trade/trade.module.css';
import { FiChevronRight } from 'react-icons/fi';
import { useRouter } from 'next/router';
import useIntersection from './useIntersection';

const Trade = () => {
  const [showOne, setShowOne] = useState('choose');
  const router = useRouter();

  const section1 = useRef();
  const section2 = useRef();
  const section3 = useRef();
  const section4 = useRef();
  const section5 = useRef();

  const section1Port = useIntersection(section1, '0px');
  const section2Port = useIntersection(section2, '-200px');
  const section3Port = useIntersection(section3, '-250px');
  const section4Port = useIntersection(section4, '-300px');
  const section5Port = useIntersection(section5, '-350px');

  const handleShowOne = () => {
    if (
      section1Port &&
      !section2Port &&
      !section3Port &&
      !section4Port &&
      !section5Port
    ) {
      setShowOne('section1');
    } else if (
      !section1Port &&
      section2Port &&
      !section3Port &&
      !section4Port &&
      !section5Port
    ) {
      setShowOne('section2');
    } else if (
      !section1Port &&
      !section2Port &&
      section3Port &&
      !section4Port &&
      !section5Port
    ) {
      setShowOne('section3');
    } else if (
      !section1Port &&
      !section2Port &&
      !section3Port &&
      section4Port &&
      !section5Port
    ) {
      setShowOne('section4');
    } else if (
      !section1Port &&
      !section2Port &&
      !section3Port &&
      !section4Port &&
      section5Port
    ) {
      setShowOne('section5');
    }
  };
  useEffect(() => {
    handleShowOne();
  }, [section1Port, section2Port, section3Port, section4Port, section5Port]);

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.breadcrumbPath}>
          <Link href='/' passHref>
            <a>Home</a>
          </Link>
          <FiChevronRight />
          Trade Ethereum NFTs
        </div>
        <article className={styles.bannerFirst}>
          {/* <img
                        src="/images/logo.png"
                        className={styles.centerLogo}
                    /> */}
          <div className={styles.bgvideo}></div>
          <div>
            <h1 className={styles.bannerTitle}>EXCHANGE. SECURELY.</h1>
          </div>
          <div className={styles.bannerBtnList}></div>
        </article>
        <div className={styles.scrollToShowDiv}>
          <article
            className={styles.containerSteps}
            ref={section1}
            onMouseEnter={() => setShowOne('section1')}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === 'section1' ? '1' : '0.3' }}
              >
                <h1
                  style={{ margin: showOne === 'section1' ? '0 0 16px' : '0' }}
                >
                  Live on Ethereum, built on 0x.
                </h1>
                <h2
                  style={{ display: showOne === 'section1' ? 'flex' : 'none' }}
                >
                  The most gas efficient NFT swaps via the new V4 of the 0x
                  Protocol. Up to 40% gas savings versus transacting on OpenSea.
                  Third party audited and verified on Etherscan.
                </h2>
                <p
                  style={{ display: showOne === 'section1' ? 'flex' : 'none' }}
                >
                  Trade NFTs for ETH, WETH, USDC, DAI, and USDT.
                </p>
                <div
                  style={{ display: showOne === 'section1' ? 'flex' : 'none' }}
                ></div>
              </div>
              <div
                className={styles.rightVideo}
                style={{ display: showOne === 'section1' ? 'flex' : 'none' }}
              ></div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section2}
            onMouseEnter={() => setShowOne('section2')}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === 'section2' ? '1' : '0.3' }}
              >
                <h1
                  style={{ margin: showOne === 'section2' ? '0 0 16px' : '0' }}
                >
                  Onchain orders.
                </h1>
                <h2
                  style={{ display: showOne === 'section2' ? 'flex' : 'none' }}
                >
                  Unlike OpenSea and LooksRare, we offer Ethereum mainet onchain
                  buying and selling of NFTs. This order type is resistant to
                  the recent vulnerabilities affecting OpenSea and causing loss
                  of user assets.
                </h2>
                <p
                  style={{ display: showOne === 'section2' ? 'flex' : 'none' }}
                ></p>
                <div
                  style={{ display: showOne === 'section2' ? 'flex' : 'none' }}
                ></div>
              </div>
              <div
                className={styles.rightVideo}
                style={{ display: showOne === 'section2' ? 'flex' : 'none' }}
              ></div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section3}
            onMouseEnter={() => setShowOne('section3')}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === 'section3' ? '1' : '0.3' }}
              >
                <h1
                  style={{ margin: showOne === 'section3' ? '0 0 16px' : '0' }}
                >
                  Now trading Color NFTs.
                </h1>
                <p
                  style={{ display: showOne === 'section3' ? 'flex' : 'none' }}
                >
                  The first market to launch is the Color NFT Collection. 10,000
                  immutable colors defined by the minter, eligible for color
                  royalties.
                </p>
                <div
                  style={{ display: showOne === 'section3' ? 'flex' : 'none' }}
                ></div>
              </div>
              <div
                className={styles.rightVideo}
                style={{ display: showOne === 'section3' ? 'flex' : 'none' }}
              ></div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section4}
            onMouseEnter={() => setShowOne('section4')}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === 'section4' ? '1' : '0.3' }}
              >
                <h1
                  style={{ margin: showOne === 'section4' ? '0 0 16px' : '0' }}
                >
                  Fees distributed as Color Yield.
                </h1>
                <h2
                  style={{ display: showOne === 'section4' ? 'flex' : 'none' }}
                >
                  We charge 2.5% transaction fee (on parity with OpenSea and
                  beating Foundation’s 15%), split between the buyer and the
                  seller.
                </h2>
                <p
                  style={{ display: showOne === 'section4' ? 'flex' : 'none' }}
                >
                  These transaction fees are collected by the Color Pool smart
                  contract and paid out to Color NFT holders as Color Yield.
                </p>
                <div
                  style={{ display: showOne === 'section4' ? 'flex' : 'none' }}
                ></div>
              </div>
              <div
                className={styles.rightVideo}
                style={{ display: showOne === 'section4' ? 'flex' : 'none' }}
              ></div>
            </div>
          </article>
          <article
            className={styles.containerSteps}
            ref={section5}
            onMouseEnter={() => setShowOne('section5')}
            onMouseLeave={() => handleShowOne()}
          >
            <div className={styles.wrapperSteps}>
              <div
                className={styles.containerStepLeft}
                style={{ opacity: showOne === 'section5' ? '1' : '0.3' }}
              >
                <h1
                  style={{ margin: showOne === 'section5' ? '0 0 16px' : '0' }}
                >
                  Aggregated Liquidity.
                </h1>
                <h2
                  style={{ display: showOne === 'section5' ? 'flex' : 'none' }}
                >
                  We will support the NFT trading on multiple marketplaces
                  through one interface. It will even work when the OpenSea
                  website goes down.
                </h2>
                <p
                  style={{ display: showOne === 'section5' ? 'flex' : 'none' }}
                ></p>
                <div
                  style={{ display: showOne === 'section5' ? 'flex' : 'none' }}
                ></div>
              </div>
              <div
                className={styles.rightVideo}
                style={{ display: showOne === 'section5' ? 'flex' : 'none' }}
              ></div>
            </div>
          </article>
          <article className={styles.containerLearnMore}>
            <div className={styles.learnMoreCard}>
              <div>
                <h1>Mint Colors</h1>
                <h3>
                  This refers to minting (paying for) a Color NFT starting at
                  https://color.museum/choose
                </h3>
              </div>
              <button onClick={() => router.push('/choose')}>Start mint</button>
            </div>
            <div className={styles.learnMoreCard}>
              <div>
                <h1>Earn Yield</h1>
                <h3>
                  This refers to minting (paying for) a Color NFT starting at
                  https://color.museum/choose
                </h3>
              </div>
              <button onClick={() => router.push('/earn')}>Learn More</button>
            </div>
          </article>
        </div>
      </section>
    </>
  );
};

export default Trade;
