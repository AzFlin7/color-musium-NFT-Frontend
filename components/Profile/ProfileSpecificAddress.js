import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/profile/profile.module.css";
import stylesSort from "../../styles/modules/gallery/sort.module.css";
import "react-tabs/style/react-tabs.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import Link from "next/link";
import { useSelector } from "react-redux";
import Image from "next/image";
import axios from "axios";
import { useENSName } from "use-ens-name";
import stylesSale from "../../styles/modules/gallery/sale.module.css";
import { useRouter } from "next/router";
import { Switch, SwitchThumb } from "../gallery/StyledSwitch";
import { FiMinus } from "react-icons/fi";
import { BsPlusLg, BsSearch } from "react-icons/bs";
import Web3 from "web3";
import { ENSName } from "react-ens-name";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import ENS, { getEnsAddress } from "@ensdomains/ensjs";
import { PROVIDER, API_URL, TokenAddressList } from "../../utils/constants";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import stylesFilter from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoCloseSharp } from "react-icons/io5";
import stylesSecond from "../../styles/modules/gallery/view.module.css";
import { isMobile } from "react-device-detect";
import stylesSelected from "../../styles/modules/gallery/filter.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import { IoMdClose } from "react-icons/io";
import moment from "moment";
import { ethers } from "ethers";
import { AiFillClockCircle } from "react-icons/ai";
import { RiRadioButtonFill } from "react-icons/ri";
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { request, gql, GraphQLClient, useQuery } from "graphql-request";
import Head from "next/head";

const Profile = ({ data }) => {
  const [receivedNfts, setReceivedNfts] = useState();
  const router = useRouter();
  const [baseCollections, setBaseCollections] = useState();
  const [sellectedBaseCollections, setSellectedBaseCollections] = useState([]);
  const [addressQuery, setAddressQuery] = useState();

  useEffect(() => {
    router.query.address && router.push("/");
  }, [router]);

  useEffect(() => {
    if (
      router.query.address.slice(0, 2) !== "0x" &&
      router.query.address.slice(
        router.query.address.length - 4,
        router.query.address.length
      ) !== ".eth"
    ) {
      router.push("/404");
    } else if (
      router.query.address.slice(0, 1) !== "@" &&
      router.query.address.slice(
        router.query.address.length - 4,
        router.query.address.length
      ) === ".eth"
    ) {
      router.push(`/@${router.query.address}`);
    } else if (
      router.query.address &&
      router.query.address.slice(
        router.query.address.length - 4,
        router.query.address.length
      ) === ".eth"
    ) {
      const handleIt = async () => {
        const provider = new Web3(new Web3.providers.HttpProvider(PROVIDER))
          .currentProvider;
        const ens = new ENS({ provider, ensAddress: getEnsAddress("1") });
        const address = await ens
          .name(router.query.address.slice(1, router.query.address.length))
          .getAddress();
        setAddressQuery(address);
      };
      handleIt();
    } else {
      setAddressQuery(router.query.address);
    }
  }, [router.query.address]);

  const [loader, setLoader] = useState(false);
  const handleNextNft = async (nextData) => {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-api-key": "omarcolormuseu_sk_j2h68noef6sz4lum",
      },
    };
    await axios(nextData, options).then((res) => {
      setReceivedNfts((prevState) => [...prevState, ...res.data.nfts]);
      handleNext(res.data.next);
    });
  };

  const handleNext = (next) => {
    if (next) {
      handleNextNft(next);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (addressQuery) {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": "color_sk_knpt1iz27hto0d0a",
        },
      };
      const handleToken = async () => {
        await axios(
          `https://api.simplehash.com/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${addressQuery}`,
          options
        ).then((res) => {
          setLoader(true);
          setReceivedNfts(res.data.nfts);
          handleNext(res.data.next);
        });
      };
      handleToken();
    }
  }, [addressQuery]);

  const [filteredData, setFilteredData] = useState();
  useEffect(() => {
    const allData = [];
    const filteredData =
      receivedNfts &&
      receivedNfts.filter((item) => {
        return item.previews.image_medium_url;
      });
    setFilteredData(filteredData);
    if (filteredData) {
      filteredData.map((item) => {
        allData.push(item.collection.name);
      });
    }
    const uniq = [...new Set(allData)];
    setBaseCollections(uniq);
  }, [receivedNfts]);

  // 0x7d3e3834ddf4a3852ef85db39ebaf50b415ad3ed;
  const ens = useENSName(addressQuery && addressQuery);

  const [openedFilter, setOpenedFilter] = useState({
    view: true,
    collection: false,
    price: false,
  });
  const [view, setView] = useState("card");
  const [smallCard, setSmallCard] = useState(true);
  const [search, setSearch] = useState("");

  const randomFormat = (address) => {
    return (
      address.substring(0, 6) + "..." + address.substring(address.length - 6)
    );
  };
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
    const amount = Math.ceil(receivedNfts.length / (handleSide() * 2));
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
    if (sellectedBaseCollections.length > 0) {
      let data = filteredData.filter((item) => {
        return sellectedBaseCollections.includes(item.collection.name);
      });
      if (search !== "") {
        let dataF = data.filter((item) => {
          return (
            item.collection.name.toLowerCase().includes(search.toLowerCase()) ||
            item.token_id.toString().startsWith(search.toLowerCase())
          );
        });
        setAmountOfResults(dataF);
      } else setAmountOfResults(data);
    } else if (search !== "") {
      let dataF = filteredData.filter((item) => {
        return (
          item.collection.name.toLowerCase().includes(search.toLowerCase()) ||
          item.token_id.toString().startsWith(search.toLowerCase())
        );
      });
      setAmountOfResults(dataF);
    } else {
      console.log(`SetAmountOfResult`);
      setAmountOfResults(filteredData);
    }
  }, [search, sellectedBaseCollections, filteredData]);

  // For Sale Part
  const [nftImageProfile, setNftImageProfile] = useState();
  useEffect(() => {
    if (filteredData && !nftImageProfile) {
      const randomNft =
        filteredData[Math.floor(Math.random() * filteredData.length)]?.previews
          .image_medium_url;
      setNftImageProfile(randomNft);
    }
  }, [filteredData]);

  useEffect(() => {
    initialSalesData();
  }, []);

  const [saleNFTList, setSaleNFTList] = useState([]);
  const initialSalesData = async () => {
    var salesNFT = await axios({
      method: "GET",
      url: `${API_URL}/orders/asks`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const saleNFTList = await salesNFT.data;

    makeSalesDataFormat(saleNFTList);
  };

  const [salesExpiry, setSalesExpiry] = useState({});
  const [salesPrice, setSalesPrice] = useState({});
  const [salesData, setSalesData] = useState([]);

  const makeSalesDataFormat = (saleNFTList) => {
    const nftExpiry = {};
    const nftPrice = {};
    setSaleNFTList(saleNFTList);
    saleNFTList.forEach((item) => {
      nftExpiry[item.erc721TokenId] = moment(item.expiry * 1000).fromNow();
      nftPrice[item.erc721TokenId] = convertFloat(
        (
          getBigNumber(item.erc20TokenAmount).add(getBigNumber(item.fee)) /
          Math.pow(
            10,
            decimalForCurrency[TokenAddressList.indexOf(item.erc20Token)]
          )
        ).toFixed(10)
      );
    });
    setSalesPrice(nftPrice);
    setSalesExpiry(nftExpiry);
  };

  const [buyItNow, setBuyItNow] = useState(false);
  useEffect(() => {
    if (buyItNow) {
      if (saleNFTList && amountOfResults) {
        const salesData = [];
        for (var i = 0; i < saleNFTList.length; i++)
          for (var j = 0; j < amountOfResults.length; j++) {
            if (saleNFTList[i].erc721TokenId == amountOfResults[j].token_id)
              salesData.push(amountOfResults[j]);
          }
        setSalesData(salesData);
      }
    }
  }, [buyItNow, amountOfResults, saleNFTList]);

  // Calc price
  const decimalForCurrency = [18, 18, 6, 18, 6];

  const getBigNumber = (input) => {
    if (typeof input === "string") return ethers.utils.parseUnits(input, "wei");
    return ethers.utils.parseUnits(String(input), "wei");
  };

  const convertFloat = (value) => {
    var cvalue = value.toString();
    var pos = 0;
    for (var i = 0; i < cvalue.length; i++) {
      if (cvalue[i] == ".") {
        pos = 1;
        continue;
      }
      if (pos) {
        if (cvalue[i] != "0") break;
        pos++;
      }
    }

    return parseFloat(Number(value).toFixed(pos + 1));
  };

  return (
    <>
      <Head>
        <title>Profile | {router.query.address}</title>
      </Head>
      <section className={styles.wrapper}>
        <div className={styles.profileTop}>
          <div className={styles.profileTopColor}></div>
          <div className={styles.profileDetails}>
            {loader ? (
              <div
                className={styles.profileImage}
                style={{ background: "#000" }}
              >
                <PuffLoader color="#fff" size={50} />
              </div>
            ) : nftImageProfile ? (
              <img
                src={nftImageProfile}
                alt=""
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImage}>0x</div>
            )}
            <div className={styles.title}>
              <h1>
                {ens ? (
                  <Tooltip
                    title={addressQuery && ens && randomFormat(addressQuery)}
                    position="top"
                    trigger="mouseenter"
                    arrow
                    size={"big"}
                    interactive={true}
                  >
                    {ens}
                  </Tooltip>
                ) : (
                  addressQuery && (
                    <>
                      <Tooltip
                        title={`${addressQuery.substring(
                          0,
                          6
                        )}...${addressQuery.substring(
                          addressQuery.length - 6
                        )}`}
                        position="top"
                        trigger="mouseenter"
                        arrow
                        size={"big"}
                        interactive={true}
                      >
                        <ENSName
                          address={addressQuery}
                          customDisplay={randomFormat}
                        ></ENSName>
                      </Tooltip>
                    </>
                  )
                )}
                <div
                  className={styles.filterFormMobile}
                  style={{ background: search === "" && "#f4f4f4" }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveToDB();
                    }}
                  >
                    <BsSearch />
                    <input
                      placeholder="Collection Name, TokenID"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </form>
                </div>
              </h1>
              {/* {filteredData && filteredData.length > 0 && (
                <div className={styles.userOwns}>
                  {loader ? (
                    <div className={styles.smallLoader}>
                      <PuffLoader color='#fff' size={25} />
                    </div>
                  ) : (
                    <div className={styles.circleOwn}>
                      {filteredData.length}
                      <span>nfts</span>
                    </div>
                  )}
                </div>
              )} */}
            </div>
          </div>
        </div>
        <div className={styles.colorBoxWrapper}>
          <div className={stylesSort.wrapperContainer} style={{ padding: "0" }}>
            <div className={stylesSort.stickyFilter}>
              <div
                className={`${stylesSort.filterForm}`}
                // style={{ background: search === '' && '#f4f4f4' }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveToDB();
                  }}
                >
                  <>
                    <div className={stylesSort.bsContainer}>
                      <BsSearch className={stylesSort.bsSearch} />
                    </div>
                    <input
                      placeholder="Collection Name, TokenID"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </>
                </form>
              </div>
              <div className={stylesSort.stickyFilterContainer}>
                <div className={stylesSort.containerContent}>
                  <div className={stylesSort.flexContent}>
                    <h3>For Sale</h3>
                    <Switch
                      checked={buyItNow}
                      onCheckedChange={() => {
                        setBuyItNow(!buyItNow);
                      }}
                      id="s2"
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
                    style={{ display: openedFilter.view ? "block" : "none" }}
                  >
                    <h4
                      onClick={() => setView("grid")}
                      className={`${view === "grid" && stylesSort.activeTab}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Grid
                      {view === "grid" && (
                        <RiRadioButtonFill
                          style={{ margin: "0", fontSize: "1.2rem" }}
                        />
                      )}
                    </h4>

                    <h4
                      onClick={() => {
                        setView("card");
                        setSmallCard(false);
                      }}
                      className={`${
                        view === "card" && !smallCard && stylesSort.activeTab
                      }`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Card Large
                      {view === "card" && !smallCard && (
                        <RiRadioButtonFill
                          style={{ margin: "0", fontSize: "1.2rem" }}
                        />
                      )}
                    </h4>
                    <h4
                      onClick={() => {
                        setView("card");
                        setSmallCard(true);
                      }}
                      className={`${
                        view === "card" && smallCard && stylesSort.activeTab
                      }`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      Card Small
                      {view === "card" && smallCard && (
                        <RiRadioButtonFill
                          style={{ margin: "0", fontSize: "1.2rem" }}
                        />
                      )}
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
                  <div
                    className={stylesSort.gridContent}
                    style={{
                      display: openedFilter.collection ? "block" : "none",
                    }}
                  >
                    {baseCollections &&
                      baseCollections.map((item, i) => {
                        return (
                          <h4
                            key={i}
                            onClick={() => {
                              if (sellectedBaseCollections.includes(item)) {
                                setSellectedBaseCollections((color) =>
                                  color.filter((i) => i !== item)
                                );
                              } else {
                                setSellectedBaseCollections((prevState) => [
                                  ...prevState,
                                  item,
                                ]);
                              }
                            }}
                            style={{
                              fontWeight: sellectedBaseCollections.includes(
                                item
                              )
                                ? "bold"
                                : "400",
                              background: sellectedBaseCollections.includes(
                                item
                              )
                                ? "#e7e7e7"
                                : "#fff",
                              color: "#000",
                              boxShadow: sellectedBaseCollections.includes(item)
                                ? "0px 0px 4px #000"
                                : null,
                            }}
                          >
                            {item}
                          </h4>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ width: "100%" }}>
              <div className={styles.amountFlex}>
                {!loader && filteredData && baseCollections && (
                  <>
                    <h3 className={styles.contentFormSideSub}>
                      <span style={{ fontFamily: "Plaid" }}>
                        {buyItNow ? salesData.length : filteredData.length}
                      </span>
                      &nbsp;Items
                    </h3>
                    <h3 className={styles.contentFormSideSub}>
                      <div className="sort_dotContent__YqVB0"></div>
                      <span style={{ fontFamily: "Plaid" }}>
                        {baseCollections.length}
                      </span>
                      &nbsp;
                      {baseCollections.length === 1
                        ? "Collection"
                        : "Collections"}
                    </h3>
                  </>
                )}
              </div>
              <div
                style={{
                  display:
                    sellectedBaseCollections.length > 0 ? "flex" : "none",
                  paddingBottom:
                    sellectedBaseCollections.length > 0 ? "20px 0" : "0",
                  overflowY:
                    sellectedBaseCollections.length > 0 ? "auto" : "hidden",
                  width: sellectedBaseCollections.length > 0 && "100%",
                }}
                className={stylesSelected.filteredContainer}
              >
                <button
                  className={stylesSelected.buttonFilter}
                  onClick={() => {
                    setSellectedBaseCollections([]);
                  }}
                >
                  clear all filters
                </button>
                {sellectedBaseCollections.length > 0 &&
                  sellectedBaseCollections.map((item, index) => {
                    return (
                      <button
                        className={stylesSelected.buttonWhite}
                        key={index}
                      >
                        {item}
                        <IoMdClose
                          onClick={() => {
                            if (sellectedBaseCollections.length === 1) {
                              setSellectedBaseCollections([]);
                            } else {
                              setSellectedBaseCollections((color) =>
                                color.filter((i) => i !== item)
                              );
                            }
                          }}
                        />
                      </button>
                    );
                  })}
              </div>
              {loader ? (
                <div className={styles.bigLoaderContainer}>
                  <PuffLoader color="#fff" size={100} />
                </div>
              ) : (
                <div>
                  {amountOfResults &&
                    amountOfResults.length === 0 &&
                    search !== "" && (
                      <h1 className={styles.dontOwnColors}>
                        No Result Found!{" "}
                      </h1>
                    )}
                  {filteredData && filteredData.length === 0 ? (
                    <h1 className={styles.dontOwnColors}>
                      You don't own any color.
                    </h1>
                  ) : view === "grid" ? (
                    <div
                      className={stylesSecond.dataTableContainer}
                      style={{ width: "100%" }}
                    >
                      <div
                        className={stylesSecond.mainGrid}
                        style={{ minHeight: "5vh" }}
                        ref={containerWidthRef}
                      >
                        {buyItNow
                          ? salesData &&
                            salesData.map((item, index) => {
                              if (
                                item.contract_address.toLowerCase() ===
                                "0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf"
                              ) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.token_id}`}
                                    passHref
                                  >
                                    <a
                                      className={stylesSecond.gridItem}
                                      style={{
                                        background: item.extra_metadata.hex,
                                      }}
                                      key={index}
                                      onMouseEnter={() => {
                                        setDisplayCard(true);
                                        setCardId(item.name + item.token_id);
                                      }}
                                      onMouseLeave={() => {
                                        setDisplayCard(false);
                                        setCardId("");
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
                                            price={salesPrice[item.token_id]}
                                            expiry={salesExpiry[item.token_id]}
                                            onSale={true}
                                            data={data}
                                            grid={true}
                                            showOnLeft={handleSideReturn(
                                              index + 1
                                            )}
                                            displayCard={displayCard}
                                            cardId={cardId}
                                          />
                                        </div>
                                      </div>
                                    </a>
                                  </Link>
                                );
                              } else {
                                return (
                                  <div
                                    className={stylesSecond.gridItem}
                                    style={{
                                      background: "#fff",
                                      backgroundSize: "cover",
                                      backgroundImage: `url(${item.previews.image_medium_url})`,
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
                                      setCardId("");
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
                                          address={item.contract_address}
                                          token={item.token_id}
                                          price={salesPrice[item.token_id]}
                                          grid={true}
                                          showOnLeft={handleSideReturn(
                                            index + 1
                                          )}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })
                          : amountOfResults &&
                            amountOfResults.map((item, index) => {
                              if (
                                item.contract_address.toLowerCase() ===
                                "0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf"
                              ) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.token_id}`}
                                    passHref
                                  >
                                    <a
                                      className={stylesSecond.gridItem}
                                      style={{
                                        background: item.extra_metadata.hex,
                                      }}
                                      key={index}
                                      onMouseEnter={() => {
                                        setDisplayCard(true);
                                        setCardId(item.name + item.token_id);
                                      }}
                                      onMouseLeave={() => {
                                        setDisplayCard(false);
                                        setCardId("");
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
                                              item.extra_metadata
                                                .price_in_eth &&
                                              item.extra_metadata.price_in_eth.toFixed(
                                                2
                                              )
                                            }
                                            onSale={false}
                                            data={data}
                                            grid={true}
                                            showOnLeft={handleSideReturn(
                                              index + 1
                                            )}
                                            displayCard={displayCard}
                                            cardId={cardId}
                                          />
                                        </div>
                                      </div>
                                    </a>
                                  </Link>
                                );
                              } else {
                                return (
                                  <div
                                    className={stylesSecond.gridItem}
                                    style={{
                                      background: "#fff",
                                      backgroundSize: "cover",
                                      backgroundImage: `url(${item.previews.image_medium_url})`,
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
                                      setCardId("");
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
                                          address={item.contract_address}
                                          token={item.token_id}
                                          price={
                                            item.extra_metadata.price_in_eth &&
                                            item.extra_metadata.price_in_eth.toFixed(
                                              2
                                            )
                                          }
                                          onSale={false}
                                          data={data}
                                          grid={true}
                                          showOnLeft={handleSideReturn(
                                            index + 1
                                          )}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            })}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        !smallCard
                          ? styles.colorBoxView
                          : styles.colorBoxViewSmall
                      }
                    >
                      {buyItNow
                        ? salesData &&
                          salesData.map((item, index) => {
                            if (
                              (search !== "" &&
                                item.collection.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())) ||
                              item.token_id.toString().startsWith(search)
                            ) {
                              if (
                                item.contract_address.toLowerCase() ===
                                "0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf"
                              ) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.token_id}`}
                                    passHref
                                  >
                                    <a
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          name={item.name}
                                          token={item.token_id}
                                          price={salesPrice[item.token_id]}
                                          expiry={salesExpiry[item.token_id]}
                                          onSale={true}
                                          data={data}
                                        />
                                      </div>
                                    </a>
                                  </Link>
                                );
                              } else {
                                return (
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainerImage
                                        image={item.previews.image_medium_url}
                                        name={item.collection.name}
                                        address={item.contract_address}
                                        token={item.token_id}
                                        price={
                                          item.extra_metadata.price_in_eth &&
                                          item.extra_metadata.price_in_eth.toFixed(
                                            2
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            }
                          })
                        : amountOfResults &&
                          amountOfResults.map((item, index) => {
                            if (
                              (search !== "" &&
                                item.collection.name
                                  .toLowerCase()
                                  .includes(search.toLowerCase())) ||
                              item.token_id.toString().startsWith(search)
                            ) {
                              if (
                                item.contract_address.toLowerCase() ===
                                "0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf"
                              ) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.token_id}`}
                                    passHref
                                  >
                                    <a
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          name={item.name}
                                          token={item.token_id}
                                          price={
                                            item.extra_metadata.price_in_eth &&
                                            item.extra_metadata.price_in_eth.toFixed(
                                              2
                                            )
                                          }
                                          onSale={false}
                                          data={data}
                                        />
                                      </div>
                                    </a>
                                  </Link>
                                );
                              } else {
                                return (
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainerImage
                                        image={item.previews.image_medium_url}
                                        name={item.collection.name}
                                        address={item.contract_address}
                                        token={item.token_id}
                                        price={
                                          item.extra_metadata.price_in_eth &&
                                          item.extra_metadata.price_in_eth.toFixed(
                                            2
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            }
                          })}
                    </div>
                  )}
                  {receivedNfts &&
                    filteredData &&
                    !search &&
                    sellectedBaseCollections.length === 0 &&
                    receivedNfts.length - filteredData.length > 0 && (
                      <div className={styles.missingMetadata}>
                        {receivedNfts.length - filteredData.length} NFTs were
                        not shown due to missing metadata.
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      {!footerOnView && (
        <article
          className={stylesSort.mobileFilter}
          onClick={() => setOpenMobileFilter(true)}
        >
          Filter{" "}
          {sellectedBaseCollections.length > 0 ? (
            <span className={stylesSort.numbersOnFilter}>
              {sellectedBaseCollections.length}
            </span>
          ) : null}
        </article>
      )}
      <SlidingPane
        className={"newSlideContainer"}
        overlayClassName={stylesSort.slideMobileOverlay}
        isOpen={openMobileFilter}
        title={
          <div className={stylesFilter.newPurchaseTitle}>
            Filter
            <IoCloseSharp onClick={() => setOpenMobileFilter(false)} />
          </div>
        }
        width="100%"
        closeIcon=""
        from="bottom"
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
                  checked={buyItNow}
                  onCheckedChange={() => {
                    setBuyItNow(!buyItNow);
                  }}
                  id="s2"
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
                style={{ display: openedFilter.view ? "block" : "none" }}
              >
                <h4
                  onClick={() => setView("grid")}
                  style={{
                    fontWeight: view === "grid" ? "bold" : "400",
                    background: view === "grid" ? "#e7e7e7" : "#fff",
                    color: "#000",
                    boxShadow: view === "grid" ? "0px 0px 4px #000" : null,
                    margin: view === "grid" ? "3px 0" : null,
                  }}
                >
                  Grid
                </h4>

                <h4
                  onClick={() => {
                    setView("card");
                    setSmallCard(false);
                  }}
                  style={{
                    fontWeight: view === "card" && !smallCard ? "bold" : "400",
                    background:
                      view === "card" && !smallCard ? "#e7e7e7" : "#fff",
                    color: "#000",
                    boxShadow:
                      view === "card" && !smallCard
                        ? "0px -1px 2px #000"
                        : null,
                    margin: view === "card" && !smallCard ? "3px 0 0" : null,
                  }}
                >
                  Card Large
                </h4>
                <h4
                  onClick={() => {
                    setView("card");
                    setSmallCard(true);
                  }}
                  style={{
                    fontWeight: view === "card" && smallCard ? "bold" : "400",
                    background:
                      view === "card" && smallCard ? "#e7e7e7" : "#fff",
                    color: "#000",
                    boxShadow:
                      view === "card" && smallCard ? "0px -1px 2px #000" : null,
                    margin: view === "card" && smallCard ? "3px 0 0" : null,
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
              <div
                className={stylesSort.gridContent}
                style={{
                  display: openedFilter.collection ? "block" : "none",
                }}
              >
                {baseCollections &&
                  baseCollections.map((item, i) => {
                    return (
                      <h4
                        key={i}
                        onClick={() => {
                          if (sellectedBaseCollections.includes(item)) {
                            setSellectedBaseCollections((color) =>
                              color.filter((i) => i !== item)
                            );
                          } else {
                            setSellectedBaseCollections((prevState) => [
                              ...prevState,
                              item,
                            ]);
                          }
                        }}
                        style={{
                          fontWeight: sellectedBaseCollections.includes(item)
                            ? "bold"
                            : "400",
                          background: sellectedBaseCollections.includes(item)
                            ? "#e7e7e7"
                            : "#fff",
                          color: "#000",
                          boxShadow: sellectedBaseCollections.includes(item)
                            ? "0px 0px 4px #000"
                            : null,
                        }}
                      >
                        {item}
                      </h4>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </SlidingPane>
    </>
  );
};

export default Profile;

const NFTCardContainer = ({
  name,
  token,
  data,
  showOnLeft,
  grid,
  displayCard,
  cardId,
  price,
  expiry,
  onSale,
}) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("25");
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (name) {
      if (name.length < 10) {
        setFontSizeAmount(`${width < 350 ? "17.6" : "20"}`);
      } else if (name.length > 9 && name.length < 15) {
        setFontSizeAmount(`${width < 350 ? "16" : "17"}`);
      } else {
        setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
      }
    }
    // eslint-disable-next-line
  }, [name]);
  //
  //
  const percentage = 30;

  const { whiteBorders } = useSelector((state) => state.minting);
  const [color, setColor] = useState("");
  const [nftNo, setNftNo] = useState();
  useEffect(() => {
    data.documents.map((item) => {
      if (item.uint256.toString() === token) {
        setNftNo(item.nftNo);
      }
    });

    if (token == 1000000) {
      setColor("#000000");
    } else {
      let color = Web3.utils.numberToHex(token);
      color = color.slice(2);
      const colorPrefixString = [
        "000000",
        "00000",
        "0000",
        "000",
        "00",
        "0",
        "",
      ];
      color = "#" + colorPrefixString[color.length] + color;
      setColor(color.toString());
    }
  }, [token]);

  return (
    <div
      className={`${
        grid ? (!showOnLeft ? "left_position" : "right_position") : null
      }`}
    >
      <div
        className={`${stylesSale.recentlyBoxContainer} recentlyContainer`}
        style={{
          borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
          textDecoration: "none",
          background: "#000",
          display:
            (displayCard && cardId === name + token) || !grid
              ? "block"
              : "none",
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
                whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
              }`,
            }}
          >
            <div className="flex_cardContainer">
              <div className={stylesSale.logo_cardImage}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo NFTs"
                  data-atropos-offset="5"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="address" data-atropos-offset="5">
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
                  className="recentlyHeader"
                  style={{
                    // borderTop: `${whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                    //   }`,
                    marginTop: "3px",
                    borderBottom: "1px solid #292929",
                  }}
                >
                  <div
                    className="recentlyP"
                    style={{
                      fontSize: `${fontSizeAmount}px`,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    className="recentlyP margin_right"
                    style={{
                      textTransform: "uppercase",
                      fontSize: `${fontSizeAmount}px`,
                      color: "#fff",
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
            onSale ? (
              <div className={stylesSale.bottomPart}>
                <div className={stylesSale.colorBoxTime}>
                  <div className={stylesSale.colorBoxProcessBar}>
                    <AiFillClockCircle size={15} />
                  </div>
                  <span>Expires {expiry}</span>
                </div>
                <div className={stylesSale.colorDetails}>
                  <div className={stylesSale.flexContainerBottom}>
                    <h1>{price} ETH</h1>
                    <Link
                      href={`/gallery/color-nft/${token}?buy=true`}
                      passHref
                    >
                      <button className={stylesSale.buyButton}> BUY</button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className={stylesSale.bottomPart}>
                <div className={stylesSale.colorDetails}>
                  <h4
                    style={{
                      color: "#FFF",
                      margin: "0px",
                      fontWeight: "300",
                    }}
                  >
                    Last Price
                  </h4>
                  <div className={stylesSale.flexContainerBottom}>
                    <div className={stylesSale.ethSection}>
                      <h1>{price ? price : "0.00"} ETH</h1>
                    </div>
                  </div>
                </div>
              </div>
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
  address,
  token,
  showOnLeft,
  grid,
  cardId,
  displayCard,
}) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("25");
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      let widthDimension = window.innerWidth;
      setWidth(widthDimension);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (name) {
      if (name.length < 10) {
        setFontSizeAmount(`${width < 350 ? "17.6" : "20"}`);
      } else if (name.length > 9 && name.length < 15) {
        setFontSizeAmount(`${width < 350 ? "16" : "17"}`);
      } else {
        setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
      }
    }
    // eslint-disable-next-line
  }, [name]);

  const networkInfo = {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Mainnet,
  };
  const API_ENDPOINT = "https://api.zora.co/graphql";
  const zdk = new ZDK(API_ENDPOINT);

  useEffect(async () => {
    try {
      const graphQLClient = new GraphQLClient("https://api.zora.co/graphql");

      const salesQuery = gql`
        query TokenSale($address: String!, $token: String!) {
          token(token: { address: $address, tokenId: $token }) {
            sales {
              price {
                nativePrice {
                  decimal
                  currency {
                    decimals
                  }
                }
              }
              saleType
            }
          }
        }
      `;

      const salesVariables = {
        address: address,
        token: token,
      };

      const results = await graphQLClient.request(salesQuery, salesVariables);

      if (results.token && results.token.sales.length > 0) {
        const price = results.token.sales[0].price.nativePrice.decimal;
        setPrice(price.toString());
      } else {
        const mintQuery = gql`
          query TokenSale($address: String!, $token: String!) {
            mints(where: { tokens: { address: $address, tokenId: $token } }) {
              nodes {
                mint {
                  price {
                    nativePrice {
                      decimal
                      currency {
                        name
                        decimals
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        const mintVariables = {
          address: address,
          token: token,
        };

        const mintResults = await graphQLClient.request(
          mintQuery,
          mintVariables
        );

        if (mintResults.mints && mintResults.mints.nodes.length > 0) {
          const price =
            mintResults.mints.nodes[0].mint.price.nativePrice.decimal;
          setPrice(price.toString());
        } else {
          setPrice("0");
        }
      }
    } catch (e) {
      console.log(`Error : ${e}`);
    }
  }, []);

  const [isOnSale, setIsOnSale] = useState(false);
  const [price, setPrice] = useState("0");
  return (
    <div
      className={`${
        grid ? (!showOnLeft ? "left_position" : "right_position") : null
      }`}
    >
      <div
        className={`${stylesSale.recentlyBoxContainer} recentlyContainer  ${styles.recentlyContentSmall}`}
        style={{
          borderColor: "#292929",
          textDecoration: "none",
          background: "#000",
          display:
            (displayCard && cardId === name + token) || !grid
              ? "block"
              : "none",
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
            style={{ borderBottom: "1px solid #292929" }}
          >
            <div
              className="recentlyP"
              style={{
                fontSize: `${fontSizeAmount}px`,
              }}
            >
              {name}
            </div>
            <div
              className="recentlyP margin_right"
              style={{
                textTransform: "uppercase",
                fontSize: `${fontSizeAmount}px`,
                color: "#fff",
              }}
            >
              #{token.slice(0, 6)}
              {token.length > 6 && "..."}
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
                        trailColor: "#4A4A4A",
                        pathColor: "#fff",
                      })}
                    />
                  </div>
                  <span>Expires in 32 minutes</span>
                </div>
                <div className={stylesSale.colorDetails}>
                  <div className={stylesSale.flexContainerBottom}>
                    <div className={stylesSale.ethSection}>
                      <h1>{Number(price).toFixed(2)} ETH</h1>
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
                        color: "#FFF",
                        margin: "0px",
                        fontWeight: "300",
                      }}
                    >
                      Last Price
                    </h4>
                    <div className={stylesSale.flexContainerBottom}>
                      <div className={stylesSale.ethSection}>
                        <h1>{Number(price).toFixed(2)} ETH</h1>
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
