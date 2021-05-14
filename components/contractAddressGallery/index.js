import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/modules/profile/profile.module.css';
import stylesSort from '../../styles/modules/gallery/sort.module.css';
import 'react-tabs/style/react-tabs.css';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useENSName } from 'use-ens-name';
import stylesSale from '../../styles/modules/gallery/sale.module.css';
import { Switch, SwitchThumb } from '../gallery/StyledSwitch';
import { FiMinus } from 'react-icons/fi';
import { BsPlusLg, BsSearch } from 'react-icons/bs';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'react-tippy/dist/tippy.css';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import stylesFilter from '../../styles/modules/newTokenID/createAndLoginAccount.module.css';
import { IoCloseSharp } from 'react-icons/io5';
import stylesSecond from '../../styles/modules/gallery/view.module.css';
import { isMobile } from 'react-device-detect';
import stylesGallery from '../../styles/modules/gallery/sort.module.css';
import Web3 from 'web3';
import Image from 'next/image';
import { useRouter } from 'next/router';

const index = ({ data, dataAll }) => {
  const router = useRouter();
  const contract = router.query.contractAddress;
  const [baseCollections, setBaseCollections] = useState();
  const [filteredData, setFilteredData] = useState();
  useEffect(() => {
    const allData = [];
    const filteredData =
      data &&
      data.filter((item) => {
        return item.previews.image_medium_url;
      });

    setFilteredData(filteredData);
    if (filteredData) {
      filteredData.map((item) => {
        allData.push(item.collection.name);
      });
    }
    const uniq = [...new Set(allData)];
    setBaseCollections(uniq[0]);
  }, [data]);

  const [nftImageProfile, setNftImageProfile] = useState();
  useEffect(() => {
    if (filteredData && !nftImageProfile) {
      const randomNft =
        filteredData[Math.floor(Math.random() * filteredData.length)]?.previews
          .image_medium_url;
      setNftImageProfile(randomNft);
    }
  }, [filteredData]);

  const [checked, setChecked] = useState(true);
  const [openedFilter, setOpenedFilter] = useState({
    view: true,
    collection: false,
    price: false,
  });
  const [view, setView] = useState('card');
  const [smallCard, setSmallCard] = useState(true);
  const [search, setSearch] = useState('');
  const { footerOnView } = useSelector((state) => state.toggle);
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  const containerWidthRef = useRef();
  const dividedBy = isMobile ? 35 : 50;
  const handleSide = () => {
    return (
      (containerWidthRef.current?.clientWidth -
        (containerWidthRef.current?.clientWidth % dividedBy)) /
      dividedBy /
      2
    );
  };

  const handleSideReturn = (number) => {
    const amount = Math.ceil(data.length / (handleSide() * 2));
    for (let i = 0; i < amount * 2; i += 2) {
      if (
        number >= Math.ceil(handleSide() * i + 1) &&
        number <= Math.ceil(handleSide() * (i + 1))
      ) {
        return true;
      }
    }
  };

  const [displayCard, setDisplayCard] = useState(false);
  const [cardId, setCardId] = useState(false);

  const [amountOfResults, setAmountOfResults] = useState([]);

  useEffect(() => {
    if (search !== '') {
      let dataF = filteredData.filter((item) => {
        return (
          item.collection.name.toLowerCase().includes(search.toLowerCase()) ||
          item.token_id.toString().startsWith(search.toLowerCase())
        );
      });
      setAmountOfResults(dataF);
    } else {
      setAmountOfResults(filteredData);
    }
  }, [search, filteredData]);
  const [autoLoadCard, setAutoLoadCard] = useState(Array.from({ length: 20 }));
  const [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    if (autoLoadCard.length >= amountOfResults.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setAutoLoadCard(autoLoadCard.concat(Array.from({ length: 20 })));
    }, 500);
  };
  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.profileTop}>
          <div className={styles.profileTopColor}></div>
          <div className={styles.profileDetails}>
            {nftImageProfile ? (
              <img
                src={nftImageProfile}
                alt=''
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImage}>0x</div>
            )}
            <div className={styles.title}>
              <h1 className={stylesGallery.header} style={{ marginLeft: '0' }}>
                {baseCollections && baseCollections}
              </h1>
            </div>
          </div>
        </div>
        <div className={stylesSort.sort_container}>
          <div className={stylesSort.filterHeaderText}>
            <div className={stylesSort.containerToggleActivity}></div>
            <div className={stylesSort.contentMarketInfo}>
              <h2 className={stylesSort.contentFormSide}>
                <span style={{ fontFamily: 'Plaid' }}>
                  {amountOfResults && amountOfResults.length}&nbsp;
                </span>
                Nfts
              </h2>
            </div>
          </div>
        </div>
        <div
          className={styles.colorBoxWrapper}
          style={{ borderTop: '0', marginTop: '10px', paddingTop: '0' }}
        >
          <div className={stylesSort.wrapperContainer} style={{ padding: '0' }}>
            <div className={stylesSort.stickyFilter}>
              <div className={stylesSort.stickyFilterContainer}>
                <div className={stylesSort.containerContent}>
                  <div className={stylesSort.flexContent}>
                    <h3>For Sale</h3>
                    <Switch
                      defaultChecked
                      checked={checked}
                      onCheckedChange={() => {
                        setChecked(!checked);
                      }}
                      id='s2'
                    >
                      <SwitchThumb />
                    </Switch>
                  </div>
                </div>
                <div className={stylesSort.containerContent}>
                  <div className={stylesSort.flexContent}>
                    <h3>View</h3>
                    {openedFilter.view ? (
                      <FiMinus
                        onClick={() =>
                          setOpenedFilter({
                            view: false,
                            group: openedFilter.group,
                            price: openedFilter.price,
                          })
                        }
                      />
                    ) : (
                      <BsPlusLg
                        onClick={() =>
                          setOpenedFilter({
                            view: true,
                            group: openedFilter.group,
                            price: openedFilter.price,
                          })
                        }
                      />
                    )}
                  </div>
                  <div
                    className={stylesSort.gridContent}
                    style={{ display: openedFilter.view ? 'block' : 'none' }}
                  >
                    <h4
                      onClick={() => setView('grid')}
                      style={{
                        fontWeight: view === 'grid' ? 'bold' : '400',
                        background: view === 'grid' ? '#e7e7e7' : '#fff',
                        color: '#000',
                        boxShadow: view === 'grid' ? '0px 0px 4px #000' : null,
                        margin: view === 'grid' ? '3px 0' : null,
                      }}
                    >
                      Grid
                    </h4>
                 
                    <h4
                      onClick={() => {
                        setView('card');
                        setSmallCard(false);
                      }}
                      style={{
                        fontWeight:
                          view === 'card' && !smallCard ? 'bold' : '400',
                        background:
                          view === 'card' && !smallCard ? '#e7e7e7' : '#fff',
                        color: '#000',
                        boxShadow:
                          view === 'card' && !smallCard
                            ? '0px -1px 2px #000'
                            : null,
                        margin:
                          view === 'card' && !smallCard ? '3px 0 0' : null,
                      }}
                    >
                      Card Large
                    </h4>
                    <h4
                      onClick={() => {
                        setView('card');
                        setSmallCard(true);
                      }}
                      style={{
                        fontWeight:
                          view === 'card' && smallCard ? 'bold' : '400',
                        background:
                          view === 'card' && smallCard ? '#e7e7e7' : '#fff',
                        color: '#000',
                        boxShadow:
                          view === 'card' && smallCard
                            ? '0px -1px 2px #000'
                            : null,
                        margin: view === 'card' && smallCard ? '3px 0 0' : null,
                      }}
                    >
                      Card Small
                    </h4>
                  </div>
                </div>
              </div>
              <div
                className={`${stylesSort.filterForm}`}
                style={{ background: search === '' && '#f4f4f4' }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveToDB();
                  }}
                >
                  <BsSearch />
                  <input
                    placeholder='Collection Name, TokenID'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </form>
              </div>
            </div>
            <div style={{ width: '100%' }}>
              <div>
                {amountOfResults &&
                  amountOfResults.length === 0 &&
                  search !== '' && (
                    <h1 className={styles.dontOwnColors}>No Result Found! </h1>
                  )}
                {filteredData && filteredData.length === 0 ? (
                  <h1 className={styles.dontOwnColors}>
                    You don't own any color.
                  </h1>
                ) : view === 'grid' ? (
                  <div
                    className={stylesSecond.dataTableContainer}
                    style={{ width: '100%' }}
                  >
                    <div
                      className={stylesSecond.mainGrid}
                      style={{ minHeight: '5vh' }}
                      ref={containerWidthRef}
                    >
                      {amountOfResults &&
                        amountOfResults.map((item, index) => {
                          if (
                            item.contract_address.toLowerCase() ===
                            '0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf'
                          ) {
                            return (
                              <Link
                                href={`/gallery/color-nft/${item.token_id}`}
                              >
                                <div
                                  className={stylesSecond.gridItem}
                                  style={{
                                    background: '#fff',
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${item.previews.image_medium_url})`,
                                  }}
                                  key={index}
                                  onMouseEnter={() => {
                                    setDisplayCard(true);
                                    setCardId(item.name + item.token_id);
                                  }}
                                  onMouseLeave={() => {
                                    setDisplayCard(false);
                                    setCardId('');
                                  }}
                                >
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        name={item.name}
                                        token={item.token_id}
                                        price={
                                          item.price_in_eth &&
                                          item.price_in_eth.toFixed(2)
                                        }
                                        data={dataAll}
                                        grid={true}
                                        showOnLeft={handleSideReturn(index + 1)}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          } else {
                            return (
                              <Link
                                href={`/gallery/${contract}/${item.token_id}`}
                              >
                                <div
                                  className={stylesSecond.gridItem}
                                  style={{
                                    background: '#fff',
                                    backgroundSize: 'cover',
                                    backgroundImage: `url(${item.previews.image_medium_url})`,
                                    cursor: 'pointer',
                                  }}
                                  key={index}
                                  onMouseEnter={() => {
                                    setDisplayCard(true);
                                    setCardId(
                                      item.collection.name + item.token_id
                                    );
                                  }}
                                  onMouseLeave={() => {
                                    setDisplayCard(false);
                                    setCardId('');
                                  }}
                                >
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainerImage
                                        image={item.previews.image_medium_url}
                                        name={item.collection.name}
                                        token={item.token_id}
                                        price={
                                          item.price_in_eth &&
                                          item.price_in_eth.toFixed(2)
                                        }
                                        grid={true}
                                        showOnLeft={handleSideReturn(index + 1)}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            );
                          }
                        })}
                    </div>
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={autoLoadCard.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    height={950}
                    endMessage={
                      <h3 style={{ textAlign: 'center', color: '#fff' }}>
                        Yay! You have seen it all
                      </h3>
                    }
                  >
                    <div
                      className={
                        !smallCard
                          ? styles.colorBoxView
                          : styles.colorBoxViewSmall
                      }
                    >
                      {search !== ''
                        ? amountOfResults.map((item, index) => {
                            if (
                              (search !== '' &&
                                item.collection.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())) ||
                              item.token_id.toString().startsWith(search)
                            ) {
                              if (
                                item.contract_address.toLowerCase() ===
                                '0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf'
                              ) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.token_id}`}
                                  >
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          name={item.name}
                                          token={item.token_id}
                                          price={
                                            item.price_in_eth &&
                                            item.price_in_eth.toFixed(2)
                                          }
                                          data={dataAll}
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                );
                              } else {
                                return (
                                  <Link
                                    href={`/gallery/${contract}/${item.token_id}`}
                                  >
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainerImage
                                          image={item.previews.image_medium_url}
                                          name={item.collection.name}
                                          token={item.token_id}
                                          price={
                                            item.price_in_eth &&
                                            item.price_in_eth.toFixed(2)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </Link>
                                );
                              }
                            }
                          })
                        : amountOfResults &&
                          amountOfResults
                            .slice(0, autoLoadCard.length)
                            .map((item, index) => {
                              if (
                                (search !== '' &&
                                  item.collection.name
                                    .toLowerCase()
                                    .includes(search.toLowerCase())) ||
                                item.token_id.toString().startsWith(search)
                              ) {
                                if (
                                  item.contract_address.toLowerCase() ===
                                  '0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf'
                                ) {
                                  return (
                                    <Link
                                      href={`/gallery/color-nft/${item.token_id}`}
                                    >
                                      {' '}
                                      <div
                                        className={stylesSale.mainBox}
                                        key={index}
                                      >
                                        <div className={stylesSale.colorBox}>
                                          <NFTCardContainer
                                            name={item.name}
                                            token={item.token_id}
                                            price={
                                              item.price_in_eth &&
                                              item.price_in_eth.toFixed(2)
                                            }
                                            data={dataAll}
                                          />
                                        </div>
                                      </div>
                                    </Link>
                                  );
                                } else {
                                  return (
                                    <Link
                                      href={`/gallery/${contract}/${item.token_id}`}
                                    >
                                      <div
                                        className={stylesSale.mainBox}
                                        key={index}
                                      >
                                        <div className={stylesSale.colorBox}>
                                          <NFTCardContainerImage
                                            image={
                                              item.previews.image_medium_url
                                            }
                                            name={item.collection.name}
                                            token={item.token_id}
                                            price={
                                              item.price_in_eth &&
                                              item.price_in_eth.toFixed(2)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </Link>
                                  );
                                }
                              }
                            })}
                    </div>
                  </InfiniteScroll>
                )}
                {data &&
                  filteredData &&
                  !search &&
                  data.length - filteredData.length > 0 && (
                    <div className={styles.missingMetadata}>
                      {data.length - filteredData.length} NFTs were not shown
                      due to missing metadata.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {!footerOnView && (
        <article
          className={stylesSort.mobileFilter}
          onClick={() => setOpenMobileFilter(true)}
        >
          Filter
        </article>
      )}
      <SlidingPane
        className={'newSlideContainer'}
        overlayClassName={stylesSort.slideMobileOverlay}
        isOpen={openMobileFilter}
        title={
          <div className={stylesFilter.newPurchaseTitle}>
            Filter
            <IoCloseSharp onClick={() => setOpenMobileFilter(false)} />
          </div>
        }
        width='100%'
        closeIcon=''
        from='bottom'
        onRequestClose={() => {
          setOpenMobileFilter(false);
        }}
      >
        <div className={stylesSort.stickyFilterContainer}>
          <div className={stylesSort.stickyFilterContainer}>
            <div className={stylesSort.containerContent}>
              <div className={stylesSort.flexContent}>
                <h3>For Sale</h3>
                <Switch
                  defaultChecked
                  checked={checked}
                  onCheckedChange={() => {
                    setChecked(!checked);
                  }}
                  id='s2'
                >
                  <SwitchThumb />
                </Switch>
              </div>
            </div>
            <div className={stylesSort.containerContent}>
              <div className={stylesSort.flexContent}>
                <h3>View</h3>
                {openedFilter.view ? (
                  <FiMinus
                    onClick={() =>
                      setOpenedFilter({
                        view: false,
                        group: openedFilter.group,
                        price: openedFilter.price,
                      })
                    }
                  />
                ) : (
                  <BsPlusLg
                    onClick={() =>
                      setOpenedFilter({
                        view: true,
                        group: openedFilter.group,
                        price: openedFilter.price,
                      })
                    }
                  />
                )}
              </div>
              <div
                className={stylesSort.gridContent}
                style={{ display: openedFilter.view ? 'block' : 'none' }}
              >
                <h4
                  onClick={() => setView('grid')}
                  style={{
                    fontWeight: view === 'grid' ? 'bold' : '400',
                    background: view === 'grid' ? '#e7e7e7' : '#fff',
                    color: '#000',
                    boxShadow: view === 'grid' ? '0px 0px 4px #000' : null,
                    margin: view === 'grid' ? '3px 0' : null,
                  }}
                >
                  Grid
                </h4>
           
                <h4
                  onClick={() => {
                    setView('card');
                    setSmallCard(false);
                  }}
                  style={{
                    fontWeight: view === 'card' && !smallCard ? 'bold' : '400',
                    background:
                      view === 'card' && !smallCard ? '#e7e7e7' : '#fff',
                    color: '#000',
                    boxShadow:
                      view === 'card' && !smallCard
                        ? '0px -1px 2px #000'
                        : null,
                    margin: view === 'card' && !smallCard ? '3px 0 0' : null,
                  }}
                >
                  Card Large
                </h4>
                <h4
                  onClick={() => {
                    setView('card');
                    setSmallCard(true);
                  }}
                  style={{
                    fontWeight: view === 'card' && smallCard ? 'bold' : '400',
                    background:
                      view === 'card' && smallCard ? '#e7e7e7' : '#fff',
                    color: '#000',
                    boxShadow:
                      view === 'card' && smallCard ? '0px -1px 2px #000' : null,
                    margin: view === 'card' && smallCard ? '3px 0 0' : null,
                  }}
                >
                  Card Small
                </h4>
              </div>
            </div>
            <div className={stylesSort.containerContent}>
              <div className={stylesSort.flexContent}>
                <h3>Collection</h3>
                {openedFilter.collection ? (
                  <FiMinus
                    onClick={() =>
                      setOpenedFilter({
                        view: openedFilter.view,
                        collection: false,
                        price: openedFilter.price,
                      })
                    }
                  />
                ) : (
                  <BsPlusLg
                    onClick={() =>
                      setOpenedFilter({
                        view: openedFilter.view,
                        collection: true,
                        price: openedFilter.price,
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SlidingPane>
    </>
  );
};

export default index;

const NFTCardContainer = ({
  name,
  token,
  data,
  showOnLeft,
  grid,
  displayCard,
  cardId,
}) => {
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
  const [nftNo, setNftNo] = useState();
  useEffect(() => {
    data.map((item) => {
      if (item.uint256.toString() === token) {
        setNftNo(item.nftNo);
      }
    });
  }, []);
  let color = Web3.utils.numberToHex(token);
  color = color.slice(2);
  color = '#' + color;
  color =
    color.length === 3
      ? color + color.slice(1, 3)
      : color.length > 7
      ? color.slice(0, 7)
      : color;
  const price = '0.00';
  return (
    <div
      className={`${
        grid ? (!showOnLeft ? 'left_position' : 'right_position') : null
      }`}
    >
      <div
        className={`${stylesSale.recentlyBoxContainer} recentlyContainer`}
        style={{
          borderColor: `${whiteBorders.includes(color) ? '#1c1c1c' : color}`,
          textDecoration: 'none',
          background: '#000',
          display:
            (displayCard && cardId === name + token) || !grid
              ? 'block'
              : 'none',
        }}
      >
        <div
          className={`${
            grid
              ? stylesSale.containerContentWidth
              : stylesSale.containerContent
          } ${styles.containerContentSmall}`}
        >
          <div
            className={`recentlyHeader ${styles.recentlyHeaderR}`}
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
              {nftNo}
            </div>
          </div>
          <Link href={`/gallery/color-nft/${token}`} passHref>
            <a className={stylesSale.gridItem}>
              <>
                <div
                  className={`${stylesSale.backgroundBoxContainer} backgroundContainer`}
                  style={{ background: `${color}` }}
                ></div>

                <div
                  className='recentlyHeader'
                  style={{
                    // borderTop: `${whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                    //   }`,
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
          {
            // buyItNow ? (
            isOnSale ? (
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
                    <h4
                      style={{
                        color: '#FFF',
                        margin: '0 0 5px 0',
                        fontWeight: '300',
                      }}
                    >
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
            )
            // ) : null
          }
        </div>
      </div>
    </div>
  );
};
const NFTCardContainerImage = ({
  name,
  image,
  token,
  showOnLeft,
  grid,
  cardId,
  displayCard,
}) => {
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
  const [isOnSale, setIsOnSale] = useState(false);
  const price = '0.00';
  return (
    <div
      className={`${
        grid ? (!showOnLeft ? 'left_position' : 'right_position') : null
      }`}
    >
      <div
        className={`${stylesSale.recentlyBoxContainer} recentlyContainer  ${styles.recentlyContentSmall}`}
        style={{
          borderColor: '#292929',
          textDecoration: 'none',
          background: '#000',
          display:
            (displayCard && cardId === name + token) || !grid
              ? 'block'
              : 'none',
        }}
      >
        <div
          className={`${
            grid
              ? stylesSale.containerContentWidth
              : stylesSale.containerContent
          } ${styles.containerContentSmall}`}
        >
          <img src={image} />
          <div
            className={`${styles.bottomContent} recentlyHeader`}
            style={{ borderBottom: '1px solid #292929' }}
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
              #{token.slice(0, 6)}
              {token.length > 6 && '...'}
            </div>
          </div>
          {
            isOnSale ? (
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
                    <h4
                      style={{
                        color: '#FFF',
                        margin: '0 0 5px 0',
                        fontWeight: '300',
                      }}
                    >
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
            )

            // ) : null
          }
        </div>
      </div>
    </div>
  );
};
