import Link from "next/link";
import { useRouter } from "next/router";
import React, { createRef, useEffect, useRef, useState } from "react";
import stylesSecond from "../../styles/modules/gallery/view.module.css";
import styles from "../../styles/modules/gallery/sort.module.css";
import DataTable from "react-data-table-component";
import Atropos from "atropos/react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { FiMinus } from "react-icons/fi";
import { BsPlusLg, BsSearch } from "react-icons/bs";
import { AiFillClockCircle } from "react-icons/ai";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { BiExpand } from "react-icons/bi";
import { RiRadioButtonFill } from "react-icons/ri";
import { GoTriangleUp } from "react-icons/go";
import {
  MINTED_SQUARE,
  PROVIDER,
  SMARTCONTRACTADDR,
  API_URL,
  TokenAddressList,
  SOCKET_URL,
  PROVIDER_FOR_WEB3,
} from "../../utils/constants";
import Web3 from "web3";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI.js";
import hexRgb from "hex-rgb";
import { ReceivedData } from "../../store/actions/data";
import { isMobile } from "react-device-detect";
import toast from "react-hot-toast";
import { Switch, SwitchThumb } from "./StyledSwitch";
import stylesSale from "../../styles/modules/gallery/sale.module.css";
import SalesTradesTable from "./SalesTradesTable";
import InfiniteScroll from "react-infinite-scroll-component";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import stylesFilter from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import stylesSelected from "../../styles/modules/gallery/filter.module.css";
import BidsTradesTable from "./BidsTradesTable";
import AsksTradesTable from "./AsksTradesTable";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import axios from "axios";
import { ethers } from "ethers";
import moment from "moment";
import wordsHex from "../../utils/hexwords.json";
import { io } from "socket.io-client";
import { styled } from "@stitches/react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import SlideConnectWallet from "../navbar/SlideConnectWallet";

const StyledSlider = styled(SliderPrimitive.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  width: "100%",

  '&[data-orientation="horizontal"]': {
    height: 20,
  },

  '&[data-orientation="vertical"]': {
    flexDirection: "column",
    width: 20,
    height: 100,
  },
});

const StyledTrack = styled(SliderPrimitive.Track, {
  background: "#F1F1F1",
  border: "2px solid #CBCBCB",
  position: "relative",
  flexGrow: 1,
  borderRadius: "9999px",
  '&[data-orientation="horizontal"]': { height: 20 },
  '&[data-orientation="vertical"]': { width: 20 },
});

const StyledRange = styled(SliderPrimitive.Range, {
  position: "absolute",
  background: "#CDCDCD",
  outline: "2px solid #000000",
  borderRadius: "20px 0 0 20px",
  height: "100%",
});

const StyledThumb = styled(SliderPrimitive.Thumb, {
  display: "block",
  outline: "none",
  marginTop: "15px",
});

const Views = ({
  baseColor,
  filtered,
  selectedBaseColors,
  value,
  maxValue,
  minValue,
  setMaxValue,
  setMinValue,
  rangeValue,
  setRangeValue,
  setToggled,
  toggled,
  setSelectedBaseColors,
  setFiltered,
  buyItNow,
  setBuyItNow,
  items,
  search,
  setSearch,
  refFilter,
  focusInput,
  amountOfResults,
  setAmountOfResults,
  tableSearch,
  setTableSearch,
}) => {
  let history = useRouter();
  const [displayCard, setDisplayCard] = useState(false);
  const [cardId, setCardId] = useState();
  // All NFTs
  const { allReceivedData } = useSelector((state) => state.data);
  // Price filter NFTs
  const [priceFilteredData, setPriceFilteredData] = useState([]);

  const dispatch = useDispatch();
  const [minPercent, setMinPercent] = useState(0);
  const [maxPercent, setMaxPercent] = useState(100);

  // Price increasing or decreasing sort updating

  useEffect(() => {
    const sorted =
      allReceivedData &&
      allReceivedData.sort(function (a, b) {
        if (a.price_in_eth < b.price_in_eth) {
          return 1;
        }
        if (a.price_in_eth > b.price_in_eth) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    dispatch(ReceivedData(sorted));
  }, [allReceivedData]);

  const columns = [
    {
      name: "Color",
      selector: (row) => row.color,
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Hexadecimal",
      selector: (row) => row.hexadecimal,
      className: "testing",
    },
    {
      name: "TokenID",
      selector: (row) => row.tokenID,
    },
    {
      name: "NFT No.",
      selector: (row) => row.nftnumber,
    },
    {
      name: "Mint Price",
      selector: (row) => row.lastprice,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "55px", // override the row height
        background: "#000",
        color: "#fff",
        borderBottom: "2px solid #1B1B1D",
        borderTop: "2px solid #1B1B1D",
        fontSize: "1.7rem",
        display: "grid",
        gridTemplateColumns: ".6fr 1.75fr repeat(2, 1fr) .75fr 1.4fr",
        gridTemplateRows: "1fr",
        transition: "all 0.3s else",
        "&:hover": {
          background: "#100F0F",
        },
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        background: "#100F0F",
        border: "none",
        color: "#fff",
        fontSize: "1.309rem",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
        border: "none",
      },
    },
    headRow: {
      style: {
        border: "none",
        minHeight: "52.5px",
        display: "grid",
        gridTemplateColumns: ".6fr 1.75fr repeat(2, 1fr) .75fr 1.4fr",
        gridTemplateRows: "1fr",
      },
    },
  };

  // Show NFT card on left side or right side when mouse is hover on NFT color
  // Right side: false
  // Left side: true
  const [showOnLeft, setShowOnLeft] = useState(false);
  const refOverflow = createRef();
  function handleShow() {
    if (refOverflow.current?.clientWidth < refOverflow.current?.scrollWidth) {
      setShowOnLeft(true);
    } else {
      setShowOnLeft(false);
    }
  }
  //
  //
  const { connectedAddress } = useSelector((state) => state.minting);
  const { footerOnView } = useSelector((state) => state.toggle);
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
  const contract = new web3.eth.Contract([tokensOfOwnerABI], SMARTCONTRACTADDR);
  const [showToggle, setShowToggle] = useState(true);
  // My NFTs
  const [nfts, setNfts] = useState();

  // Filter My NFTs
  useEffect(() => {
    setNfts([]);
    if (allReceivedData && connectedAddress !== "") {
      let nfts;
      const handleNfts = async () => {
        nfts = await contract.methods.tokensOfOwner(connectedAddress).call();
        const filteredDataIsTrue = allReceivedData.filter((item) => {
          return nfts.includes(item.uint256.toString());
        });
        setNfts(nfts);
        if (filteredDataIsTrue.length > 0) {
          setShowToggle(true);
        } else {
          setShowToggle(false);
        }
      };
      handleNfts();
    }
    // setNfts(["9047054"]);
    // setToggled(true);
  }, [allReceivedData, connectedAddress]);

  const opacityAmount = "0.15";
  // Touched NFT Id
  const [selectCardIdOnHover, setSelectCardIdOnHover] = useState(null);
  // Change Touched NFT Opacity
  const changeOpacityAmount = (cardId) => {
    if (cardId) {
      setSelectCardIdOnHover(cardId);
    } else {
      setSelectCardIdOnHover(null);
    }
  };

  // Set Opened Filter part, default is view part
  const [openedFilter, setOpenedFilter] = useState({
    view: true,
    status: false,
    group: false,
    price: true,
  });
  const backendUrl = `https://accounts.color.museum/`;

  // View type: card, list, grid
  // Default: card
  const [view, setView] = useState("card");

  // This function is invoked when user press Enter button after inputing filter keyword
  const saveToDB = async () => {
    const {
      body: { data, error },
    } = await axios.post(`${backendUrl}insertUpsert`, {
      tableName: "colorNFTSearch",
      insertData: search,
      upsert: true,
    });
  };
  const [amountShowedList, setAmountShowed] = useState(2);
  const [amountShowedCard, setAmountShowedCard] = useState(5);

  // NFTs for sale
  const [socketSalesNFTs, setSocketSalesNFTs] = useState([]);
  const [salesNfts, setSalesNfts] = useState([]);
  const [salesNftsCount, setSalesNftsCount] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [salesPrice, setSalesPrice] = useState({});
  const [salesRealPrice, setSalesRealPrice] = useState({});
  const [salesExpiry, setSalesExpiry] = useState({});
  const [salesNftsData, setSalesNftsData] = useState({});

  // Expiry Sorted Data
  const [sortedNftsData, setSortedNftsData] = useState([]);

  // NFTs that is sold
  const [soldNfts, setSoldNfts] = useState([]);
  const [soldNftsPrice, setSoldNftsPrice] = useState([]);

  var usdPrice = 1000;

  // Filter NFTs for Sale
  useEffect(async () => {
    setSalesNfts([]);
    setSalesData([]);
    setSalesPrice({});
    initialAsksData();
    initialSalesData();

    const socket = io(SOCKET_URL);
    // socket.on('connect', () => console.log(`Socket Id: ${socket.id}`));
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("asks", (data) => {
      setSocketSalesNFTs(JSON.parse(data));
    });
    socket.on("sales", (data) => {
      makeSalesDataFormat(JSON.parse(data));
    });
    // socket.on('disconnect', () => console.log('server disconnected'));
  }, [allReceivedData]);

  const initialAsksData = async () => {
    var salesNFT = await axios({
      method: "GET",
      url: `${API_URL}/orders/asks`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const saleNFTList = await salesNFT.data;

    makeAsksDataFormat(saleNFTList);
  };

  const initialSalesData = async () => {
    var salesNFT = await axios({
      method: "GET",
      url: `${API_URL}/orders/sales`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const soldNFTList = await salesNFT.data;

    makeSalesDataFormat(soldNFTList);
  };

  const makeAsksDataFormat = async (saleNFTList) => {
    if (saleNFTList.length != salesNfts.length) {
      if (saleNFTList.length > 0 && allReceivedData) {
        saleNFTList = saleNFTList.filter((item) => {
          return item.expiry * 1000 > new Date();
        });

        // saleNFTList = saleNFTList.filter(async (item) => {
        //   return await checkOwner(item.seller, item.erc721TokenId);
        // });

        var tempSaleNFTList = [];
        for (var i = 0; i < saleNFTList.length; i++) {
          if (
            await checkOwner(
              saleNFTList[i].seller,
              saleNFTList[i].erc721TokenId
            )
          )
            tempSaleNFTList.push(saleNFTList[i]);
        }

        // console.log(`SALENFTLIST : ${JSON.stringify(tempSaleNFTList)}`);

        // Get ETH/USD Price
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

        let nftPrice = {};
        let nftRealPrice = {};
        let nftExpiry = {};
        const saleNFTIdList = tempSaleNFTList.map((item) => {
          return item["erc721TokenId"].toString();
        });

        let uniqueSaleNFTIdList = [];
        saleNFTIdList.forEach((item) => {
          if (!uniqueSaleNFTIdList.includes(item))
            uniqueSaleNFTIdList.push(item);
        });
        setSalesNftsCount(uniqueSaleNFTIdList.length);

        const saleDataIsTrue = allReceivedData.filter((item) => {
          return saleNFTIdList.includes(item.uint256.toString());
        });
        tempSaleNFTList.forEach((item) => {
          const currency =
            currencyArray[TokenAddressList.indexOf(item.erc20Token)];

          if (currency == "ETH" || currency == "WETH") {
            item.ethPrice = convertFloat(
              (
                getBigNumber(item.erc20TokenAmount).add(
                  getBigNumber(item.fee)
                ) /
                Math.pow(
                  10,
                  decimalForCurrency[TokenAddressList.indexOf(item.erc20Token)]
                )
              ).toFixed(10)
            );
          } else {
            item.ethPrice =
              convertFloat(
                (
                  getBigNumber(item.erc20TokenAmount).add(
                    getBigNumber(item.fee)
                  ) /
                  Math.pow(
                    10,
                    decimalForCurrency[
                      TokenAddressList.indexOf(item.erc20Token)
                    ]
                  )
                ).toFixed(10)
              ) / usdPrice;
          }

          nftExpiry[item.erc721TokenId] = moment(item.expiry * 1000).fromNow();
          nftPrice[item.erc721TokenId] = item.ethPrice;
          nftRealPrice[item.erc721TokenId] =
            convertFloat(
              (
                getBigNumber(item.erc20TokenAmount).add(
                  getBigNumber(item.fee)
                ) /
                Math.pow(
                  10,
                  decimalForCurrency[TokenAddressList.indexOf(item.erc20Token)]
                )
              ).toFixed(10)
            ) +
            " " +
            currencyArray[TokenAddressList.indexOf(item.erc20Token)];
        });

        setSalesNftsData(tempSaleNFTList);
        setSalesPrice(nftPrice);
        setSalesRealPrice(nftRealPrice);
        setSalesExpiry(nftExpiry);
        setSalesData(saleDataIsTrue);
        setSalesNfts(saleNFTIdList);
      }
    }
  };

  useEffect(() => {
    makeAsksDataFormat(socketSalesNFTs);
  }, [socketSalesNFTs]);

  const checkOwner = async (address, id) => {
    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
    var owner = await NFTInstance.methods.ownerOf(id).call();
    return address.toLowerCase() == owner.toLowerCase();
  };

  const makeSalesDataFormat = async (soldNFTList) => {
    if (soldNFTList.length > 0) {
      if (allReceivedData) {
        soldNFTList.sort(function (a, b) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        const soldNFTIdList = soldNFTList.map((item) => {
          return item["erc721TokenId"].toString();
        });
        let uniqueSoldNFTIdList = [];
        soldNFTIdList.forEach((item) => {
          if (!uniqueSoldNFTIdList.includes(item))
            uniqueSoldNFTIdList.push(item);
        });

        let nftPrice = {};

        soldNFTList.forEach((item) => {
          const currency =
            currencyArray[TokenAddressList.indexOf(item.erc20Token)];
          let ethPrice;

          if (currency == "ETH" || currency == "WETH") {
            ethPrice = convertFloat(
              (
                getBigNumber(item.erc20TokenAmount).add(
                  getBigNumber(item.fee)
                ) /
                Math.pow(
                  10,
                  decimalForCurrency[TokenAddressList.indexOf(item.erc20Token)]
                )
              ).toFixed(10)
            );
          } else {
            ethPrice =
              convertFloat(
                (
                  getBigNumber(item.erc20TokenAmount).add(
                    getBigNumber(item.fee)
                  ) /
                  Math.pow(
                    10,
                    decimalForCurrency[
                      TokenAddressList.indexOf(item.erc20Token)
                    ]
                  )
                ).toFixed(10)
              ) / usdPrice;
          }

          nftPrice[item.erc721TokenId] = ethPrice;
        });

        // console.log(`UniqueSoldNFTIDLIST : ${uniqueSoldNFTIdList}`);
        // console.log(`UniqueSoldNFTPRICE : ${JSON.stringify(nftPrice)}`);

        allReceivedData.forEach((item) => {
          if (uniqueSoldNFTIdList.includes(item.uint256.toString()))
            item.price_in_eth = Number(nftPrice[item.uint256]);
        });

        setSoldNfts(uniqueSoldNFTIdList);
        setSoldNftsPrice(nftPrice);
      }
    }
  };

  useEffect(() => {
    if (search !== "") {
      setAmountShowed(baseColor.length - 1);
    } else {
      setAmountShowed(2);
      setAmountShowedCard(5);
    }
  }, [search]);

  const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
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

  // Filter search keyword, search hex, name, nftNo, base_color_name, uint256
  useEffect(() => {
    if (search !== "") {
      if (buyItNow) {
        const data = salesData.filter((item) => {
          return (
            item.hex.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.nftNo.toString().startsWith(search) ||
            item.base_color_name
              .toLowerCase()
              .startsWith(search.toLowerCase()) ||
            item.uint256.toString().startsWith(search)
          );
        });
        setAmountOfResults(data);
      } else {
        const data = allReceivedData.filter((item) => {
          return (
            item.hex.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.nftNo.toString().startsWith(search) ||
            item.base_color_name
              .toLowerCase()
              .startsWith(search.toLowerCase()) ||
            item.uint256.toString().startsWith(search)
          );
        });
        setAmountOfResults(data);
      }
    } else {
      setAmountOfResults([]);
    }
  }, [search]);

  // For sale sort
  useEffect(() => {
    if (buyItNow && Array.isArray(salesNftsData) && salesNftsData.length > 0) {
      const floorPriceNFT = salesNftsData.reduce((acc, loc) =>
        acc.ethPrice < loc.ethPrice ? acc : loc
      );

      const ceilingPriceNFT = salesNftsData.reduce((acc, loc) =>
        acc.ethPrice > loc.ethPrice ? acc : loc
      );
      const floorPrice = Number(floorPriceNFT.ethPrice);
      const ceilingPrice = Number(ceilingPriceNFT.ethPrice);

      if (floorPrice != minValue || ceilingPrice != maxValue) {
        setMaxValue(ceilingPrice);
        setMinValue(floorPrice);

        setMinPercent(0);
        setMaxPercent(100);

        setRangeValue([floorPrice, ceilingPrice]);
      }

      const saleNFTIdList = salesNftsData.map((item) => {
        return item["erc721TokenId"].toString();
      });

      const tempAllReceivedData = [];
      for (var k = 0; k < allReceivedData.length; k++) {
        tempAllReceivedData.push(allReceivedData[k]);
        tempAllReceivedData[k].expiry = 9999999999;
      }
      for (var i = 0; i < tempAllReceivedData.length; i++)
        for (var j = 0; j < salesNftsData.length; j++) {
          if (
            salesNftsData[j]["erc721TokenId"].toString() ==
            tempAllReceivedData[i].uint256
          ) {
            tempAllReceivedData[i].expiry = salesNftsData[j].expiry;
          }
        }
      tempAllReceivedData.sort((a, b) => {
        if (a.expiry > b.expiry) return 1;
        if (a.expiry < b.expiry) return -1;
        return 0;
      });
      tempAllReceivedData.forEach((item) => {
        delete item.expiry;
      });

      setSortedNftsData(tempAllReceivedData);

      // dispatch(ReceivedData(tempAllReceivedData));
    } else {
      if (allReceivedData) {
        //Get object with smallest usd price
        const smallest = allReceivedData.reduce((acc, loc) =>
          acc.price_in_eth < loc.price_in_eth ? acc : loc
        );

        // Get object with big usd price
        const greatest = allReceivedData.reduce((acc, loc) =>
          acc.price_in_eth > loc.price_in_eth ? acc : loc
        );
        const minMintValue = smallest.price_in_eth
          ? smallest.price_in_eth
          : 0.0;
        const maxMintValue = greatest.price_in_eth
          ? greatest.price_in_eth
          : 0.0;
        if (minMintValue != minValue || maxMintValue != maxValue) {
          setMinValue(minMintValue);
          setMaxValue(maxMintValue);
          setMinPercent(0);
          setMaxPercent(100);
          setRangeValue([minMintValue, maxMintValue]);
        }
      }
    }
  }, [buyItNow, salesNftsData]);

  useEffect(() => {
    if (buyItNow) {
    } else if (rangeValue && allReceivedData) {
      const priceFilteredData = allReceivedData.filter((item) => {
        return (
          item.price_in_eth?.toFixed(2) <= rangeValue[1].toFixed(2) &&
          item.price_in_eth?.toFixed(2) >= rangeValue[0].toFixed(2)
        );
      });
      setPriceFilteredData(priceFilteredData);
    }
  }, [rangeValue, allReceivedData]);

  // showed NFTs card empty array. This is used to show NFTs step by step
  const [autoLoadCard, setAutoLoadCard] = useState(Array.from({ length: 20 }));
  // If all NFTs is more than showed NFTs, it returned ture
  const [hasMore, setHasMore] = useState(true);

  // Increase autoLoadCard array 20 with 0.5 secs delay
  const fetchMoreData = () => {
    if (autoLoadCard.length >= allReceivedData.length) {
      setHasMore(false);
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    setTimeout(() => {
      setAutoLoadCard(autoLoadCard.concat(Array.from({ length: 20 })));
    }, 500);
  };

  // Show NFTs as small card or large card
  // Small Card: true
  // Large Card: false
  const [smallCard, setSmallCard] = useState(true);
  // Mobile Filter option is opened
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  // connectWallet open
  const [connectWallet, setConnectWallet] = useState(false);

  useEffect(() => {
    if (connectedAddress && toggled) {
      setToggled(false);
      if (!showToggle) {
        setTimeout(() => {
          toast(
            <div className={"toastComman"}>
              You do not own any colors.
              <IoClose
                size={25}
                onClick={(t) => {
                  toast.dismiss(t.id);
                }}
              />
            </div>,
            {
              style: {
                border: "1px solid #f0291a",
              },
            }
          );
          setToggled(false);
        }, 200);
      }
    }
  }, [connectedAddress, connectWallet]);

  // select filter couter
  const [selectColorFilterCouter, setSelectColorFilterCouter] = useState(0);
  const [selectBuynowFilterCouter, setSelectBuynowFilterCouter] = useState(0);
  const [selectHexWordsFilterCouter, setSelectHexWordsBuynowFilterCouter] =
    useState(0);
  const [selectViewFilterCouter, setSelectViewBuynowFilterCouter] = useState(0);

  const [mainMobileFilterCounter, setMainMobileFilterCounter] = useState();

  useEffect(() => {
    setSelectBuynowFilterCouter(buyItNow && buyItNow ? 1 : 0);
    setSelectHexWordsBuynowFilterCouter(hexWords && hexWords ? 1 : 0);
    setSelectColorFilterCouter(
      selectedBaseColors.length > 0 ? selectedBaseColors.length : 0
    );
    setSelectViewBuynowFilterCouter(
      openedFilter.view && openedFilter.view ? 1 : 0
    );

    setMainMobileFilterCounter(
      selectColorFilterCouter +
        selectBuynowFilterCouter +
        selectHexWordsFilterCouter +
        selectViewFilterCouter
    );
  }, [selectedBaseColors, buyItNow, salesNfts, hexWords, openedFilter]);

  // Return ture if iOS
  const isiOS = function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lock screen scroll
  const lockScroll = React.useCallback(() => {
    document.body.dataset.scrollLock = "true";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "var(--scrollbar-compensation)";

    if (isiOS) {
      const scrollOffset = window.pageYOffset;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollOffset.current}px`;
      document.body.style.width = "100%";
    }
  }, []);

  // Unlock screen scroll
  const unlockScroll = React.useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    if (isiOS) {
      const scrollOffset = window.pageYOffset;

      document.body.style.position = "";
      document.body.style.top = ``;
      document.body.style.width = "";
      window.scrollTo(0, scrollOffset.current);
    }
    delete document.body.dataset.scrollLock;
  }, []);

  // Lock screen scroll if filter is opened
  useEffect(() => {
    if (openMobileFilter) lockScroll();
    if (!openMobileFilter) unlockScroll();
  }, [openMobileFilter]);

  // Set Activity tab index
  // sales: 0, bids: 1. asks: 2
  const [tabIndex, setTabIndex] = useState(0);
  const [type, setType] = useState("Sales");
  //
  //
  const [hexWords, setHexWords] = useState(false);
  const [hexWordsCount, setHexWordsCount] = useState(0);
  const [hexWordsArray, setHexWordsArray] = useState();
  useEffect(() => {
    if (allReceivedData) {
      const arr = [];
      allReceivedData.map((item) => {
        const handleWordHex = (item) => {
          const found = wordsHex.filter(
            (el) => el.hex.toLowerCase() === item.hex.toLowerCase()
          );
          if (found.length > 0) arr.push(item);
        };
        handleWordHex(item);
      });
      setHexWordsArray(arr);
    }
  }, [buyItNow, allReceivedData]);

  useEffect(() => {
    if (hexWordsArray) {
      let count = 0;
      hexWordsArray.map((item, index) => {
        if (buyItNow) {
          if (
            salesNfts &&
            salesNfts.includes(item.uint256.toString()) &&
            salesPrice[item.uint256] >= Number(rangeValue[0]) &&
            salesPrice[item.uint256] <= Number(rangeValue[1])
          )
            count++;
        } else count++;
      });

      setHexWordsCount(count);
    }
  }, [buyItNow, salesNfts, hexWordsArray]);

  useEffect(() => {
    handleSideReturn();
    handleBottomSideReturn();
  }, [openedFilter]);

  const dividedBy = isMobile ? 35 : 50;
  const containerWidthRef = useRef();
  const handleSide = () => {
    return (
      (containerWidthRef.current?.clientWidth -
        (containerWidthRef.current?.clientWidth % dividedBy)) /
      dividedBy /
      2
    );
  };

  const handleSideReturn = (number) => {
    const amount = Math.ceil(allReceivedData.length / (handleSide() * 2));
    for (let i = 0; i < amount * 2; i += 2) {
      if (
        number >= Math.ceil(handleSide() * i + 1) &&
        number <= Math.ceil(handleSide() * (i + 1))
      ) {
        return true;
      }
    }
  };
  const handleBottomSideReturn = (index) => {
    for (let i = 0; i < allReceivedData.length; i++) {
      if (
        allReceivedData.length -
          (containerWidthRef &&
            containerWidthRef.current?.clientWidth / dividedBy) *
            6 <
        index
      ) {
        return true;
      }
    }
  };

  useEffect(() => {
    if (
      search.includes("hex words") ||
      search.includes("hex word") ||
      search.includes("hexwords") ||
      search.includes("hexwords") ||
      search.includes("hex")
    ) {
      setHexWords(true);
    } else {
      setHexWords(false);
    }
  }, [search]);

  useEffect(() => {
    if (sessionStorage.getItem("forSale")) {
      setBuyItNow(sessionStorage.getItem("forSale") === "true" ? true : false);
    }
    if (sessionStorage.getItem("myPalette")) {
      setToggled(sessionStorage.getItem("myPalette") === "true" ? true : false);
    }
    if (sessionStorage.getItem("view")) {
      if (sessionStorage.getItem("view") === "cardSmall") {
        setView("card");
        setSmallCard(true);
      } else if (sessionStorage.getItem("view") === "cardLarge") {
        setView("card");
        setSmallCard(false);
      } else {
        setView("grid");
      }
    }
    if (sessionStorage.getItem("hexWord")) {
      setHexWords(sessionStorage.getItem("hexWord") === "true" ? true : false);
    }
    if (sessionStorage.getItem("value")) {
      setMinPercent(Number(sessionStorage.getItem("value").split("|")[0]));
      setMaxPercent(Number(sessionStorage.getItem("value").split("|")[1]));
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("categories")) {
      let arr = sessionStorage.getItem("categories").split(",");
      setFiltered(true);
      setSelectedBaseColors(arr);
    }
  }, []);

  useEffect(() => {
    if (selectedBaseColors.length > 0) {
      if (sessionStorage.getItem("categories")) {
        sessionStorage.removeItem("categories");
        sessionStorage.setItem("categories", selectedBaseColors);
      } else {
        sessionStorage.setItem("categories", selectedBaseColors);
      }
    }
  }, [selectedBaseColors]);
  //
  //
  useEffect(() => {
    if (sessionStorage.getItem("tabList")) {
      setTabIndex(
        sessionStorage.getItem("tabList") === "Sales"
          ? 0
          : sessionStorage.getItem("tabList") === "Bids"
          ? 1
          : 2
      );
    }
  }, []);

  return (
    <div
      className={`${styles.wrapperContainer} ${
        items ? styles.activityWrapperContainer : null
      }`}
    >
      {/* Left side filter pane */}
      {items && (
        <div className={styles.stickyFilter}>
          <div className={`${styles.filterForm}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveToDB();
              }}
            >
              <div className={styles.bsContainer}>
                <BsSearch className={styles.bsSearch} />
              </div>
              <input
                placeholder="Search by Name, Hex, Category, No., TokenID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {amountOfResults.length > 0 && (
                <div className={styles.formSerachLenght}>
                  {amountOfResults.length}{" "}
                  {amountOfResults.length > 1 ? "Results" : "Result"}
                </div>
              )}
            </form>
          </div>
          <div
            className={styles.stickyFilterContainer}
            style={{ width: !items ? "21vw" : "auto" }}
          >
            {items && (
              <div className={styles.containerContent}>
                <div className={styles.flexContent}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: ".6rem 0",
                    }}
                  >
                    For Sale
                    <div className={styles.forSaleAmount}>{salesNftsCount}</div>
                    <p className={styles.fontSizeSale}>
                      {allReceivedData &&
                        salesNfts &&
                        (
                          (100 * salesNfts.length) /
                          allReceivedData.length
                        ).toFixed(2)}
                      % listed
                    </p>
                  </h3>
                  <Switch
                    defaultChecked
                    checked={buyItNow}
                    onCheckedChange={() => {
                      setBuyItNow(!buyItNow);
                      sessionStorage.setItem("forSale", !buyItNow);
                    }}
                    id="s2"
                  >
                    <SwitchThumb />
                  </Switch>
                </div>
              </div>
            )}
            {items && (
              <div className={styles.containerContent}>
                <div className={styles.flexContent}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: ".6rem 0",
                      height: "50px",
                    }}
                  >
                    My Palette{" "}
                    <div className={styles.forSaleAmount}>
                      {nfts && nfts.length}
                    </div>
                  </h3>
                  <Switch
                    defaultChecked
                    checked={toggled}
                    onCheckedChange={() => {
                      if (connectedAddress === "") {
                        setToggled(true);
                        setConnectWallet(true);
                        setTimeout(() => {
                          // toast(
                          //   <div className={"toastComman"}>
                          //     No wallet connected.
                          //     <IoClose
                          //       size={25}
                          //       onClick={(t) => {
                          //         toast.dismiss(t.id);
                          //       }}
                          //     />
                          //   </div>,
                          //   {
                          //     style: {
                          //       border: "1px solid #f0291a",
                          //     },
                          //   }
                          // );
                          // setToggled(false);
                        }, 500);
                      } else if (!showToggle) {
                        setToggled(true);
                        setTimeout(() => {
                          toast(
                            <div className={"toastComman"}>
                              You do not own any colors.
                              <IoClose
                                size={25}
                                onClick={(t) => {
                                  toast.dismiss(t.id);
                                }}
                              />
                            </div>,
                            {
                              style: {
                                border: "1px solid #f0291a",
                              },
                            }
                          );
                          setToggled(false);
                        }, 200);
                      } else {
                        setToggled(!toggled);
                        sessionStorage.setItem("myPalette", !toggled);
                      }
                    }}
                    id="s1"
                  >
                    <SwitchThumb />
                  </Switch>
                </div>
              </div>
            )}
            {items && (
              <div className={styles.containerContent}>
                <div
                  className={styles.flexContent}
                  style={{
                    borderBottom: openedFilter.view
                      ? "1px solid #100f0f"
                      : null,
                  }}
                >
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
                  className={styles.gridContent}
                  style={{ display: openedFilter.view ? "block" : "none" }}
                >
                  <h4
                    onClick={() => {
                      setView("grid");
                      sessionStorage.setItem("view", "grid");
                    }}
                    className={`${view === "grid" && styles.activeTab}`}
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
                      sessionStorage.setItem("view", "cardLarge");
                    }}
                    className={`${
                      view === "card" && !smallCard && styles.activeTab
                    }`}
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
                      sessionStorage.setItem("view", "cardSmall");
                      setSmallCard(true);
                    }}
                    className={`${
                      view === "card" && smallCard && styles.activeTab
                    }`}
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
            )}
            {items && (
              <div className={styles.containerContent}>
                <div
                  className={styles.flexContent}
                  style={{
                    borderBottom: openedFilter.group
                      ? "1px solid #100f0f"
                      : null,
                  }}
                >
                  <h3>Category</h3>
                  {openedFilter.group ? (
                    <FiMinus
                      onClick={() =>
                        setOpenedFilter({
                          view: openedFilter.view,
                          group: false,
                          price: openedFilter.price,
                        })
                      }
                    />
                  ) : (
                    <BsPlusLg
                      onClick={() =>
                        setOpenedFilter({
                          view: openedFilter.view,
                          group: true,
                          price: openedFilter.price,
                        })
                      }
                    />
                  )}
                </div>
                <div
                  className={styles.gridContent}
                  style={{ display: openedFilter.group ? "block" : "none" }}
                >
                  <div className={styles.maxHeight}>
                    {" "}
                    <h4
                      onClick={() => {
                        if (hexWords && selectedBaseColors.length === 0)
                          setFiltered(false);
                        else setFiltered(true);
                        setHexWords(!hexWords);
                        sessionStorage.setItem("hexWord", !hexWords);
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = "#000";
                        e.target.style.color = "#fff";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = "#f4f4f4";
                        e.target.style.color = "#000";
                      }}
                      className={`${
                        hexWords ? styles.groupActive : styles.colorDivMain
                      }`}
                    >
                      Hex Words
                      {hexWords && (
                        <div className={styles.forSaleAmount}>
                          {hexWordsArray && hexWordsArray.length}
                        </div>
                      )}
                      {hexWords && (
                        <RiRadioButtonFill
                          style={{ margin: "0", fontSize: "1.2rem" }}
                          className={styles.dotIcon}
                        />
                      )}
                    </h4>
                    {baseColor &&
                      baseColor.map((item, index) => {
                        let amountOfColors = 0;
                        allReceivedData.map((i) => {
                          if (item === i.base_color_name) {
                            amountOfColors = amountOfColors += 1;
                          }
                        });
                        return (
                          <h4
                            key={index}
                            onClick={() => {
                              if (selectedBaseColors.includes(item)) {
                                setSelectedBaseColors((color) =>
                                  color.filter((i) => i !== item)
                                );
                              } else {
                                setSelectedBaseColors((prevState) => [
                                  ...prevState,
                                  item,
                                ]);
                              }
                              setFiltered(true);
                            }}
                            onMouseOver={(e) => {
                              if (item === "black") {
                                e.target.style.color = "#fff";
                              } else if (item === "white") {
                                e.target.style.color = "#000";
                              }
                              e.target.style.background = item;
                            }}
                            onMouseOut={(e) => {
                              if (item === "black") {
                                e.target.style.color = "#000";
                              } else if (item === "white") {
                                e.target.style.color = "#000";
                              }
                              e.target.style.background = "#f4f4f4";
                            }}
                            className={`${
                              selectedBaseColors.includes(item)
                                ? styles.groupActive
                                : styles.colorDivMain
                            }`}
                          >
                            {item}
                            {selectedBaseColors.includes(item) && (
                              <div className={styles.forSaleAmount}>
                                {amountOfColors}
                              </div>
                            )}
                            {selectedBaseColors.includes(item) && (
                              <RiRadioButtonFill
                                style={{ margin: "0", fontSize: "1.2rem" }}
                                className={styles.dotIcon}
                              />
                            )}
                          </h4>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
            {items && (
              <div className={styles.containerContent}>
                <div
                  className={styles.flexContent}
                  style={{
                    borderBottom: openedFilter.price
                      ? "1px solid #100f0f"
                      : null,
                  }}
                >
                  <h3>Price</h3>
                  {openedFilter.price ? (
                    <FiMinus
                      onClick={() =>
                        setOpenedFilter({
                          view: openedFilter.view,
                          group: openedFilter.group,
                          price: false,
                        })
                      }
                    />
                  ) : (
                    <BsPlusLg
                      onClick={() =>
                        setOpenedFilter({
                          view: openedFilter.view,
                          group: openedFilter.group,
                          price: true,
                        })
                      }
                    />
                  )}
                </div>
                <div
                  className={styles.gridContent}
                  style={{ display: openedFilter.price ? "block" : "none" }}
                >
                  <h4
                    style={{ display: "grid" }}
                    className={styles.styledSlider}
                  >
                    <div
                      className={styles.demoSlider}
                      style={{ margin: "20px 0" }}
                    >
                      <StyledSlider
                        defaultValue={[0, 100]}
                        step={20}
                        value={[minPercent, maxPercent]}
                        onValueChange={(value) => {
                          setMinPercent(value[0]);
                          setMaxPercent(value[1]);
                          const difference = maxValue - minValue;
                          var tempMinValue;
                          var tempMaxValue;
                          if (value[0] == 0) tempMinValue = minValue;
                          else
                            tempMinValue =
                              minValue + (difference * value[0]) / 100;
                          if (value[1] == 100) tempMaxValue = maxValue;
                          else
                            tempMaxValue =
                              minValue + (difference * value[1]) / 100;
                          setRangeValue([tempMinValue, tempMaxValue]);
                        }}
                      >
                        <StyledTrack>
                          <StyledRange
                            style={{
                              outline:
                                rangeValue[0].toFixed(2) ===
                                  minValue.toFixed(2) && "none",
                              borderRadius:
                                rangeValue[1].toFixed(2) ===
                                  maxValue.toFixed(2) && "20px",
                            }}
                          />
                        </StyledTrack>
                        {rangeValue.map((_, i) => (
                          <StyledThumb>
                            <div className={styles.textToggle}>
                              {rangeValue[0] === rangeValue[1] ? (
                                <h2 className={styles.thumbTextTopLeft}>
                                  {rangeValue[0] ? rangeValue[0].toFixed(2) : 0}{" "}
                                  ETH
                                </h2>
                              ) : i === 0 ? (
                                <h2 className={styles.thumbTextTopLeft}>
                                  {rangeValue[0] ? rangeValue[0].toFixed(2) : 0}{" "}
                                  ETH
                                </h2>
                              ) : (
                                <h2 className={styles.thumbTextTopRight}>
                                  {rangeValue[1] ? rangeValue[1].toFixed(2) : 0}{" "}
                                  ETH
                                </h2>
                              )}
                            </div>
                            <div className={styles.thumb} />
                            <h1 className={styles.thumbText}>
                              {rangeValue[0] === rangeValue[1] ? (
                                // 'equal'
                                <GoTriangleUp size={15} />
                              ) : i === 0 ? (
                                "MIN"
                              ) : (
                                "MAX"
                              )}
                            </h1>
                          </StyledThumb>
                        ))}
                      </StyledSlider>
                    </div>
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Show Items tab or Activity tab */}
      {items ? (
        // This is Items Panel
        view === "list" ? (
          baseColor ? (
            <div style={{ width: "auto" }}>
              {selectedBaseColors.length > 0 ? (
                baseColor.map((item, index) => {
                  if (selectedBaseColors.includes(item)) {
                    let arr = [];
                    // eslint-disable-next-line
                    allReceivedData.map((data) => {
                      if (data.base_color_name === item) {
                        arr.push(data);
                      }
                    });
                    const dataContent = [];
                    // eslint-disable-next-line
                    arr.map((i, index) => {
                      if (
                        (search !== "" &&
                          i.hex
                            .toLowerCase()
                            .startsWith(search.toLowerCase())) ||
                        i.name.toLowerCase().includes(search.toLowerCase()) ||
                        i.nftNo.toString().startsWith(search) ||
                        i.base_color_name
                          .toLowerCase()
                          .startsWith(search.toLowerCase()) ||
                        i.uint256.toString().startsWith(search)
                      ) {
                        if (
                          (toggled && nfts.includes(i.uint256.toString())) ||
                          !toggled
                        ) {
                          dataContent.push({
                            id: index,
                            color: (
                              <Link
                                href={`/gallery/color-nft/${i.uint256}`}
                                passHref
                              >
                                <div
                                  className={stylesSecond.square}
                                  style={{
                                    border:
                                      item === "black" && "1px solid #fff",
                                    background: i.hex,
                                  }}
                                />
                              </Link>
                            ),
                            name: <div>{i.name}</div>,
                            hexadecimal: (
                              <Link href={`/gallery/color-nft/${i.uint256}`}>
                                <a
                                  style={{
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    color: "#fff",
                                  }}
                                >
                                  {i.hex}
                                </a>
                              </Link>
                            ),
                            tokenID: <div>{i.uint256}</div>,
                            nftnumber: <div>{i.nftNo}</div>,
                            lastprice: (
                              <div className={stylesSecond.priceShowed}>
                                <Link
                                  href={`/gallery/color-nft/${i.uint256}`}
                                  passHref
                                >
                                  <div>
                                    <span>
                                      {i.price_in_eth
                                        ? i.price_in_eth.toFixed(3)
                                        : null}{" "}
                                      ETH{" "}
                                    </span>
                                    &nbsp; {i?.price_in_usd && "$"}{" "}
                                    {i?.price_in_usd?.toFixed(2)}
                                  </div>
                                </Link>
                              </div>
                            ),
                          });
                        }
                      }
                    });
                    return (
                      <div
                        className={stylesSecond.dataTableContainer}
                        key={index}
                        style={{ width: "auto" }}
                      >
                        <div className={stylesSecond.layout}>
                          <h1>{item}</h1>
                          <h2>
                            {dataContent.length}{" "}
                            {dataContent.length > 1 ? "Shades" : "Shade"}
                          </h2>
                        </div>
                        {amountOfResults.length === 0 && search !== "" && (
                          <h1
                            style={{ color: "#fff" }}
                            className={styles.descHeader}
                          >
                            No results found.
                          </h1>
                        )}
                        <DataTable
                          columns={columns}
                          data={dataContent}
                          customStyles={customStyles}
                          pointerOnHover={true}
                          onRowClicked={(row) => {
                            history.push(
                              `/gallery/color-nft/${row.tokenID.props.children}`
                            );
                          }}
                        />
                      </div>
                    );
                  }
                })
              ) : (
                <div className={styles.boxListDiv}>
                  {amountOfResults.length === 0 && search !== "" && (
                    <h1
                      style={{ color: "#fff", marginLeft: "0" }}
                      className={styles.descHeader}
                    >
                      No results found.
                    </h1>
                  )}
                  {baseColor
                    .slice(0, toggled ? baseColor.length : amountShowedList)
                    .map((item, index) => {
                      let arr = [];
                      // eslint-disable-next-line
                      allReceivedData.map((data) => {
                        if (data.base_color_name === item) {
                          arr.push(data);
                        }
                      });
                      const dataContent = [];
                      // eslint-disable-next-line
                      arr.map((i, index) => {
                        if (
                          (search !== "" &&
                            i.hex
                              .toLowerCase()
                              .startsWith(search.toLowerCase())) ||
                          i.name.toLowerCase().includes(search.toLowerCase()) ||
                          i.nftNo.toString().startsWith(search) ||
                          i.base_color_name
                            .toLowerCase()
                            .startsWith(search.toLowerCase()) ||
                          i.uint256.toString().startsWith(search)
                        ) {
                          if (
                            (toggled && nfts.includes(i.uint256.toString())) ||
                            !toggled
                          ) {
                            dataContent.push({
                              id: index,
                              color: (
                                <Link
                                  href={`/gallery/color-nft/${i.uint256}`}
                                  passHref
                                >
                                  <div
                                    className={stylesSecond.square}
                                    style={{
                                      border:
                                        item === "black" && "1px solid #fff",
                                      background: i.hex,
                                    }}
                                  />
                                </Link>
                              ),
                              name: <div>{i.name}</div>,
                              hexadecimal: (
                                <Link href={`/gallery/color-nft/${i.uint256}`}>
                                  <a
                                    style={{
                                      textTransform: "uppercase",
                                      textDecoration: "none",
                                      color: "#fff",
                                    }}
                                  >
                                    {i.hex}
                                  </a>
                                </Link>
                              ),
                              tokenID: <div>{i.uint256}</div>,
                              nftnumber: <div>{i.nftNo}</div>,
                              lastprice: (
                                <div className={stylesSecond.priceShowed}>
                                  <Link
                                    href={`/gallery/color-nft/${i.uint256}`}
                                    passHref
                                  >
                                    <div>
                                      <span>
                                        {i.price_in_eth
                                          ? i.price_in_eth.toFixed(3)
                                          : null}{" "}
                                        ETH{" "}
                                      </span>
                                      &nbsp; {i?.price_in_usd && "$"}{" "}
                                      {i?.price_in_usd?.toFixed(2)}
                                    </div>
                                  </Link>
                                </div>
                              ),
                            });
                          }
                        }
                      });
                      return (
                        <div
                          className={stylesSecond.dataTableContainer}
                          key={index}
                          style={{ width: "auto" }}
                        >
                          {dataContent.length > 0 && (
                            <>
                              <div className={stylesSecond.layout}>
                                <h1>{item}</h1>
                                <h2>
                                  {dataContent.length}{" "}
                                  {dataContent.length > 1 ? "Shades" : "Shade"}
                                </h2>
                              </div>
                              {amountOfResults.length === 0 && search !== "" && (
                                <h1
                                  style={{ color: "#fff" }}
                                  className={styles.descHeader}
                                >
                                  No results found.
                                </h1>
                              )}
                              <DataTable
                                columns={columns}
                                data={dataContent}
                                customStyles={customStyles}
                                pointerOnHover={true}
                                onRowClicked={(row) => {
                                  history.push(
                                    `/gallery/color-nft/${row.tokenID.props.children}`
                                  );
                                }}
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  {amountOfResults.length !== 0 && !toggled && (
                    <div className={stylesSecond.loadMoreContainer}>
                      <div
                        onClick={() => {
                          setAmountShowed((amountShowed) => amountShowed + 2);
                        }}
                      >
                        <BiExpand />
                        Load More
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null
        ) : view === "grid" && baseColor ? (
          filtered ? (
            selectedBaseColors.length > 0 || hexWords ? (
              <div className={styles.filteredMore}>
                <div
                  style={{
                    display: filtered ? "flex" : "none",
                    paddingBottom: filtered ? "20px 0" : "0",
                    overflowY: filtered ? "auto" : "hidden",
                    width: filtered && "100%",
                  }}
                  className={stylesSelected.filteredContainer}
                >
                  <button
                    className={stylesSelected.buttonFilter}
                    onClick={() => {
                      setSelectedBaseColors([]);
                      setHexWords(false);
                      setFiltered(false);
                      if (
                        sessionStorage.getItem("categories") ||
                        sessionStorage.getItem("hexWord")
                      )
                        sessionStorage.removeItem("categories");
                      sessionStorage.removeItem("hexWord");
                    }}
                  >
                    clear all filters{" "}
                    <IoMdClose
                      onClick={() => {
                        setSelectedBaseColors([]);
                        setHexWords(false);
                        setFiltered(false);
                      }}
                    />
                  </button>
                  {selectedBaseColors.length > 0 &&
                    selectedBaseColors.map((item, index) => {
                      return (
                        <button
                          className={stylesSelected.buttonWhite}
                          key={index}
                        >
                          {item}
                          <IoMdClose
                            onClick={() => {
                              if (selectedBaseColors.length === 1) {
                                // setFiltered(false);
                                // setHexWords(false);
                                setSelectedBaseColors([]);
                              }
                              if (
                                selectedBaseColors.length === 1 &&
                                !hexWords
                              ) {
                                setFiltered(false);
                                setSelectedBaseColors([]);
                              }
                              if (selectedBaseColors.length === 1) {
                                setSelectedBaseColors([]);
                              } else {
                                setSelectedBaseColors((color) =>
                                  color.filter((i) => i !== item)
                                );
                              }
                            }}
                          />
                        </button>
                      );
                    })}
                  {hexWords && (
                    <button className={stylesSelected.buttonWhite}>
                      Hex Words
                      <IoMdClose
                        onClick={() => {
                          if (hexWords) {
                            setHexWords(false);
                            if (selectedBaseColors.length === 0) {
                              setFiltered(false);
                            }
                          }
                        }}
                      />
                    </button>
                  )}
                </div>
                {hexWordsCount > 0 && hexWords && (
                  <div className={stylesSecond.dataTableContainer}>
                    {hexWordsCount > 0 && (
                      <div className={stylesSecond.layout}>
                        <h1>Hex Words</h1>
                        <h2>
                          {hexWordsArray && hexWordsCount}&nbsp;
                          {hexWordsArray && hexWordsCount > 1
                            ? "Shades"
                            : "Shade"}
                        </h2>
                      </div>
                    )}
                    <div
                      className={stylesSecond.mainGrid}
                      ref={containerWidthRef}
                    >
                      {hexWordsArray &&
                        hexWordsArray.map((item, index) => {
                          if (buyItNow) {
                            if (
                              salesNfts &&
                              salesNfts.includes(item.uint256.toString()) &&
                              salesPrice[item.uint256] >=
                                Number(rangeValue[0]) &&
                              salesPrice[item.uint256] <= Number(rangeValue[1])
                            ) {
                              return (
                                <>
                                  <Link
                                    href={`/gallery/color-nft/${item.uint256}`}
                                    key={index}
                                  >
                                    <a
                                      className={stylesSecond.gridItem}
                                      style={{ background: item.hex }}
                                      onMouseEnter={() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                      }}
                                      onMouseLeave={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                      }}
                                    >
                                      <NFTCardContainerOnHover
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        handleShow={handleShow}
                                        showOnLeft={handleSideReturn(index + 1)}
                                        showOnBottom={false}
                                        price={item.price_in_eth}
                                        onSale={false}
                                      />
                                    </a>
                                  </Link>
                                </>
                              );
                            }
                          } else
                            return (
                              <>
                                <Link
                                  href={`/gallery/color-nft/${item.uint256}`}
                                  key={index}
                                >
                                  <a
                                    className={stylesSecond.gridItem}
                                    style={{ background: item.hex }}
                                    onMouseEnter={() => {
                                      handleShow();
                                      setDisplayCard(true);
                                      setCardId(item.name + item.hex.slice(1));
                                    }}
                                    onMouseLeave={() => {
                                      setDisplayCard(false);
                                      setCardId("");
                                    }}
                                  >
                                    <NFTCardContainerOnHover
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      handleShow={handleShow}
                                      showOnLeft={handleSideReturn(index + 1)}
                                      showOnBottom={handleBottomSideReturn(
                                        index
                                      )}
                                      price={item.price_in_eth}
                                      onSale={false}
                                    />
                                  </a>
                                </Link>
                              </>
                            );
                        })}
                    </div>
                  </div>
                )}
                {selectedBaseColors.map((item, index) => {
                  let arr = [];
                  // eslint-disable-next-line
                  allReceivedData.map((data) => {
                    if (data.base_color_name === item) {
                      arr.push(data);
                    }
                  });
                  let containsColor = [];
                  arr.map((item) => {
                    if (buyItNow) {
                      if (
                        salesNfts &&
                        salesNfts.includes(item.uint256.toString()) &&
                        salesPrice[item.uint256] >= Number(rangeValue[0]) &&
                        salesPrice[item.uint256] <= Number(rangeValue[1])
                      ) {
                        containsColor.push(item);
                      }
                    } else if (
                      item.price_in_eth.toFixed(2) >=
                        Number(rangeValue[0]).toFixed(2) &&
                      item.price_in_eth.toFixed(2) <=
                        Number(rangeValue[1]).toFixed(2)
                    ) {
                      containsColor.push(item);
                    }
                  });
                  return (
                    <div
                      className={stylesSecond.dataTableContainer}
                      key={index}
                      ref={refOverflow}
                      style={{ width: "100%" }}
                    >
                      {containsColor.length > 0 && (
                        <div className={stylesSecond.layout}>
                          <h1>{item}</h1>
                          <h2>
                            {containsColor.length}&nbsp;
                            {containsColor.length > 1 ? "Shades" : "Shade"}
                          </h2>
                        </div>
                      )}
                      {amountOfResults.length === 0 && search !== "" && (
                        <h1
                          style={{ color: "#fff", marginLeft: "0" }}
                          className={styles.descHeader}
                        >
                          No results found.
                        </h1>
                      )}
                      {containsColor.length > 0 && (
                        <article
                          className={stylesSecond.mainGrid}
                          style={{ minHeight: "5vh" }}
                        >
                          {arr.map((item, index) => {
                            const color = `rgb(${
                              hexRgb(item.hex, { format: "css" })[0]
                            }, ${hexRgb(item.hex, { format: "css" })[1]}, ${
                              hexRgb(item.hex, { format: "css" })[2]
                            })`;
                            if (buyItNow) {
                              if (
                                salesPrice[item.uint256] >=
                                  Number(rangeValue[0]) &&
                                salesPrice[item.uint256] <=
                                  Number(rangeValue[1])
                              ) {
                                if (
                                  nfts.includes(item.uint256.toString()) &&
                                  toggled &&
                                  !buyItNow
                                ) {
                                  return (
                                    <Link
                                      href={`/gallery/color-nft/${item.uint256}`}
                                      key={index}
                                    >
                                      <a
                                        className={stylesSecond.gridItem}
                                        style={{ background: color }}
                                        onMouseEnter={() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                        }}
                                        onMouseLeave={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                        }}
                                        onTouchStart={() => {
                                          setTimeout(() => {
                                            handleShow();
                                            setDisplayCard(true);
                                            setCardId(
                                              item.name + item.hex.slice(1)
                                            );
                                            changeOpacityAmount(item.uint256);
                                          }, 300);
                                        }}
                                        onTouchEnd={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                        onTouchEndCapture={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                      >
                                        <NFTCardContainerOnHover
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          handleShow={handleShow}
                                          showOnLeft={showOnLeft}
                                          price={item.price_in_eth}
                                          onSale={false}
                                        />
                                      </a>
                                    </Link>
                                  );
                                } else if (!toggled || !showToggle) {
                                  return (
                                    <Link
                                      href={`/gallery/color-nft/${item.uint256}`}
                                      key={index}
                                    >
                                      <a
                                        className={stylesSecond.gridItem}
                                        style={{ background: color }}
                                        onMouseEnter={() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                        }}
                                        onMouseLeave={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                        }}
                                        onTouchStart={() => {
                                          setTimeout(() => {
                                            handleShow();
                                            setDisplayCard(true);
                                            setCardId(
                                              item.name + item.hex.slice(1)
                                            );
                                            changeOpacityAmount(item.uint256);
                                          }, 300);
                                        }}
                                        onTouchEnd={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                        onTouchEndCapture={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                      >
                                        <NFTCardContainerOnHover
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          handleShow={handleShow}
                                          showOnLeft={showOnLeft}
                                          expiry={salesExpiry[item.uint256]}
                                          price={salesRealPrice[item.uint256]}
                                          onSale={true}
                                        />
                                      </a>
                                    </Link>
                                  );
                                } else if (
                                  salesNfts &&
                                  salesNfts.includes(item.uint256.toString()) &&
                                  buyItNow &&
                                  !toggled
                                ) {
                                  return (
                                    <>
                                      <Link
                                        href={`/gallery/color-nft/${item.uint256}`}
                                        key={index}
                                      >
                                        <a
                                          className={stylesSecond.gridItem}
                                          style={{ background: color }}
                                          onMouseEnter={() => {
                                            handleShow();
                                            setDisplayCard(true);
                                            setCardId(
                                              item.name + item.hex.slice(1)
                                            );
                                          }}
                                          onMouseLeave={() => {
                                            setDisplayCard(false);
                                            setCardId("");
                                          }}
                                        >
                                          <NFTCardContainerOnHover
                                            id={item.uint256}
                                            color={item.hex}
                                            name={item.name}
                                            number={item.nftNo}
                                            displayCard={displayCard}
                                            cardId={cardId}
                                            handleShow={handleShow}
                                            showOnLeft={handleSideReturn(
                                              salesNfts.indexOf(
                                                item.uint256.toString()
                                              ) + 1
                                            )}
                                            showOnBottom={false}
                                            expiry={salesExpiry[item.uint256]}
                                            onSale={true}
                                            price={salesPrice[item.uint256]}
                                          />
                                        </a>
                                      </Link>
                                    </>
                                  );
                                } else if (
                                  salesNfts &&
                                  salesNfts.includes(item.uint256.toString()) &&
                                  buyItNow &&
                                  nfts.includes(item.uint256.toString()) &&
                                  toggled
                                ) {
                                  return (
                                    <>
                                      <Link
                                        href={`/gallery/color-nft/${item.uint256}`}
                                        key={index}
                                      >
                                        <a
                                          className={stylesSecond.gridItem}
                                          style={{ background: color }}
                                          onMouseEnter={() => {
                                            handleShow();
                                            setDisplayCard(true);
                                            setCardId(
                                              item.name + item.hex.slice(1)
                                            );
                                          }}
                                          onMouseLeave={() => {
                                            setDisplayCard(false);
                                            setCardId("");
                                          }}
                                        >
                                          <NFTCardContainerOnHover
                                            id={item.uint256}
                                            color={item.hex}
                                            name={item.name}
                                            number={item.nftNo}
                                            displayCard={displayCard}
                                            cardId={cardId}
                                            handleShow={handleShow}
                                            showOnLeft={handleSideReturn(
                                              salesNfts.indexOf(
                                                item.uint256.toString()
                                              ) + 1
                                            )}
                                            showOnBottom={handleBottomSideReturn(
                                              index
                                            )}
                                            expiry={salesExpiry[item.uint256]}
                                            onSale={true}
                                            price={salesPrice[item.uint256]}
                                          />
                                        </a>
                                      </Link>
                                    </>
                                  );
                                } else {
                                  return (
                                    <Link
                                      href={`/gallery/color-nft/${item.uint256}`}
                                      key={index}
                                    >
                                      <a
                                        className={stylesSecond.gridItem}
                                        style={{
                                          background: color,
                                          opacity:
                                            nfts.includes(
                                              item.uint256.toString()
                                            ) ||
                                            selectCardIdOnHover == item.uint256
                                              ? "1"
                                              : opacityAmount,
                                        }}
                                        onMouseEnter={() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                          changeOpacityAmount(item.uint256);
                                        }}
                                        onMouseLeave={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                        onTouchStart={() => {
                                          setTimeout(() => {
                                            handleShow();
                                            setDisplayCard(true);
                                            setCardId(
                                              item.name + item.hex.slice(1)
                                            );
                                            changeOpacityAmount(item.uint256);
                                          }, 300);
                                        }}
                                        onTouchEnd={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                        onTouchEndCapture={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                          changeOpacityAmount(null);
                                        }}
                                      >
                                        <NFTCardContainerOnHover
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          handleShow={handleShow}
                                          showOnLeft={showOnLeft}
                                          price={item.price_in_eth}
                                          onSale={false}
                                        />
                                      </a>
                                    </Link>
                                  );
                                }
                              }
                            } else if (
                              item.price_in_eth.toFixed(2) >=
                                Number(rangeValue[0]).toFixed(2) &&
                              item.price_in_eth.toFixed(2) <=
                                Number(rangeValue[1]).toFixed(2)
                            ) {
                              if (
                                nfts.includes(item.uint256.toString()) &&
                                toggled &&
                                !buyItNow
                              ) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.uint256}`}
                                    key={index}
                                  >
                                    <a
                                      className={stylesSecond.gridItem}
                                      style={{ background: color }}
                                      onMouseEnter={() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                      }}
                                      onMouseLeave={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                      }}
                                      onTouchStart={() => {
                                        setTimeout(() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                          changeOpacityAmount(item.uint256);
                                        }, 300);
                                      }}
                                      onTouchEnd={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                      onTouchEndCapture={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                    >
                                      <NFTCardContainerOnHover
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        handleShow={handleShow}
                                        showOnLeft={showOnLeft}
                                        price={item.price_in_eth}
                                        onSale={false}
                                      />
                                    </a>
                                  </Link>
                                );
                              } else if (!toggled || !showToggle) {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.uint256}`}
                                    key={index}
                                  >
                                    <a
                                      className={stylesSecond.gridItem}
                                      style={{ background: color }}
                                      onMouseEnter={() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                      }}
                                      onMouseLeave={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                      }}
                                      onTouchStart={() => {
                                        setTimeout(() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                          changeOpacityAmount(item.uint256);
                                        }, 300);
                                      }}
                                      onTouchEnd={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                      onTouchEndCapture={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                    >
                                      <NFTCardContainerOnHover
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        handleShow={handleShow}
                                        showOnLeft={showOnLeft}
                                        price={item.price_in_eth}
                                        onSale={false}
                                      />
                                    </a>
                                  </Link>
                                );
                              } else if (
                                salesNfts &&
                                salesNfts.includes(item.uint256.toString()) &&
                                buyItNow &&
                                !toggled
                              ) {
                                return (
                                  <>
                                    <Link
                                      href={`/gallery/color-nft/${item.uint256}`}
                                      key={index}
                                    >
                                      <a
                                        className={stylesSecond.gridItem}
                                        style={{ background: color }}
                                        onMouseEnter={() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                        }}
                                        onMouseLeave={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                        }}
                                      >
                                        <NFTCardContainerOnHover
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          handleShow={handleShow}
                                          showOnLeft={handleSideReturn(
                                            salesNfts.indexOf(
                                              item.uint256.toString()
                                            ) + 1
                                          )}
                                          showOnBottom={handleBottomSideReturn(
                                            index
                                          )}
                                          expiry={salesExpiry[item.uint256]}
                                          onSale={true}
                                          price={salesPrice[item.uint256]}
                                        />
                                      </a>
                                    </Link>
                                  </>
                                );
                              } else if (
                                salesNfts &&
                                salesNfts.includes(item.uint256.toString()) &&
                                buyItNow &&
                                nfts.includes(item.uint256.toString()) &&
                                toggled
                              ) {
                                return (
                                  <>
                                    <Link
                                      href={`/gallery/color-nft/${item.uint256}`}
                                      key={index}
                                    >
                                      <a
                                        className={stylesSecond.gridItem}
                                        style={{ background: color }}
                                        onMouseEnter={() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                        }}
                                        onMouseLeave={() => {
                                          setDisplayCard(false);
                                          setCardId("");
                                        }}
                                      >
                                        <NFTCardContainerOnHover
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          handleShow={handleShow}
                                          showOnLeft={handleSideReturn(
                                            salesNfts.indexOf(
                                              item.uint256.toString()
                                            ) + 1
                                          )}
                                          showOnBottom={handleBottomSideReturn(
                                            index
                                          )}
                                          expiry={salesExpiry[item.uint256]}
                                          onSale={true}
                                          price={salesPrice[item.uint256]}
                                        />
                                      </a>
                                    </Link>
                                  </>
                                );
                              } else {
                                return (
                                  <Link
                                    href={`/gallery/color-nft/${item.uint256}`}
                                    key={index}
                                  >
                                    <a
                                      className={stylesSecond.gridItem}
                                      style={{
                                        background: color,
                                        opacity:
                                          nfts.includes(
                                            item.uint256.toString()
                                          ) ||
                                          selectCardIdOnHover == item.uint256
                                            ? "1"
                                            : opacityAmount,
                                      }}
                                      onMouseEnter={() => {
                                        handleShow();
                                        setDisplayCard(true);
                                        setCardId(
                                          item.name + item.hex.slice(1)
                                        );
                                        changeOpacityAmount(item.uint256);
                                      }}
                                      onMouseLeave={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                      onTouchStart={() => {
                                        setTimeout(() => {
                                          handleShow();
                                          setDisplayCard(true);
                                          setCardId(
                                            item.name + item.hex.slice(1)
                                          );
                                          changeOpacityAmount(item.uint256);
                                        }, 300);
                                      }}
                                      onTouchEnd={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                      onTouchEndCapture={() => {
                                        setDisplayCard(false);
                                        setCardId("");
                                        changeOpacityAmount(null);
                                      }}
                                    >
                                      <NFTCardContainerOnHover
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        handleShow={handleShow}
                                        showOnLeft={showOnLeft}
                                        price={item.price_in_eth}
                                        onSale={false}
                                      />
                                    </a>
                                  </Link>
                                );
                              }
                            }
                          })}
                        </article>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null
          ) : (
            <GridAllColors
              displayCard={displayCard}
              cardId={cardId}
              setDisplayCard={setDisplayCard}
              setCardId={setCardId}
              refOverflow={refOverflow}
              handleShow={handleShow}
              showOnLeft={showOnLeft}
              changeOpacityAmount={changeOpacityAmount}
              selectCardIdOnHover={selectCardIdOnHover}
              nfts={nfts}
              opacityAmount={opacityAmount}
              walletAddress={connectedAddress}
              toggled={toggled}
              showToggle={showToggle}
              setToggled={setToggled}
              search={search}
              value={value}
              amountOfResults={amountOfResults}
              salesPrice={salesPrice}
              salesRealPrice={salesRealPrice}
              salesNfts={salesNfts}
              salesNftsData={salesNftsData}
              salesExpiry={salesExpiry}
              buyItNow={buyItNow}
              minValue={minValue}
              rangeValue={rangeValue}
            />
          )
        ) : view === "card" && (selectedBaseColors.length > 0 || hexWords) ? (
          // If there is selected base color in small card view
          <div className={styles.filteredMore}>
            <div
              style={{
                display: filtered ? "flex" : "none",
                paddingBottom: filtered ? "20px 0" : "0",
                overflowY: filtered ? "auto" : "hidden",
                width: filtered && "100%",
              }}
              className={stylesSelected.filteredContainer}
            >
              <button
                className={stylesSelected.buttonFilter}
                onClick={() => {
                  setHexWords(false);
                  setSelectedBaseColors([]);
                  setFiltered(false);
                  if (
                    sessionStorage.getItem("categories") ||
                    sessionStorage.getItem("hexWord")
                  )
                    sessionStorage.removeItem("categories");
                  sessionStorage.removeItem("hexWord");
                }}
              >
                clear all filters
                <IoMdClose
                  onClick={() => {
                    setSelectedBaseColors([]);
                    setFiltered(false);
                    setHexWords(false);
                  }}
                />
              </button>
              {selectedBaseColors.length > 0 &&
                selectedBaseColors.map((item, index) => {
                  return (
                    <button className={stylesSelected.buttonWhite} key={index}>
                      {item}
                      <IoMdClose
                        onClick={() => {
                          if (selectedBaseColors.length === 1) {
                            setSelectedBaseColors([]);
                            // setFiltered(false);
                          } else {
                            setSelectedBaseColors((color) =>
                              color.filter((i) => i !== item)
                            );
                          }
                        }}
                      />
                    </button>
                  );
                })}
              {hexWords && (
                <button className={stylesSelected.buttonWhite}>
                  Hex Words
                  <IoMdClose
                    onClick={() => {
                      if (hexWords) {
                        setHexWords(false);
                      }
                    }}
                  />
                </button>
              )}
            </div>
            {amountOfResults.length === 0 && search !== "" && !hexWords && (
              <h1 style={{ color: "#fff" }} className={styles.descHeader}>
                No results found.
              </h1>
            )}

            {hexWordsCount > 0 && hexWords && (
              <>
                <div
                  className={stylesSecond.dataTableContainer}
                  style={{ width: "100%" }}
                >
                  <div className={stylesSecond.layout}>
                    <h1>Hex Words</h1>
                    <h2>
                      {hexWordsArray && hexWordsCount}&nbsp;
                      {hexWordsArray && hexWordsCount > 1 ? "Shades" : "Shade"}
                    </h2>
                  </div>
                  <div
                    className={
                      !smallCard
                        ? stylesSale.colorBoxView
                        : stylesSale.colorBoxViewSmall
                    }
                    style={{ minHeight: "5vh", paddingLeft: "0" }}
                  >
                    {hexWordsArray &&
                      hexWordsArray.map((item, index) => {
                        if (buyItNow) {
                          if (
                            salesPrice[item.uint256] >= Number(rangeValue[0]) &&
                            salesPrice[item.uint256] <= Number(rangeValue[1])
                          )
                            return (
                              <div className={stylesSale.mainBox} key={index}>
                                <div className={stylesSale.colorBox}>
                                  <NFTCardContainer
                                    id={item.uint256}
                                    color={item.hex}
                                    name={item.name}
                                    number={item.nftNo}
                                    displayCard={displayCard}
                                    cardId={cardId}
                                    buyItNow={buyItNow}
                                    expiry={salesExpiry[item.uint256]}
                                    price={salesRealPrice[item.uint256]}
                                    onSale={true}
                                  />
                                </div>
                              </div>
                            );
                        } else if (
                          item.price_in_eth.toFixed(2) >=
                            Number(rangeValue[0]).toFixed(2) &&
                          item.price_in_eth.toFixed(2) <=
                            Number(rangeValue[1]).toFixed(2)
                        )
                          return (
                            <div className={stylesSale.mainBox} key={index}>
                              <div className={stylesSale.colorBox}>
                                <NFTCardContainer
                                  id={item.uint256}
                                  color={item.hex}
                                  name={item.name}
                                  number={item.nftNo}
                                  displayCard={displayCard}
                                  cardId={cardId}
                                  buyItNow={buyItNow}
                                  price={item.price_in_eth.toFixed(2)}
                                />
                              </div>
                            </div>
                          );
                      })}
                  </div>
                </div>
              </>
            )}
            {selectedBaseColors.map((item, index) => {
              let arr = [];
              // eslint-disable-next-line
              allReceivedData.map((data) => {
                if (data.base_color_name === item) {
                  arr.push(data);
                }
              });
              let containsColor = [];
              arr.map((item) => {
                if (buyItNow) {
                  if (
                    salesPrice[item.uint256] >= Number(rangeValue[0]) &&
                    salesPrice[item.uint256] <= Number(rangeValue[1])
                  ) {
                    containsColor.push(item);
                  }
                } else {
                  if (
                    item.price_in_eth.toFixed(2) >=
                      Number(rangeValue[0]).toFixed(2) &&
                    item.price_in_eth.toFixed(2) <=
                      Number(rangeValue[1]).toFixed(2)
                  ) {
                    containsColor.push(item);
                  }
                }
              });
              return (
                <>
                  <div
                    className={stylesSecond.dataTableContainer}
                    key={index}
                    ref={refOverflow}
                    style={{ width: "100%" }}
                  >
                    {containsColor.length > 0 && (
                      <div className={stylesSecond.layout}>
                        <h1>{item}</h1>
                        <h2>
                          {containsColor.length}&nbsp;
                          {containsColor.length > 1 ? "Shades" : "Shade"}
                        </h2>
                      </div>
                    )}
                    <article
                      className={
                        !smallCard
                          ? stylesSale.colorBoxView
                          : stylesSale.colorBoxViewSmall
                      }
                      style={{
                        minHeight: containsColor.length > 0 ? "5vh" : 0,
                        paddingLeft: "0",
                      }}
                    >
                      {containsColor.map((item, index) => {
                        if (nfts.includes(item.uint256.toString()) && toggled) {
                          return (
                            <>
                              <div className={stylesSale.mainBox} key={index}>
                                <div className={stylesSale.colorBox}>
                                  <NFTCardContainer
                                    id={item.uint256}
                                    color={item.hex}
                                    name={item.name}
                                    number={item.nftNo}
                                    displayCard={displayCard}
                                    cardId={cardId}
                                    buyItNow={buyItNow}
                                    expiry={salesExpiry[item.uint256]}
                                    price={salesPrice[item.uint256]}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        } else if (!toggled) {
                          if (
                            salesNfts &&
                            salesNfts.includes(item.uint256.toString()) &&
                            buyItNow
                          ) {
                            return (
                              <>
                                <div className={stylesSale.mainBox} key={index}>
                                  <div className={stylesSale.colorBox}>
                                    <NFTCardContainer
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      buyItNow={buyItNow}
                                      price={salesRealPrice[item.uint256]}
                                      expiry={salesExpiry[item.uint256]}
                                      onSale={true}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          } else if (!buyItNow) {
                            return (
                              <>
                                <div className={stylesSale.mainBox} key={index}>
                                  <div className={stylesSale.colorBox}>
                                    <NFTCardContainer
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      buyItNow={buyItNow}
                                      price={item.price_in_eth.toFixed(2)}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <div className={stylesSale.mainBox} key={index}>
                                  <div
                                    className={stylesSale.colorBox}
                                    style={{ opacity: "0.35" }}
                                  >
                                    <NFTCardContainer
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      buyItNow={buyItNow}
                                      price={item.price_in_eth.toFixed(2)}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          }
                        } else {
                          return (
                            <>
                              <div className={stylesSale.mainBox} key={index}>
                                <div
                                  className={stylesSale.colorBox}
                                  style={{ opacity: "0.35" }}
                                >
                                  <NFTCardContainer
                                    id={item.uint256}
                                    color={item.hex}
                                    name={item.name}
                                    number={item.nftNo}
                                    displayCard={displayCard}
                                    cardId={cardId}
                                    buyItNow={buyItNow}
                                    price={item.price_in_eth.toFixed(2)}
                                  />
                                </div>
                              </div>
                            </>
                          );
                        }
                      })}
                    </article>
                  </div>
                </>
              );
            })}
          </div>
        ) : (
          // If there is no selectedBaseColors in Small Card View
          <div style={{ width: "100%" }}>
            {/* Searched and Search Result Exist */}
            {/* {amountOfResults && amountOfResults.length !== 0 && (
              <h1 className={styles.descHeader}>
                {amountOfResults && amountOfResults.length}{" "}
                {amountOfResults && amountOfResults.length > 1
                  ? "Results"
                  : "Result"}
              </h1>
            )} */}
            {/* Searched and No Search Restult */}
            {amountOfResults.length === 0 && search !== "" && (
              <h1 style={{ color: "#fff" }} className={styles.descHeader}>
                No results found.
              </h1>
            )}
            {/* For Sale Toogle Enabled and No Sale NFTs */}
            {buyItNow && salesData.length === 0 && (
              <h1
                style={{ color: "#fff" }}
                className={styles.noResultFound}
              ></h1>
            )}
            <InfiniteScroll
              dataLength={autoLoadCard.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              height={
                buyItNow && isMobile ? (salesNfts.length > 2 ? 600 : 350) : 950
              }
              endMessage={
                <h3 style={{ textAlign: "center", color: "#fff" }}>
                  Yay! You have seen it all
                </h3>
              }
              refreshFunction={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              pullDownToRefresh
              pullDownToRefreshThreshold={50}
            >
              <div
                className={
                  !smallCard
                    ? stylesSale.colorBoxView
                    : stylesSale.colorBoxViewSmall
                }
              >
                {search !== ""
                  ? // If there is search word
                    buyItNow
                    ? sortedNftsData.map((item, index) => {
                        if (
                          salesPrice[item.uint256] >= Number(rangeValue[0]) &&
                          salesPrice[item.uint256] <= Number(rangeValue[1])
                        )
                          if (
                            item.hex
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            item.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            item.nftNo.toString().startsWith(search) ||
                            item.base_color_name
                              .toLowerCase()
                              .startsWith(search.toLowerCase()) ||
                            item.uint256.toString().startsWith(search)
                          ) {
                            if (
                              nfts.includes(item.uint256.toString()) &&
                              toggled &&
                              !buyItNow
                            ) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (
                              nfts.includes(item.uint256.toString()) &&
                              toggled &&
                              buyItNow &&
                              salesNfts &&
                              salesNfts.includes(item.uint256.toString())
                            ) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (!toggled) {
                              if (
                                salesNfts &&
                                salesNfts.includes(item.uint256.toString())
                              ) {
                                return (
                                  <>
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          buyItNow={buyItNow}
                                          expiry={salesExpiry[item.uint256]}
                                          price={salesRealPrice[item.uint256]}
                                          onSale={true}
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              } else if (!buyItNow) {
                                return (
                                  <>
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          buyItNow={buyItNow}
                                          price={item.price_in_eth.toFixed(2)}
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div
                                        className={stylesSale.colorBox}
                                        style={{ opacity: "0.35" }}
                                      >
                                        <NFTCardContainer
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          buyItNow={buyItNow}
                                          price={item.price_in_eth.toFixed(2)}
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            } else {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div
                                      className={stylesSale.colorBox}
                                      style={{ opacity: "0.35" }}
                                    >
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          }
                      })
                    : priceFilteredData.map((item, index) => {
                        if (
                          item.price_in_eth.toFixed(2) >=
                            Number(rangeValue[0]).toFixed(2) &&
                          item.price_in_eth.toFixed(2) <=
                            Number(rangeValue[1]).toFixed(2)
                        )
                          if (
                            item.hex
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            item.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            item.nftNo.toString().startsWith(search) ||
                            item.base_color_name
                              .toLowerCase()
                              .startsWith(search.toLowerCase()) ||
                            item.uint256.toString().startsWith(search)
                          ) {
                            if (
                              nfts.includes(item.uint256.toString()) &&
                              toggled
                            ) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (
                              nfts.includes(item.uint256.toString()) &&
                              toggled &&
                              buyItNow &&
                              salesNfts &&
                              salesNfts.includes(item.uint256.toString())
                            ) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (!toggled) {
                              if (
                                salesNfts &&
                                salesNfts.includes(item.uint256.toString())
                              ) {
                                return (
                                  <>
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          buyItNow={buyItNow}
                                          expiry={salesExpiry[item.uint256]}
                                          price={salesRealPrice[item.uint256]}
                                          onSale={true}
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              } else if (!buyItNow) {
                                return (
                                  <>
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div className={stylesSale.colorBox}>
                                        <NFTCardContainer
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          buyItNow={buyItNow}
                                          price={item.price_in_eth.toFixed(2)}
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              } else {
                                return (
                                  <>
                                    <div
                                      className={stylesSale.mainBox}
                                      key={index}
                                    >
                                      <div
                                        className={stylesSale.colorBox}
                                        style={{ opacity: "0.35" }}
                                      >
                                        <NFTCardContainer
                                          id={item.uint256}
                                          color={item.hex}
                                          name={item.name}
                                          number={item.nftNo}
                                          displayCard={displayCard}
                                          cardId={cardId}
                                          buyItNow={buyItNow}
                                          price={item.price_in_eth.toFixed(2)}
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            } else {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div
                                      className={stylesSale.colorBox}
                                      style={{ opacity: "0.35" }}
                                    >
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            }
                          }
                      })
                  : // If there is no search word
                  buyItNow
                  ? sortedNftsData &&
                    sortedNftsData
                      .slice(
                        0,
                        toggled || buyItNow || Number(value) < Number(maxValue)
                          ? allReceivedData.length
                          : autoLoadCard.length
                      )
                      .map((item, index) => {
                        if (
                          salesPrice[item.uint256] >= Number(rangeValue[0]) &&
                          salesPrice[item.uint256] <= Number(rangeValue[1])
                        ) {
                          if (
                            nfts &&
                            nfts.includes(item.uint256.toString()) &&
                            toggled &&
                            salesNfts &&
                            salesNfts.includes(item.uint256.toString())
                          ) {
                            // If NFT is in my palette and for sale
                            return (
                              <>
                                <div className={stylesSale.mainBox} key={index}>
                                  <div className={stylesSale.colorBox}>
                                    <NFTCardContainer
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      buyItNow={buyItNow}
                                      expiry={salesExpiry[item.uint256]}
                                      price={salesRealPrice[item.uint256]}
                                      onSale={true}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          } else if (!toggled) {
                            if (
                              salesNfts &&
                              salesNfts.includes(item.uint256.toString()) &&
                              buyItNow
                            ) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        expiry={salesExpiry[item.uint256]}
                                        price={salesRealPrice[item.uint256]}
                                        onSale={true}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (!buyItNow) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else {
                              return null;
                            }
                          } else {
                            return null;
                          }
                        }
                      })
                  : priceFilteredData &&
                    priceFilteredData
                      .slice(
                        0,
                        toggled ? priceFilteredData.length : autoLoadCard.length
                      )
                      .map((item, index) => {
                        if (
                          item.price_in_eth.toFixed(2) >=
                            Number(rangeValue[0]).toFixed(2) &&
                          item.price_in_eth.toFixed(2) <=
                            Number(rangeValue[1]).toFixed(2)
                        )
                          if (
                            nfts &&
                            nfts.includes(item.uint256.toString()) &&
                            toggled &&
                            !buyItNow
                          ) {
                            return (
                              <>
                                <div className={stylesSale.mainBox} key={index}>
                                  <div className={stylesSale.colorBox}>
                                    <NFTCardContainer
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      buyItNow={buyItNow}
                                      price={item.price_in_eth.toFixed(2)}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          } else if (
                            nfts &&
                            nfts.includes(item.uint256.toString()) &&
                            toggled &&
                            salesNfts &&
                            salesNfts.includes(item.uint256.toString()) &&
                            buyItNow
                          ) {
                            return (
                              <>
                                <div className={stylesSale.mainBox} key={index}>
                                  <div className={stylesSale.colorBox}>
                                    <NFTCardContainer
                                      id={item.uint256}
                                      color={item.hex}
                                      name={item.name}
                                      number={item.nftNo}
                                      displayCard={displayCard}
                                      cardId={cardId}
                                      buyItNow={buyItNow}
                                      price={item.price_in_eth.toFixed(2)}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          } else if (!toggled) {
                            if (
                              salesNfts &&
                              salesNfts.includes(item.uint256.toString()) &&
                              buyItNow
                            ) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        expiry={salesExpiry[item.uint256]}
                                        price={salesRealPrice[item.uint256]}
                                        onSale={true}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else if (!buyItNow) {
                              return (
                                <>
                                  <div
                                    className={stylesSale.mainBox}
                                    key={index}
                                  >
                                    <div className={stylesSale.colorBox}>
                                      <NFTCardContainer
                                        id={item.uint256}
                                        color={item.hex}
                                        name={item.name}
                                        number={item.nftNo}
                                        displayCard={displayCard}
                                        cardId={cardId}
                                        buyItNow={buyItNow}
                                        price={item.price_in_eth.toFixed(2)}
                                      />
                                    </div>
                                  </div>
                                </>
                              );
                            } else {
                              return null;
                            }
                          } else {
                            return null;
                          }
                      })}
              </div>
            </InfiniteScroll>
          </div>
        )
      ) : (
        // This is Activity Panel
        <>
          <div className={styles.tableSectionMain}>
            <Tabs
              className={styles.tab}
              // defaultIndex={1}
              selectedIndex={tabIndex}
              onSelect={(index) => setTabIndex(index)}
            >
              <div className={styles.activityTabSearch}>
                <TabList>
                  <Tab
                    selectedClassName={styles.tabActive}
                    onClick={() => {
                      setType("Sales");
                      if (sessionStorage.getItem("tabList")) {
                        sessionStorage.removeItem("tabList");
                        sessionStorage.setItem("tabList", "Sales");
                      } else sessionStorage.setItem("tabList", "Sales");
                    }}
                  >
                    <span>Sales</span>
                  </Tab>
                  <Tab
                    selectedClassName={styles.tabActive}
                    onClick={() => {
                      setType("Bids");
                      if (sessionStorage.getItem("tabList")) {
                        sessionStorage.removeItem("tabList");
                        sessionStorage.setItem("tabList", "Bids");
                      } else sessionStorage.setItem("tabList", "Bids");
                    }}
                  >
                    <span>Bids</span>
                  </Tab>
                  <Tab
                    selectedClassName={styles.tabActive}
                    onClick={() => {
                      setType("Asks");
                      if (sessionStorage.getItem("tabList")) {
                        sessionStorage.removeItem("tabList");
                        sessionStorage.setItem("tabList", "Asks");
                      } else sessionStorage.setItem("tabList", "Asks");
                    }}
                  >
                    <span>LISTS</span>
                  </Tab>
                </TabList>
                {/* <div
                  className={`${styles.filterForm}`}
                  style={{ marginTop: "5px" }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveToDBForTable();
                    }}
                  >
                    <div className={styles.bsContainer}>
                      <BsSearch className={styles.bsSearch} />
                    </div>
                    <input
                      placeholder="Search by Name, Hex, Category, No., TokenID"
                      value={tableSearch}
                      onChange={(e) => {
                        setTableSearch(e.target.value);
                      }}
                    />
                    {amountOfResults.length > 0 && (
                      <div className={styles.formSerachLenght}>
                        {amountOfResults.length}{" "}
                        {amountOfResults.length > 1 ? "Results" : "Result"}
                      </div>
                    )}
                  </form>
                </div> */}
              </div>
              <TabPanel>
                <SalesTradesTable
                  tableSearch={tableSearch}
                  setTableSearch={setTableSearch}
                />
              </TabPanel>
              <TabPanel>
                <BidsTradesTable
                  tableSearch={tableSearch}
                  setTableSearch={setTableSearch}
                />
              </TabPanel>
              <TabPanel>
                <AsksTradesTable
                  tableSearch={tableSearch}
                  setTableSearch={setTableSearch}
                />
              </TabPanel>
            </Tabs>
          </div>
        </>
      )}
      {!footerOnView && refFilter && items && !focusInput && !openMobileFilter && (
        <article
          className={`${styles.mobileFilter}`}
          onClick={() => setOpenMobileFilter(true)}
        >
          Filter{" "}
          {/* {buyItNow && salesNfts.length > 0 ? (
            <span className={styles.numbersOnFilter}>{salesNfts.length}</span>
          ) : null}
          {selectedBaseColors.length > 0 ? (
            <span className={styles.numbersOnFilter}>
              {selectedBaseColors.length}
            </span>
          ) : null} */}
          {mainMobileFilterCounter && (
            <span className={styles.numbersOnFilter}>
              {mainMobileFilterCounter}
            </span>
          )}
        </article>
      )}
      {/* Filter Pane on Mobile */}

      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
      <SlidingPane
        className={"newSlideContainer"}
        overlayClassName={styles.slideMobileOverlay}
        isOpen={openMobileFilter}
        title={
          <div className={stylesFilter.newPurchaseTitleGallery}>
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
        {items && (
          <div className={styles.stickyFilterContainer}>
            <div className={styles.containerContent}>
              <div className={styles.flexContent}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: ".6rem 0",
                  }}
                >
                  For Sale
                  <div className={styles.forSaleAmount}>{salesNftsCount}</div>
                  <p className={styles.fontSizeSale}>
                    {allReceivedData &&
                      salesNfts &&
                      (
                        (100 * salesNfts.length) /
                        allReceivedData.length
                      ).toFixed(2)}
                    % listed
                  </p>
                </h3>
                <Switch
                  defaultChecked
                  checked={buyItNow}
                  onCheckedChange={() => {
                    setBuyItNow(!buyItNow);
                    sessionStorage.setItem("forSale", !buyItNow);
                  }}
                  id="s2"
                >
                  <SwitchThumb />
                </Switch>
              </div>
            </div>
            {items && (
              <div className={styles.containerContent}>
                <div className={styles.flexContent}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: ".6rem 0",
                      height: "50px",
                    }}
                  >
                    My Palette
                  </h3>
                  <Switch
                    defaultChecked
                    checked={toggled}
                    onCheckedChange={() => {
                      if (connectedAddress === "") {
                        setToggled(true);
                        setConnectWallet(true);
                        setOpenMobileFilter(false);
                        setTimeout(() => {
                          // toast(
                          //   <div className={"toastComman"}>
                          //     No wallet connected.
                          //     <IoClose
                          //       size={25}
                          //       onClick={(t) => {
                          //         toast.dismiss(t.id);
                          //       }}
                          //     />
                          //   </div>,
                          //   {
                          //     style: {
                          //       border: "1px solid #f0291a",
                          //     },
                          //   }
                          // );
                          // setToggled(false);
                        }, 1000);
                      } else if (!showToggle) {
                        setTimeout(() => {
                          toast(
                            <div className={"toastComman"}>
                              You do not own any colors.
                              <IoClose
                                size={25}
                                onClick={(t) => {
                                  toast.dismiss(t.id);
                                }}
                              />
                            </div>,
                            {
                              style: {
                                border: "1px solid #f0291a",
                              },
                            }
                          );
                          setToggled(false);
                        }, 1000);
                      } else {
                        setToggled(!toggled);
                        sessionStorage.setItem("myPalette", !toggled);
                      }
                    }}
                    id="s1"
                  >
                    <SwitchThumb />
                  </Switch>
                </div>
              </div>
            )}
            <div className={styles.containerContent}>
              <div
                className={styles.flexContent}
                style={{
                  borderBottom: openedFilter.view ? "1px solid #100f0f" : null,
                }}
              >
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
                className={styles.gridContent}
                style={{ display: openedFilter.view ? "block" : "none" }}
              >
                <h4
                  onClick={() => {
                    setView("grid");
                    sessionStorage.setItem("view", "card");
                  }}
                  className={`${view === "grid" && styles.activeTab}`}
                >
                  Grid
                  {view === "grid" && (
                    <RiRadioButtonFill
                      style={{ margin: "0", fontSize: "1.2rem" }}
                    />
                  )}
                </h4>
                {/* <h4
                  onClick={() => setView("list")}
                  className={`${view === "list" && styles.activeTab}`}
                >
                  List
                  {view === "list" && (
                    <RiRadioButtonFill
                      style={{ margin: "0", fontSize: "1.2rem" }}
                    />
                  )}
                </h4> */}
                <h4
                  onClick={() => {
                    setView("card");
                    sessionStorage.setItem("view", "cardLarge");
                    setSmallCard(false);
                  }}
                  className={`${
                    view === "card" && !smallCard && styles.activeTab
                  }`}
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
                    sessionStorage.setItem("view", "cardSmall");
                    setSmallCard(true);
                  }}
                  className={`${
                    view === "card" && smallCard && styles.activeTab
                  }`}
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
            <div className={styles.containerContent}>
              <div
                className={styles.flexContent}
                style={{
                  borderBottom: openedFilter.group ? "1px solid #100f0f" : null,
                }}
              >
                <h3>Category</h3>
                {openedFilter.group ? (
                  <FiMinus
                    onClick={() =>
                      setOpenedFilter({
                        view: openedFilter.view,
                        group: false,
                        price: openedFilter.price,
                      })
                    }
                  />
                ) : (
                  <BsPlusLg
                    onClick={() =>
                      setOpenedFilter({
                        view: openedFilter.view,
                        group: true,
                        price: openedFilter.price,
                      })
                    }
                  />
                )}
              </div>
              <div
                className={styles.gridContent}
                style={{ display: openedFilter.group ? "block" : "none" }}
              >
                <h4
                  onClick={() => {
                    if (hexWords && selectedBaseColors.length === 0)
                      setFiltered(false);
                    else setFiltered(true);
                    setHexWords(!hexWords);
                    sessionStorage.setItem("hexWord", !hexWords);
                  }}
                  className={`${
                    hexWords ? styles.groupActive : styles.colorDivMain
                  }`}
                >
                  Hex Words
                  {hexWords && (
                    <div className={styles.forSaleAmount}>
                      {hexWordsArray && hexWordsArray.length}
                    </div>
                  )}
                  {hexWords && (
                    <RiRadioButtonFill
                      style={{ margin: "0", fontSize: "1.2rem" }}
                      className={styles.dotIcon}
                    />
                  )}
                </h4>
                {baseColor &&
                  baseColor.map((item, index) => {
                    let amountOfColors = 0;
                    allReceivedData.map((i) => {
                      if (item === i.base_color_name) {
                        amountOfColors = amountOfColors += 1;
                      }
                    });
                    return (
                      <h4
                        key={index}
                        onClick={() => {
                          if (selectedBaseColors.includes(item)) {
                            setSelectedBaseColors((color) =>
                              color.filter((i) => i !== item)
                            );
                          } else {
                            setSelectedBaseColors((prevState) => [
                              ...prevState,
                              item,
                            ]);
                          }
                          setFiltered(true);
                        }}
                        onMouseOver={(e) => {
                          if (item === "black") {
                            e.target.style.color = "#fff";
                          } else if (item === "white") {
                            e.target.style.color = "#000";
                          }
                          e.target.style.background = item;
                        }}
                        onMouseOut={(e) => {
                          if (item === "black") {
                            e.target.style.color = "#000";
                          } else if (item === "white") {
                            e.target.style.color = "#000";
                          }
                          e.target.style.background = "#f4f4f4";
                        }}
                        className={`${
                          selectedBaseColors.includes(item)
                            ? styles.groupActive
                            : styles.colorDivMain
                        }`}
                      >
                        {item}
                        {selectedBaseColors.includes(item) && (
                          <div className={styles.forSaleAmount}>
                            {amountOfColors}
                          </div>
                        )}
                        {selectedBaseColors.includes(item) && (
                          <RiRadioButtonFill
                            style={{ margin: "0", fontSize: "1.2rem" }}
                            className={styles.dotIcon}
                          />
                        )}
                      </h4>
                    );
                  })}
              </div>
            </div>
            {items && (
              <div className={styles.containerContent}>
                <div
                  className={styles.flexContent}
                  style={{
                    borderBottom: openedFilter.price
                      ? "1px solid #100f0f"
                      : null,
                  }}
                >
                  <h3>Price</h3>
                  {openedFilter.price ? (
                    <FiMinus
                      onClick={() =>
                        setOpenedFilter({
                          view: openedFilter.view,
                          group: openedFilter.group,
                          price: false,
                        })
                      }
                    />
                  ) : (
                    <BsPlusLg
                      onClick={() =>
                        setOpenedFilter({
                          view: openedFilter.view,
                          group: openedFilter.group,
                          price: true,
                        })
                      }
                    />
                  )}
                </div>
                <div className={styles.gridContent}>
                  <h4
                    className={styles.styledSlider}
                    style={{ display: "grid" }}
                  >
                    <StyledSlider
                      defaultValue={[0, 100]}
                      step={20}
                      value={[minPercent, maxPercent]}
                      onValueChange={(value) => {
                        setMinPercent(value[0]);
                        setMaxPercent(value[1]);
                        const difference = maxValue - minValue;
                        var tempMinValue;
                        var tempMaxValue;
                        if (value[0] == 0) tempMinValue = minValue;
                        else
                          tempMinValue =
                            minValue + (difference * value[0]) / 100;
                        if (value[1] == 100) tempMaxValue = maxValue;
                        else
                          tempMaxValue =
                            minValue + (difference * value[1]) / 100;
                        setRangeValue([tempMinValue, tempMaxValue]);
                      }}
                    >
                      <StyledTrack>
                        <StyledRange
                          style={{
                            outline:
                              rangeValue[0].toFixed(2) ===
                                minValue.toFixed(2) && "none",
                            borderRadius:
                              rangeValue[1].toFixed(2) ===
                                maxValue.toFixed(2) && "20px",
                          }}
                        />
                      </StyledTrack>
                      {rangeValue.map((_, i) => (
                        <StyledThumb>
                          <div className={styles.textToggle}>
                            {rangeValue[0] === rangeValue[1] ? (
                              <h2 className={styles.thumbTextTopLeft}>
                                {rangeValue[0] ? rangeValue[0].toFixed(2) : 0}{" "}
                                ETH
                              </h2>
                            ) : i === 0 ? (
                              <h2 className={styles.thumbTextTopLeft}>
                                {rangeValue[0] ? rangeValue[0].toFixed(2) : 0}{" "}
                                ETH
                              </h2>
                            ) : (
                              <h2 className={styles.thumbTextTopRight}>
                                {rangeValue[1] ? rangeValue[1].toFixed(2) : 0}{" "}
                                ETH
                              </h2>
                            )}
                          </div>
                          <div className={styles.thumb} />
                          <h1 className={styles.thumbText}>
                            {rangeValue[0] === rangeValue[1] ? (
                              // 'equal'
                              <GoTriangleUp size={15} />
                            ) : i === 0 ? (
                              <span className={styles.thumbTextBottomLeft}>
                                MIN
                              </span>
                            ) : (
                              <span className={styles.thumbTextBottomRight}>
                                MAX
                              </span>
                            )}
                          </h1>
                        </StyledThumb>
                      ))}
                    </StyledSlider>
                  </h4>
                </div>
              </div>
            )}
          </div>
        )}
      </SlidingPane>
    </div>
  );
};

export default Views;

const GridAllColors = ({
  displayCard,
  cardId,
  setDisplayCard,
  setCardId,
  refOverflow,
  handleShow,
  changeOpacityAmount,
  selectCardIdOnHover,
  opacityAmount,
  walletAddress,
  toggled,
  showToggle,
  nfts,
  search,
  salesPrice,
  salesRealPrice,
  salesNfts,
  salesNftsData,
  buyItNow,
  amountOfResults,
  salesExpiry,
  rangeValue,
}) => {
  const { allReceivedData } = useSelector((state) => state.data);
  const dividedBy = isMobile ? 35 : 50;
  let faucetArr = [];
  if (allReceivedData.length < 10000) {
    for (var i = 0; i < MINTED_SQUARE - allReceivedData.length; i++) {
      faucetArr.push(i);
    }
  }

  const containerWidthRef = useRef();
  const colorBoxRef = useRef();

  const [loadMore, setLoadMore] = useState(
    (containerWidthRef.current?.clientWidth / dividedBy) * 3
  );

  useEffect(() => {
    if (containerWidthRef) {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 3);
    }
  }, [containerWidthRef]);

  useEffect(() => {
    if (loadMore) {
      setLoadMore(loadMore);
    }
  }, [loadMore]);

  //
  //
  useEffect(() => {
    if (search !== "") {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 50);
    } else {
      setLoadMore((containerWidthRef.current?.clientWidth / dividedBy) * 3);
    }
  }, [search]);
  //

  const handleClick = (e) => {
    var myLocation = e.changedTouches[0];
    const received = document.elementFromPoint(
      myLocation.clientX,
      myLocation.clientY
    );
    handleShow();
    setDisplayCard(true);
    setCardId(received.id);
  };
  const handleClickLeave = () => {
    setDisplayCard(false);
    setCardId("");
  };
  let history = useRouter();

  const handleSide = () => {
    return (
      (containerWidthRef.current?.clientWidth -
        (containerWidthRef.current?.clientWidth % dividedBy)) /
      dividedBy /
      2
    );
  };

  const handleSideReturn = (number) => {
    const amount = Math.ceil(allReceivedData.length / (handleSide() * 2));
    for (let i = 0; i < amount * 2; i += 2) {
      if (
        number >= Math.ceil(handleSide() * i + 1) &&
        number <= Math.ceil(handleSide() * (i + 1))
      ) {
        return true;
      }
    }
  };

  useEffect(() => {
    if (buyItNow && salesNftsData && salesNftsData.length > 0) {
      const saleNFTIdList = salesNftsData.map((item) => {
        return item["erc721TokenId"].toString();
      });

      const tempAllReceivedData = [];
      for (var k = 0; k < allReceivedData.length; k++) {
        tempAllReceivedData.push(allReceivedData[k]);
        tempAllReceivedData[k].expiry = 9999999999;
      }

      for (var i = 0; i < tempAllReceivedData.length; i++)
        for (var j = 0; j < salesNftsData.length; j++) {
          if (
            salesNftsData[j]["erc721TokenId"].toString() ==
            tempAllReceivedData[i].uint256
          ) {
            tempAllReceivedData[i].expiry = salesNftsData[j].expiry;
          }
        }

      tempAllReceivedData.sort((a, b) => {
        if (a.expiry > b.expiry) return 1;
        if (a.expiry < b.expiry) return -1;
        return 0;
      });

      tempAllReceivedData.forEach((item) => {
        delete item.expiry;
      });

      setFilteredData(tempAllReceivedData);
    }
  }, [buyItNow]);

  const handleBottomSideReturn = (index) => {
    for (let i = 0; i < allReceivedData.length; i++) {
      if (buyItNow && i < 200) {
        return false;
      }
      if (
        allReceivedData.length -
          (containerWidthRef &&
            containerWidthRef.current?.clientWidth / dividedBy) *
            6 <
        index
      ) {
        return true;
      }
    }
  };

  const [filteredData, setFilteredData] = useState(allReceivedData);

  useEffect(() => {
    if (search !== "") {
      const data = allReceivedData.filter((item) => {
        return (
          item.hex.toLowerCase().includes(search.toLowerCase()) ||
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.nftNo.toString().startsWith(search) ||
          item.base_color_name.toLowerCase().startsWith(search.toLowerCase()) ||
          item.uint256.toString().startsWith(search)
        );
      });
      setFilteredData(data);
    } else {
      setFilteredData(allReceivedData);
    }
  }, [search]);

  useEffect(() => {}, [filteredData]);
  return (
    <div className={stylesSecond.dataTableContainer} ref={refOverflow}>
      {amountOfResults && !search && amountOfResults.length !== 0 && (
        <h1
          className={`${styles.descHeader} ${stylesSecond.descHeader}`}
          style={{ marginBottom: "1rem" }}
        >
          {amountOfResults && amountOfResults.length}{" "}
          {amountOfResults && amountOfResults.length > 1 ? "Results" : "Result"}
        </h1>
      )}
      {amountOfResults.length === 0 && search !== "" && (
        <h1 style={{ color: "#fff" }} className={styles.descHeader}>
          No results found.
        </h1>
      )}
      {isMobile ? (
        <article
          className={stylesSecond.mainGrid}
          ref={containerWidthRef}
          onTouchMove={handleClick}
          onTouchStart={handleClick}
          onTouchEnd={handleClickLeave}
        >
          {filteredData.map((item, index) => {
            const color = `rgb(${hexRgb(item.hex, { format: "css" })[0]}, ${
              hexRgb(item.hex, { format: "css" })[1]
            }, ${hexRgb(item.hex, { format: "css" })[2]})`;

            if (
              buyItNow &&
              salesNfts &&
              salesNfts.includes(item.uint256.toString())
            ) {
              if (
                salesPrice[item.uint256] <= rangeValue[1] &&
                salesPrice[item.uint256] >= rangeValue[0]
              )
                if (nfts.includes(item.uint256.toString()) && toggled) {
                  return (
                    <>
                      <div
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
                        id={item.name + item.hex.slice(1)}
                        onClick={() =>
                          history.push(`/gallery/color-nft/${item.uint256}`)
                        }
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(
                            salesNfts.indexOf(item.uint256.toString()) + 1
                          )}
                          expiry={salesExpiry[item.uint256]}
                          onSale={true}
                          price={salesRealPrice[item.uint256]}
                        />
                      </div>
                    </>
                  );
                } else {
                  if (!toggled)
                    return (
                      <>
                        <div
                          className={stylesSecond.gridItem}
                          style={{ background: color }}
                          id={item.name + item.hex.slice(1)}
                          onClick={() =>
                            history.push(`/gallery/color-nft/${item.uint256}`)
                          }
                        >
                          <NFTCardContainerOnHover
                            id={item.uint256}
                            color={item.hex}
                            name={item.name}
                            number={item.nftNo}
                            displayCard={displayCard}
                            cardId={cardId}
                            handleShow={handleShow}
                            showOnLeft={handleSideReturn(
                              salesNfts.indexOf(item.uint256.toString()) + 1
                            )}
                            expiry={salesExpiry[item.uint256]}
                            onSale={true}
                            price={salesRealPrice[item.uint256]}
                          />
                        </div>
                      </>
                    );
                }
            } else if (
              salesNfts &&
              !salesNfts.includes(item.uint256.toString()) &&
              buyItNow
            ) {
              return null;
            } else if (
              item.price_in_eth.toFixed(2) >= rangeValue[0].toFixed(2) &&
              item.price_in_eth.toFixed(2) <= rangeValue[1].toFixed(2)
            )
              if (index === filteredData.length - 1) {
                if (item.minting_address === walletAddress && toggled) {
                  return (
                    <div
                      className={stylesSecond.gridItem}
                      style={{ background: color }}
                      id={item.name + item.hex.slice(1)}
                      onClick={() =>
                        history.push(`/gallery/color-nft/${item.uint256}`)
                      }
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(index + 1)}
                        price={item.price_in_eth}
                        onSale={false}
                      />
                    </div>
                  );
                } else if (!toggled || !showToggle) {
                  return (
                    <div
                      className={stylesSecond.gridItem}
                      style={{ background: color }}
                      id={item.name + item.hex.slice(1)}
                      onClick={() =>
                        history.push(`/gallery/color-nft/${item.uint256}`)
                      }
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(index + 1)}
                        price={item.price_in_eth}
                        onSale={false}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={stylesSecond.gridItem}
                      style={{
                        background: color,
                        opacity:
                          nfts.includes(item.uint256.toString()) ||
                          selectCardIdOnHover == item.uint256
                            ? "1"
                            : opacityAmount,
                      }}
                      id={item.name + item.hex.slice(1)}
                      onClick={() =>
                        history.push(`/gallery/color-nft/${item.uint256}`)
                      }
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(index + 1)}
                        price={item.price_in_eth}
                        onSale={false}
                      />
                    </div>
                    // </Link>
                  );
                }
              } else if (item.minting_address === walletAddress && toggled) {
                return (
                  <div
                    className={stylesSecond.gridItem}
                    style={{ background: color }}
                    id={item.name + item.hex.slice(1)}
                    onClick={() =>
                      history.push(`/gallery/color-nft/${item.uint256}`)
                    }
                  >
                    <NFTCardContainerOnHover
                      id={item.uint256}
                      color={item.hex}
                      name={item.name}
                      number={item.nftNo}
                      displayCard={displayCard}
                      cardId={cardId}
                      handleShow={handleShow}
                      showOnLeft={handleSideReturn(index + 1)}
                      price={item.price_in_eth}
                      onSale={false}
                    />
                  </div>
                );
              } else if (!toggled || !showToggle) {
                return (
                  <div
                    className={stylesSecond.gridItem}
                    style={{ background: color }}
                    id={item.name + item.hex.slice(1)}
                    onClick={() =>
                      history.push(`/gallery/color-nft/${item.uint256}`)
                    }
                  >
                    <NFTCardContainerOnHover
                      id={item.uint256}
                      color={item.hex}
                      name={item.name}
                      number={item.nftNo}
                      displayCard={displayCard}
                      cardId={cardId}
                      handleShow={handleShow}
                      showOnLeft={handleSideReturn(index + 1)}
                      price={item.price_in_eth}
                      onSale={false}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    className={stylesSecond.gridItem}
                    style={{
                      background: color,
                      opacity:
                        nfts.includes(item.uint256.toString()) ||
                        selectCardIdOnHover == item.uint256
                          ? "1"
                          : opacityAmount,
                    }}
                    id={item.name + item.hex.slice(1)}
                    onClick={() =>
                      history.push(`/gallery/color-nft/${item.uint256}`)
                    }
                  >
                    <NFTCardContainerOnHover
                      id={item.uint256}
                      color={item.hex}
                      name={item.name}
                      number={item.nftNo}
                      displayCard={displayCard}
                      cardId={cardId}
                      handleShow={handleShow}
                      showOnLeft={handleSideReturn(index + 1)}
                      price={item.price_in_eth}
                      onSale={false}
                    />
                  </div>
                  // </Link>
                );
              }
          })}
        </article>
      ) : (
        <article
          className={stylesSecond.mainGrid}
          ref={containerWidthRef}
          // style={{ minHeight: `${containerWidthRef.current?.clientHeight - 50}px` }}
        >
          {filteredData.map((item, index) => {
            const color = `rgb(${hexRgb(item.hex, { format: "css" })[0]}, ${
              hexRgb(item.hex, { format: "css" })[1]
            }, ${hexRgb(item.hex, { format: "css" })[2]})`;

            if (
              buyItNow &&
              salesNfts &&
              salesNfts.includes(item.uint256.toString())
            ) {
              if (
                salesPrice[item.uint256] >= rangeValue[0] &&
                salesPrice[item.uint256] <= rangeValue[1]
              ) {
                if (nfts.includes(item.uint256.toString()) && toggled) {
                  return (
                    <>
                      <Link
                        href={`/gallery/color-nft/${item.uint256}`}
                        key={index}
                      >
                        <a
                          className={stylesSecond.gridItem}
                          style={{ background: color }}
                          onMouseEnter={() => {
                            handleShow();
                            setDisplayCard(true);
                            setCardId(item.name + item.hex.slice(1));
                          }}
                          onMouseLeave={() => {
                            setDisplayCard(false);
                            setCardId("");
                          }}
                        >
                          <NFTCardContainerOnHover
                            id={item.uint256}
                            color={item.hex}
                            name={item.name}
                            number={item.nftNo}
                            displayCard={displayCard}
                            cardId={cardId}
                            handleShow={handleShow}
                            showOnLeft={handleSideReturn(
                              salesNfts.indexOf(item.uint256.toString()) + 1
                            )}
                            showOnBottom={handleBottomSideReturn(index)}
                            expiry={salesExpiry[item.uint256]}
                            price={salesRealPrice[item.uint256]}
                            onSale={true}
                          />
                        </a>
                      </Link>
                    </>
                  );
                } else {
                  if (!toggled)
                    return (
                      <>
                        <Link
                          href={`/gallery/color-nft/${item.uint256}`}
                          key={index}
                        >
                          <a
                            className={stylesSecond.gridItem}
                            style={{ background: color }}
                            onMouseEnter={() => {
                              handleShow();
                              setDisplayCard(true);
                              setCardId(item.name + item.hex.slice(1));
                            }}
                            onMouseLeave={() => {
                              setDisplayCard(false);
                              setCardId("");
                            }}
                          >
                            <NFTCardContainerOnHover
                              id={item.uint256}
                              color={item.hex}
                              name={item.name}
                              number={item.nftNo}
                              displayCard={displayCard}
                              cardId={cardId}
                              handleShow={handleShow}
                              showOnLeft={handleSideReturn(
                                salesNfts.indexOf(item.uint256.toString()) + 1
                              )}
                              showOnBottom={handleBottomSideReturn(index)}
                              expiry={salesExpiry[item.uint256]}
                              price={salesRealPrice[item.uint256]}
                              onSale={true}
                            />
                          </a>
                        </Link>
                      </>
                    );
                }
              }
            } else if (
              salesNfts &&
              !salesNfts.includes(item.uint256.toString()) &&
              buyItNow
            ) {
              return null;
            } else if (
              item.price_in_eth.toFixed(2) >= rangeValue[0].toFixed(2) &&
              item.price_in_eth.toFixed(2) <= rangeValue[1].toFixed(2)
            )
              if (index === filteredData.length - 1) {
                if (item.minting_address === walletAddress && toggled) {
                  return (
                    <Link
                      href={`/gallery/color-nft/${item.uint256}`}
                      key={index}
                    >
                      <a
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
                        onMouseEnter={() => {
                          handleShow();
                          setDisplayCard(true);
                          setCardId(item.name + item.hex.slice(1));
                        }}
                        onMouseLeave={() => {
                          setDisplayCard(false);
                          setCardId("");
                        }}
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(index + 1)}
                          showOnBottom={handleBottomSideReturn(index)}
                          price={item.price_in_eth}
                          onSale={false}
                        />
                      </a>
                    </Link>
                  );
                } else if (!toggled || !showToggle) {
                  return (
                    <Link
                      href={`/gallery/color-nft/${item.uint256}`}
                      key={index}
                    >
                      <a
                        className={stylesSecond.gridItem}
                        style={{ background: color }}
                        onMouseEnter={() => {
                          handleShow();
                          setDisplayCard(true);
                          setCardId(item.name + item.hex.slice(1));
                        }}
                        onMouseLeave={() => {
                          setDisplayCard(false);
                          setCardId("");
                        }}
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(index + 1)}
                          showOnBottom={handleBottomSideReturn(index)}
                          price={item.price_in_eth}
                          onSale={false}
                        />
                      </a>
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      href={`/gallery/color-nft/${item.uint256}`}
                      key={index}
                    >
                      <a
                        className={stylesSecond.gridItem}
                        style={{
                          background: color,
                          opacity:
                            nfts.includes(item.uint256.toString()) ||
                            selectCardIdOnHover == item.uint256
                              ? "1"
                              : opacityAmount,
                        }}
                        onMouseEnter={() => {
                          handleShow();
                          setDisplayCard(true);
                          setCardId(item.name + item.hex.slice(1));
                          changeOpacityAmount(item.uint256);
                        }}
                      >
                        <NFTCardContainerOnHover
                          id={item.uint256}
                          color={item.hex}
                          name={item.name}
                          number={item.nftNo}
                          displayCard={displayCard}
                          cardId={cardId}
                          handleShow={handleShow}
                          showOnLeft={handleSideReturn(index + 1)}
                          showOnBottom={handleBottomSideReturn(index)}
                          price={item.price_in_eth}
                          onSale={false}
                        />
                      </a>
                    </Link>
                  );
                }
              } else if (item.minting_address === walletAddress && toggled) {
                return (
                  <Link href={`/gallery/color-nft/${item.uint256}`} key={index}>
                    <a
                      className={stylesSecond.gridItem}
                      style={{ background: color }}
                      onMouseEnter={() => {
                        handleShow();
                        setDisplayCard(true);
                        setCardId(item.name + item.hex.slice(1));
                      }}
                      onMouseLeave={() => {
                        setDisplayCard(false);
                        setCardId("");
                      }}
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(index + 1)}
                        showOnBottom={handleBottomSideReturn(index)}
                        price={item.price_in_eth}
                        onSale={false}
                      />
                    </a>
                  </Link>
                );
              } else if (!toggled || !showToggle) {
                return (
                  <Link href={`/gallery/color-nft/${item.uint256}`} key={index}>
                    <a
                      className={stylesSecond.gridItem}
                      style={{ background: color }}
                      onMouseEnter={() => {
                        handleShow();
                        setDisplayCard(true);
                        setCardId(item.name + item.hex.slice(1));
                      }}
                      onMouseLeave={() => {
                        setDisplayCard(false);
                        setCardId("");
                      }}
                      ref={colorBoxRef}
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(index + 1)}
                        showOnBottom={handleBottomSideReturn(index)}
                        price={item.price_in_eth}
                        onSale={false}
                      />
                    </a>
                  </Link>
                );
              } else {
                return (
                  <Link href={`/gallery/color-nft/${item.uint256}`} key={index}>
                    <a
                      className={stylesSecond.gridItem}
                      style={{
                        background: color,
                        opacity:
                          nfts.includes(item.uint256.toString()) ||
                          selectCardIdOnHover == item.uint256
                            ? "1"
                            : opacityAmount,
                      }}
                      onMouseEnter={() => {
                        handleShow();
                        setDisplayCard(true);
                        setCardId(item.name + item.hex.slice(1));
                        changeOpacityAmount(item.uint256);
                      }}
                      onMouseLeave={() => {
                        setDisplayCard(false);
                        setCardId("");
                        changeOpacityAmount(null);
                      }}
                    >
                      <NFTCardContainerOnHover
                        id={item.uint256}
                        color={item.hex}
                        name={item.name}
                        number={item.nftNo}
                        displayCard={displayCard}
                        cardId={cardId}
                        handleShow={handleShow}
                        showOnLeft={handleSideReturn(index + 1)}
                        showOnBottom={handleBottomSideReturn(index)}
                        price={item.price_in_eth}
                        onSale={false}
                      />
                    </a>
                  </Link>
                );
              }
          })}
        </article>
      )}
    </div>
  );
};

export const NFTCardContainerOnHover = ({
  id,
  name,
  color,
  number,
  displayCard,
  cardId,
  handleShow,
  showOnLeft,
  showOnBottom,
  price,
  expiry,
  onSale,
}) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("25");
  const [width, setWidth] = useState(window.innerWidth);
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
  useEffect(() => {
    handleShow();
  }, [cardId]);
  const { whiteBorders } = useSelector((state) => state.minting);

  return (
    <Link href={`/gallery/color-nft/${id}`} passHref>
      <Atropos
        activeOffset={40}
        shadow={false}
        className={`${!showOnLeft ? "left_position" : "right_position"} ${
          showOnBottom && "bottom_position"
        }`}
      >
        <div
          className={`${stylesSale.recentlyBoxContainer} recentlyContainer`}
          style={{
            borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
            textDecoration: "none",
            display:
              displayCard && cardId === name + color.slice(1)
                ? "block"
                : "none",
            background: "#000",
          }}
        >
          <div
            className={`${stylesSale.containerContentWidth} ${styles.containerContentSmall}`}
          >
            <div
              className="recentlyHeader"
              style={{
                borderBottom: `${
                  whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                }`,
              }}
            >
              <div className="flex_cardContainer">
                <div className="logo_cardImage">
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
                {number}
              </div>
            </div>
            <div
              className={`${stylesSale.backgroundBoxContainer} backgroundContainer`}
              style={{ background: `${color}` }}
            ></div>
            <div
              className="recentlyHeader"
              style={{
                borderTop: `${
                  whiteBorders.includes(color) ? "3px solid #1c1c1e" : "none"
                }`,
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
          </div>
          {onSale ? (
            <div className={stylesSale.bottomPart}>
              <div
                className={stylesSale.colorBoxTime}
                style={{ marginBottom: "-10px" }}
              >
                <div className={stylesSale.colorBoxProcessBar}>
                  <AiFillClockCircle size={isMobile ? 10 : 15} />
                </div>
                <span>Expiry {expiry}</span>
              </div>
              <div className={stylesSale.colorDetails}>
                <div className={`${stylesSale.flexContainerBottom} `}>
                  <h1>{price}</h1>
                  <div className={stylesSale.buyButton}>
                    {" "}
                    <Link href={`/gallery/color-nft/${id}?buy=true`} passHref>
                      BUY
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={stylesSale.bottomPart}>
              <div className={stylesSale.colorDetails}>
                <h4 style={{ color: "#FFF", margin: "0", fontWeight: "300" }}>
                  Last Price
                </h4>
                <div className={stylesSale.flexContainerBottom}>
                  <div className={stylesSale.ethSection}>
                    <h1>{price && price.toFixed(2)} ETH</h1>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Atropos>
    </Link>
  );
};

export const NFTCardContainer = ({
  id,
  name,
  color,
  number,
  expiry,
  price,
  onSale,
  taretBlank,
}) => {
  const [fontSizeAmount, setFontSizeAmount] = useState("17");
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
    // if (name) {
    //   if (name.length < 10) {
    //     setFontSizeAmount(`${width < 350 ? "17.6" : "20"}`);
    //   } else if (name.length > 9 && name.length < 15) {
    //     setFontSizeAmount(`${width < 350 ? "16" : "17"}`);
    //   } else {
    //     setFontSizeAmount(`${width < 350 ? "12.8" : "12"}`);
    //   }
    // }
    // eslint-disable-next-line
  }, [name]);
  //
  //

  const { whiteBorders } = useSelector((state) => state.minting);

  return (
    <div
      className={`${stylesSale.recentlyBoxContainer} recentlyContainer`}
      style={{
        borderColor: `${whiteBorders.includes(color) ? "#1c1c1c" : color}`,
        textDecoration: "none",
        background: "#000",
      }}
    >
      <div className={stylesSale.containerContent}>
        <div
          className="recentlyHeader"
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
            {number}
          </div>
        </div>
        <Link href={`/gallery/color-nft/${id}`} passHref>
          <a className={stylesSale.gridItem} target={taretBlank && "_blank"}>
            <>
              <div
                className={`${stylesSale.backgroundBoxContainer} backgroundContainer`}
                style={{ background: `${color}` }}
              ></div>
              {/* </Atropos> */}
              <div
                className="recentlyHeader"
                style={{
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
        {onSale ? (
          <div className={stylesSale.bottomPart}>
            <div
              className={stylesSale.colorBoxTime}
              style={{ marginBottom: "-10px" }}
            >
              <div className={stylesSale.colorBoxProcessBar}>
                <AiFillClockCircle size={isMobile ? 10 : 15} />
              </div>
              <span>Expiry {expiry}</span>
            </div>
            <div className={stylesSale.colorDetails}>
              <div
                className={`${stylesSale.flexContainerBottom} ${stylesSale.saleText} `}
              >
                <h1>{price}</h1>
                <Link href={`/gallery/color-nft/${id}?buy=true`} passHref>
                  <div className={stylesSale.buyButton}> BUY</div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={stylesSale.bottomPart}>
            <div className={stylesSale.colorDetails}>
              <h4 style={{ color: "#FFF", margin: "0", fontWeight: "300" }}>
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
