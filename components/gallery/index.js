import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/gallery/sort.module.css";
import stylesSale from "../../styles/modules/gallery/sale.module.css";
import { BsFillTriangleFill } from "react-icons/bs";
import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { GrFormNext } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import * as SelectPrimitive from "@radix-ui/react-select";
import { styled } from "@stitches/react";
import {
  StyledTrigger3,
  StyledTrigger2,
  StyledPrimitiveValue,
  StyledPrimitiveIcon,
  StyledContentFilter,
  StyledViewport,
  StyledItem,
  StyledItemIndicator,
  StyledLabel,
  scrollButtonStyles,
} from "../newTokenID/TokenSelectCss";
import {
  supaAPIUrl,
  supaCanon,
  TokenAddressList,
  API_URL,
} from "../../utils/constants";
import { BsSearch } from "react-icons/bs";
import { createClient } from "@supabase/supabase-js";
import useIntersection from "../Earn/useIntersection";
import { ethers } from "ethers";
import axios from "axios";
import { SiDiscord } from "react-icons/si";
import { BiLink } from "react-icons/bi";
import { AiFillTwitterCircle } from "react-icons/ai";
import { IoCloseCircleOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import Loader from "../Loader/Loader";
const LoadingValueContext = createContext();

const DynamicView = dynamic(() => import("./Views"), {
  loading: () => {
    const value = useContext(LoadingValueContext);
    <Loader />
    return <div dangerouslySetInnerHTML={{ __html: value }} />
  },
  ssr: false,
});

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// select 2
export const SelectTrigger2 = StyledTrigger2;
export const SelectTrigger3 = StyledTrigger3;

// Exports
export const Select = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger3;
export const SelectValue = StyledPrimitiveValue;
export const SelectIcon = StyledPrimitiveIcon;
export const SelectContent = StyledContentFilter;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectLabel = StyledLabel;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

const Gallery = () => {
  const { allReceivedData } = useSelector((state) => state.data);
  const { warnActive } = useSelector((state) => state.minting);

  // NFT collection color name
  const [baseColor, setBaseColor] = useState();

  //
  //
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(false);
  // Min price and Max price of NFT collection
  const [value, setValueReceived] = useState(0);
  // Min price of NFT collection
  const [minValue, setMinValue] = useState(0);
  // Max price of NFT collection
  const [maxValue, setMaxValue] = useState(0);
  const [rangeValue, setRangeValue] = useState([0, 0]);
  const [selectedBaseColors, setSelectedBaseColors] = useState([]);

  // NFT owner number of NFT collection
  const [numCollectors, setNumCollectors] = useState(0);
  // Total Number of NFT collection
  const [numNfts, setNumNfts] = useState(0);
  // Floor Eth price of NFT collection
  const [floorEth, setFloorEth] = useState(0.5);
  // Ceiling Eth price of NFT collection
  const [ceilingEth, setCeilingEth] = useState(0);
  // Total volume of NFT collection
  const [volumeEth, setVolumeEth] = useState(0);

  // We use supabase here to get NFT collection data
  const supabase = createClient(supaAPIUrl, supaCanon);

  // Get NFT Collectors and NFT numbers from supabase
  useEffect(async () => {
    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("name", "color-nft\n");
    if(data == null)return;
    setNumCollectors(data[0].numCollectors);
    setNumNfts(data[0].numNFT);
  }, []);

  // Get NFT Floor Price
  useEffect(async () => {
    // Get ETH/USD Price
    let usdPrice;
    await axios({
      method: "GET",
      url: `${API_URL}/others/tokenPrice`,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      usdPrice = res.data.USD;
    });

    if (typeof usdPrice == "undefined") usdPrice = 1000;

    var salesNFT = await axios({
      method: "GET",
      url: `${API_URL}/orders/asks`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const saleNFTList = await salesNFT.data;

    for (var i = 0; i < saleNFTList.length; i++) {
      const currency =
        currencyArray[TokenAddressList.indexOf(saleNFTList[i].erc20Token)];

      if (currency == "ETH" || currency == "WETH") {
        saleNFTList[i].ethPrice = convertFloat(
          (
            getBigNumber(saleNFTList[i].erc20TokenAmount).add(
              getBigNumber(saleNFTList[i].fee)
            ) /
            Math.pow(
              10,
              decimalForCurrency[
                TokenAddressList.indexOf(saleNFTList[i].erc20Token)
              ]
            )
          ).toFixed(10)
        );
      } else {
        saleNFTList[i].ethPrice =
          convertFloat(
            (
              getBigNumber(saleNFTList[i].erc20TokenAmount).add(
                getBigNumber(saleNFTList[i].fee)
              ) /
              Math.pow(
                10,
                decimalForCurrency[
                  TokenAddressList.indexOf(saleNFTList[i].erc20Token)
                ]
              )
            ).toFixed(10)
          ) / usdPrice;
      }
    }

    if (saleNFTList.length > 0) {
      const floorPriceNFT = saleNFTList.reduce((acc, loc) =>
        acc.ethPrice < loc.ethPrice ? acc : loc
      );

      const floorPrice = floorPriceNFT.ethPrice;
      setFloorEth(floorPrice);
    }
  }, []);

  // Get NFT collection volume
  useEffect(async () => {
    if (allReceivedData) {
      // Get sales volume
      const saleNFTs = await axios({
        method: "GET",
        url: `${API_URL}/orders/getnftvolume`,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const saleList = await saleNFTs.data;
      const saleVolume = saleList.reduce((accumulator, object) => {
        return (
          accumulator +
          convertFloat(
            (
              getBigNumber(object.erc20TokenAmount).add(
                getBigNumber(object.fee)
              ) /
              Math.pow(
                10,
                decimalForCurrency[TokenAddressList.indexOf(object.erc20Token)]
              )
            ).toFixed(10)
          )
        );
      }, 0);
      // Get mint volume
      const mintVolume = allReceivedData.reduce((accumulator, object) => {
        return accumulator + object.price_in_eth;
      }, 0);
      const totalVolume = saleVolume + mintVolume;
      setVolumeEth(totalVolume);
    }
  }, [allReceivedData]);

  useEffect(() => {
    if (allReceivedData) {
      let newData = [];
      // eslint-disable-next-line
      allReceivedData.map((item) => {
        newData.push(item.base_color_name);
      });
      var uniq = [...new Set(newData)];
      setBaseColor(uniq);

      // Get object with floor eth price
      const smallestEthNFT = allReceivedData.reduce((acc, loc) =>
        acc.price_in_eth < loc.price_in_eth ? acc : loc
      );
      setFloorEth(smallestEthNFT.price_in_eth);

      // Get object with ceiling eth price
      const biggestestEthNFT = allReceivedData.reduce((acc, loc) =>
        acc.price_in_eth > loc.price_in_eth ? acc : loc
      );
      setCeilingEth(biggestestEthNFT.price_in_eth);

      //Get object with smallest usd price
      const smallest = allReceivedData.reduce((acc, loc) =>
        acc.price_in_eth < loc.price_in_eth ? acc : loc
      );

      // Get object with big usd price
      const greatest = allReceivedData.reduce((acc, loc) =>
        acc.price_in_eth > loc.price_in_eth ? acc : loc
      );

      const minValue = smallest.price_in_eth ? smallest.price_in_eth : 0.0;
      const maxValue = greatest.price_in_eth ? greatest.price_in_eth : 0.0;
      setMinValue(minValue);
      setMaxValue(maxValue);
      setValueReceived(greatest.price_in_eth ? greatest.price_in_eth : 0.0);
      setRangeValue([minValue, maxValue]);
    }
  }, [allReceivedData]);

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

  const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
  const decimalForCurrency = [18, 18, 6, 18, 6];

  // const [ownsColors, setOwnsColors] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [buyItNow, setBuyItNow] = useState(false);

  const containerContent = useRef();

  // Show floor price or ceiling price
  const [showFloorPrice, setShowFloorPrice] = useState(true);
  // Items tab selected or Activity tab selected
  // Item tab selected: true
  // Activity tab selected: false
  const [items, setItems] = useState(true);
  // Search keyword
  const [search, setSearch] = useState("");
  const [filterRefWidth, setFilterRefWidth] = useState(false);
  const filterRef = useRef();

  useEffect(() => {
    if (document.documentElement.clientWidth <= 380) {
      setFilterRefWidth(true);
    }
  }, []);

  const refFilter = useIntersection(
    filterRef,
    filterRefWidth ? "-120px" : "-200px"
  );
  const [focusInput, setFocusInput] = useState(false);

  const [showInput, setShowInput] = useState(false);

  // filter Amount
  const [amountOfResults, setAmountOfResults] = useState([]);

  // activiry tableSearch
  const [tableSearch, setTableSearch] = useState();

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setShowInput(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [showInput]);

  useEffect(() => {
    if (sessionStorage.getItem("items")) {
      setItems(sessionStorage.getItem("items") === "true" ? true : false);
    } else return null;
  }, []);

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.profileTop}>
          <div className={styles.profileTopColor}></div>
          <div
            className={styles.flexTitle}
            style={{ paddingTop: warnActive ? "20px" : "0" }}
          >
            <Link href="/">HOME</Link>
            <GrFormNext />
            <p>
              <Link href="/gallery/color-nft">GALLERY</Link>
            </p>{" "}
            <GrFormNext /> <p>COLOR NFT</p>
          </div>
          <div className={styles.profileDetails}>
            <img
              src={"/images/logos/colorMuseumCircleLogo.png"}
              alt=""
              className={styles.profileImage}
            />
            {/* <div className={styles.profileImage}>0x</div> */}
            <div className={styles.iconList}>
              <div className={styles.iconLink}>
                {" "}
                <a href="https://discord.gg/colormuseum" target="_blank">
                  <SiDiscord />
                </a>
              </div>
              <div className={styles.iconLink}>
                {" "}
                <a href="https://twitter.com/colordotmuseum" target="_blank">
                  <AiFillTwitterCircle />
                </a>
              </div>
              <div className={styles.iconLink}>
                {" "}
                <a href="https://color.museum" target="_blank">
                  <BiLink />
                </a>
              </div>
            </div>
          </div>
        </div>{" "}
        <h2 className={styles.subHeader}>TRADE THE</h2>
        <div style={{ display: "flex" }}>
          <h1 className={styles.header}>
            COLOR NFT <span>COLLECTION</span>
          </h1>
          <h1
            className={styles.filterHeaderDeskptop}
            onClick={() => setFilterIsOpen(!filterIsOpen)}
          >
            Filter {!filterIsOpen ? <BsChevronDown /> : <IoMdClose />}
          </h1>
        </div>
        <div className={styles.sort_container}>
          <h1
            className={styles.filterHeaderMobile}
            onClick={() => setFilterIsOpen(!filterIsOpen)}
          >
            Filter {!filterIsOpen ? <BsChevronDown /> : <IoMdClose />}
          </h1>
          <div className={styles.filterHeaderText} ref={containerContent}>
            <div className={styles.containerToggleActivity}>
              <div className={styles.wrapperToggle}>
                <div
                  style={{ background: items ? "#333333" : "#000" }}
                  onClick={() => {
                    setItems(true);
                    if (sessionStorage.getItem("items")) {
                      sessionStorage.removeItem("items");
                      sessionStorage.setItem("items", true);
                    } else {
                      sessionStorage.setItem("items", true);
                    }
                  }}
                >
                  Items
                </div>
                <div
                  style={{ background: items ? "#000" : "#333333" }}
                  onClick={() => {
                    setItems(false);
                    if (sessionStorage.getItem("items")) {
                      sessionStorage.removeItem("items");
                      sessionStorage.setItem("items", false);
                    } else {
                      sessionStorage.setItem("items", false);
                    }
                  }}
                >
                  Activity
                </div>
              </div>
              <div className={styles.iconList}>
                <div className={styles.iconLink}>
                  {" "}
                  <a href="https://discord.gg/colormuseum" target="_blank">
                    <SiDiscord />
                  </a>
                </div>
                <div className={styles.iconLink}>
                  {" "}
                  <a href="https://twitter.com/colordotmuseum" target="_blank">
                    <AiFillTwitterCircle />
                  </a>
                </div>
                <div className={styles.iconLink}>
                  {" "}
                  <a href="https://color.museum" target="_blank">
                    <BiLink />
                  </a>
                </div>
              </div>
            </div>
            <div className={styles.contentMarketInfo}>
              <h2 className={styles.contentFormSide}>
                {showFloorPrice ? (
                  <>
                    <span style={{ color: "#0f6", fontFamily: "Plaid" }}>
                      <BsFillTriangleFill size={23} />{" "}
                      {floorEth && floorEth.toFixed(2)}&nbsp;
                    </span>
                    ETH Floor
                  </>
                ) : (
                  <>
                    <span style={{ color: "#0f6", fontFamily: "Plaid" }}>
                      <BsFillTriangleFill
                        size={23}
                        style={{
                          transform: "rotate(180deg)",
                          // cursor: "pointer",
                        }}
                      />{" "}
                      {ceilingEth.toFixed(2)}{" "}
                    </span>
                    ETH Ceiling
                  </>
                )}
              </h2>
              <h3 className={styles.contentFormSideSubMobileId}>
                <div className={styles.dotContent} />
                <span style={{ fontFamily: "Plaid" }}>
                  {volumeEth.toFixed(0)}
                </span>
                ETH Volume
              </h3>
              <h3 className={styles.contentFormSideSub}>
                <div className={styles.dotContent} />
                <span style={{ fontFamily: "Plaid" }}>{numNfts}</span>
                Colors
              </h3>
              <h3 className={styles.contentFormSideSubMobileId}>
                <div className={styles.dotContent} />
                <span style={{ fontFamily: "Plaid" }}>{numCollectors}</span>
                Collectors
              </h3>
            </div>
            <div className={styles.mobileFlexOnly}>
              {!showInput ? (
                <div className={styles.containerToggleActivityMobile}>
                  <div
                    className={styles.searchContainerActivate}
                    onClick={() => {
                      setShowInput(!showInput);
                      // setItems(true);
                    }}
                  >
                    <div>
                      <BsSearch />
                    </div>
                  </div>
                  <div className={styles.wrapperToggle}>
                    <div
                      style={{ background: items ? "#333333" : "#000" }}
                      onClick={() => {
                        setItems(true);
                        if (sessionStorage.getItem("items")) {
                          sessionStorage.removeItem("items");
                          sessionStorage.setItem("items", true);
                        } else {
                          sessionStorage.setItem("items", true);
                        }
                      }}
                    >
                      Items
                    </div>
                    <div
                      style={{ background: items ? "#000" : "#333333" }}
                      onClick={() => {
                        setItems(false);
                        if (sessionStorage.getItem("items")) {
                          sessionStorage.removeItem("items");
                          sessionStorage.setItem("items", false);
                        } else {
                          sessionStorage.setItem("items", false);
                        }
                        // setShowInput(false);
                      }}
                    >
                      Activity
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`${styles.filterFormMobile}`}
                  style={{
                    padding: showInput ? "2px" : "0",
                    height: "42px",
                  }}
                >
                  {items ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveToDB();
                      }}
                      style={{
                        height: "40px",
                      }}
                    >
                      <div className={styles.searchContainerActivate}>
                        <div>
                          <BsSearch />
                        </div>
                      </div>
                      <input
                        placeholder="Search by Name, Hex, Category, No., TokenID"
                        value={search}
                        onFocus={() => {
                          if (!items) {
                            setItems(true);
                          }
                          setFocusInput(true);
                        }}
                        onBlur={() => setFocusInput(false)}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {amountOfResults && amountOfResults.length > 0 && (
                        <div className={styles.formSerachLenghtMobile}>
                          {amountOfResults.length}{" "}
                          {amountOfResults.length > 1 ? "Results" : "Result"}
                        </div>
                      )}
                      <IoCloseCircleOutline
                        className={styles.closeIcon}
                        onClick={() => {
                          setShowInput(false);
                        }}
                      />
                    </form>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        // saveToDBForTable();
                      }}
                      style={{
                        height: "40px",
                      }}
                    >
                      <div className={styles.searchContainerActivate}>
                        <div>
                          <BsSearch />
                        </div>
                      </div>
                      <input
                        placeholder="Search by Name, Hex, Category, No., TokenID"
                        value={tableSearch}
                        onFocus={() => {
                          // if (!items) {
                          //   setItems(true);
                          // }
                          setFocusInput(true);
                        }}
                        onBlur={() => setFocusInput(false)}
                        onChange={(e) => setTableSearch(e.target.value)}
                      />
                      {/* {amountOfResults.length > 0 && (
                        <div className={styles.formSerachLenght}>
                          {amountOfResults.length}{" "}
                          {amountOfResults.length > 1 ? "Results" : "Result"}
                        </div>
                      )} */}
                      <IoCloseCircleOutline
                        className={styles.closeIcon}
                        onClick={() => {
                          setShowInput(false);
                        }}
                      />
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {/*  */}
        {/*  */}
        <div ref={filterRef}>
          <LoadingValueContext.Provider>
            <DynamicView
              baseColor={baseColor}
              filtered={filtered}
              selectedBaseColors={selectedBaseColors}
              setSelectedBaseColors={setSelectedBaseColors}
              search={search}
              setSearch={setSearch}
              value={value}
              minValue={minValue}
              maxValue={maxValue}
              setMinValue={setMinValue}
              setMaxValue={setMaxValue}
              rangeValue={rangeValue}
              setRangeValue={setRangeValue}
              setValueReceived={setValueReceived}
              setToggled={setToggled}
              toggled={toggled}
              buyItNow={buyItNow}
              setBuyItNow={setBuyItNow}
              setFiltered={setFiltered}
              items={items}
              refFilter={refFilter}
              focusInput={focusInput}
              amountOfResults={amountOfResults}
              setAmountOfResults={setAmountOfResults}
              tableSearch={tableSearch}
              setTableSearch={setTableSearch}
            />
          </LoadingValueContext.Provider>
        </div>

        <div className={stylesSale.logo_cardImage}></div>
      </section>
    </>
  );
};

export default Gallery;
