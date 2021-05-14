import PuffLoader from "react-spinners/PuffLoader";
import randomColor from "randomcolor";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { useTable } from "react-table";
import styled from "styled-components";
import styles from "../../styles/modules/gallery/Sales.module.css";
import { io } from "socket.io-client";
import { SOCKET_URL, TokenAddressList, API_URL } from "../../utils/constants";
import stylesFilter from "../../styles/modules/gallery/sort.module.css";
import { BsSearch } from "react-icons/bs";
import Web3 from "web3";
import { ethers } from "ethers";
import axios from "axios";
import moment from "moment";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import { isMobile } from "react-device-detect";
const Web3Utils = require("web3-utils");

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={i}>
              {row.cells.map((cell, index) => {
                return (
                  <td {...cell.getCellProps()} key={index}>
                    {" "}
                    <a
                      href={`https://color.museum/gallery/color-nft/${Web3Utils.hexToNumber(
                        `0x${row.values.hex.slice(1, row.values.hex.length)}`
                      )}`}
                    // target="_blank"
                    >
                      {cell.render("Cell")}
                    </a>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const RecentTradesTable = ({ tableSearch, setTableSearch }) => {
  //
  //
  useEffect(() => {
    getUSDPrice();
    initialSalesData();
    const socket = io(SOCKET_URL);
    // socket.on('connect', () => console.log(`Socket Id: ${socket.id}`));
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("sales", (data) => {
      makeSalesDataFormat(JSON.parse(data));
    });
    // socket.on('disconnect', () => s.log('server disconnected'));
  }, []);

  var usdPrice = 1000;

  const initialSalesData = async () => {
    // Get current sale
    var currentResult = await axios({
      method: "GET",
      url: `${API_URL}/orders/sales`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    makeSalesDataFormat(await currentResult.data);
  };

  const getUSDPrice = async () => {
    // Get usd price
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
  };

  const makeSalesDataFormat = (saleList) => {
    getUSDPrice();

    saleList.sort(function (a, b) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (saleList.length == 0) setHasMore(false);
    if (saleList.length != salesNFTs.length) {
      for (var i = 0; i < saleList.length; i++) {
        for (var j = 0; j < allReceivedData.length; j++) {
          var item = allReceivedData[j];
          if (item.uint256 == saleList[i].erc721TokenId) {
            saleList[i].hex = item.hex;
            saleList[i].name = item.name;
            saleList[i].price =
              convertFloat(
                (
                  getBigNumber(saleList[i].erc20TokenAmount).add(
                    getBigNumber(saleList[i].fee)
                  ) /
                  Math.pow(
                    10,
                    decimalForCurrency[
                    TokenAddressList.indexOf(saleList[i].erc20Token)
                    ]
                  )
                ).toFixed(10)
              ) +
              " " +
              currencyArray[TokenAddressList.indexOf(saleList[i].erc20Token)];
            saleList[i].change = getChange(saleList[i], saleList);
          }
        }
      }
      setSaleNFTs(saleList);

      if (autoLoadCard.length >= salesNFTs.length) {
        setHasMore(false);
      }
    }
  };

  const getChange = (saleOrder, saleList) => {
    var prevSaleOrder;
    var prevSaleOrderPrice;
    var currentSaleOrderCurrency =
      currencyArray[TokenAddressList.indexOf(saleOrder.erc20Token)];
    var currentSaleOrderPrice;
    if (
      currentSaleOrderCurrency == "ETH" ||
      currentSaleOrderCurrency == "WETH"
    ) {
      currentSaleOrderPrice = convertFloat(
        (
          getBigNumber(saleOrder.erc20TokenAmount).add(
            getBigNumber(saleOrder.fee)
          ) /
          Math.pow(
            10,
            decimalForCurrency[TokenAddressList.indexOf(saleOrder.erc20Token)]
          )
        ).toFixed(10)
      );
    } else {
      currentSaleOrderPrice =
        convertFloat(
          (
            getBigNumber(saleOrder.erc20TokenAmount).add(
              getBigNumber(saleOrder.fee)
            ) /
            Math.pow(
              10,
              decimalForCurrency[TokenAddressList.indexOf(saleOrder.erc20Token)]
            )
          ).toFixed(10)
        ) / usdPrice;
    }
    const saleIdList = saleList.filter((order) => {
      return order.erc721TokenId == saleOrder.erc721TokenId;
    });

    saleIdList.sort(function (a, b) {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    if (saleIdList.indexOf(saleOrder) >= 1) {
      // Get Presale Price
      prevSaleOrder = saleIdList[saleIdList.indexOf(saleOrder) - 1];
      var prevSaleOrderCurrency =
        currencyArray[TokenAddressList.indexOf(prevSaleOrder.erc20Token)];
      if (prevSaleOrderCurrency == "ETH" || prevSaleOrderCurrency == "WETH")
        prevSaleOrderPrice = convertFloat(
          (
            getBigNumber(prevSaleOrder.erc20TokenAmount).add(
              getBigNumber(prevSaleOrder.fee)
            ) /
            Math.pow(
              10,
              decimalForCurrency[
              TokenAddressList.indexOf(prevSaleOrder.erc20Token)
              ]
            )
          ).toFixed(10)
        );
      else
        prevSaleOrderPrice =
          convertFloat(
            (
              getBigNumber(prevSaleOrder.erc20TokenAmount).add(
                getBigNumber(prevSaleOrder.fee)
              ) /
              Math.pow(
                10,
                decimalForCurrency[
                TokenAddressList.indexOf(prevSaleOrder.erc20Token)
                ]
              )
            ).toFixed(10)
          ) / usdPrice;
    } else {
      // Get Mint Price
      const prevSaleOrder = allReceivedData.filter((order) => {
        return order.uint256 == saleOrder.erc721TokenId;
      });
      prevSaleOrderPrice = prevSaleOrder[0].price_in_eth;
    }

    const salePriceChange =
      ((currentSaleOrderPrice - prevSaleOrderPrice) / prevSaleOrderPrice) * 100;

    return salePriceChange;
  };

  const TableColorNotext = (prop) => {
    return (
      <div className={styles.tableColorDiv}>
        <div
          style={{ background: prop.value, position: "relative" }}
          className={styles.backgroundColor}
        ></div>
      </div>
    );
  };
  const TableName = ({ value }) => {
    return (
      <div className={styles.tableNameDiv}>
        <p>{value}</p>
      </div>
    );
  };
  const TablePriceDoller = ({ value }) => {
    return (
      <div className={styles.tablePriceDiv}>
        <p>{value}</p>
      </div>
    );
  };
  const TablePriceChange = ({ value }) => {
    return (
      <div className={styles.tablePriceETH}>
        {value >= 0 ? (
          <BiUpArrow style={{ fontSize: "1.2rem", color: "#05b927" }} />
        ) : (
          <BiDownArrow style={{ fontSize: "1.2rem", color: "#bf0000" }} />
        )}
        {value >= 0 ? (
          <p style={{ color: "#05b927" }}> {Math.abs(value.toFixed(0))}%</p>
        ) : (
          <p style={{ color: "#bf0000" }}> {Math.abs(value.toFixed(0))}%</p>
        )}
      </div>
    );
  };
  const TableBuyer = ({ value }) => {
    return (
      <div className={styles.tableBuyerDiv}>
        <span className={styles.onlineDot}>0x</span>{" "}
        <p>
          {value.substring(0, 5)}...
          {value.substring(value.length - 3)}
        </p>
      </div>
    );
  };

  const TableSeller = ({ value }) => {
    return (
      <div className={styles.tableBuyerDiv}>
        <span className={styles.onlineDot}>0x</span>{" "}
        <p>
          {value.substring(0, 5)}...
          {value.substring(value.length - 3)}
        </p>
      </div>
    );
  };
  const TableDate = ({ value }) => {
    return (
      <div className={styles.tableDateDiv}>
        <p className={styles.dateFontSize}>{moment(value).fromNow()} ago</p>
      </div>
    );
  };

  const TableLink = ({ value }) => {
    return (
      <div className={styles.tableLink}>
        <div className={styles.colorTx}>
          <a href={`https://etherscan.io/tx/${value}`}>
            <img src={"/images/arrow.png"} alt="Sold" />
          </a>
        </div>
      </div>
    );
  };

  const columnsOld = useMemo(() => [
    {
      Header: "Color",
      accessor: "hex",
      Cell: TableColorNotext,
      columnld: 0,
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: TableName,
      columnld: 1,
    },
    {
      Header: "Hexadecimal",
      // Cell: TableHex,
      Cell: (props) => (
        <>
          <p className={`${styles.hexadecimal} item title`}>
            {props.row.original.hex}
          </p>
        </>
      ),
      columnld: 2,
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: TablePriceDoller,
      columnld: 3,
    },
    {
      Header: "Change",
      accessor: "change",
      Cell: TablePriceChange,
      columnld: 4,
    },
    {
      Header: "Buyer",
      accessor: "buyer",
      Cell: TableBuyer,
      columnld: 5,
    },
    {
      Header: "Seller",
      accessor: "seller",
      Cell: TableSeller,
      columnld: 6,
    },
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: TableDate,
      columnld: 7,
    },
    {
      Header: "TX",
      accessor: "txHash",
      Cell: TableLink,
      columnld: 8,
    },
  ]);

  const { allReceivedData } = useSelector((state) => state.data);
  // auto load
  const [autoLoadCard, setAutoLoadCard] = useState(Array.from({ length: 20 }));
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = () => {
    if (autoLoadCard.length >= salesNFTs.length) {
      setHasMore(false);
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    setTimeout(() => {
      setAutoLoadCard(autoLoadCard.concat(Array.from({ length: 20 })));
    }, 500);
  };

  //  auto add
  const [salesNFTs, setSaleNFTs] = useState([]);
  const [filterdSalesNFTs, setFilteredSalesNFTs] = useState([]);
  const [amount, setAmount] = useState(20);
  const [isOnHover, setIsOnHover] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (!salesNFTs) {
        setLoader(true);
      } else {
        setLoader(false);
      }
    }, 100);
  }, [loader]);

  var gamePattern = [];

  var randomChosenColour = randomColor();
  gamePattern.push(randomChosenColour);

  const randomItems = filterdSalesNFTs.slice(0, autoLoadCard.length);
  const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
  const decimalForCurrency = [18, 18, 6, 18, 6];
  const web3 = new Web3();

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
    if (!salesNFTs) return;

    if (tableSearch && tableSearch !== "") {
      const data =
        salesNFTs &&
        salesNFTs.filter((item) => {
          return (
            item.hex.toLowerCase().includes(tableSearch.toLowerCase()) ||
            item.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
            // item.nftNo.toString().startsWith(search) ||
            // item.base_color_name
            //   .toLowerCase()
            //   .startsWith(search.toLowerCase()) ||
            item.erc20Token.toString().startsWith(tableSearch) ||
            item.seller.toString().startsWith(tableSearch) ||
            item.buyer.toString().startsWith(tableSearch) ||
            item.txHash.toString().startsWith(tableSearch)
          );
        });
      setFilteredSalesNFTs(data);
    } else {
      setFilteredSalesNFTs(salesNFTs);
    }
  }, [tableSearch, salesNFTs]);

  return (
    <Article>
      <div className={`${isOnHover && styles.tableDiv} table-main-div`}>
        <InfiniteScroll
          dataLength={autoLoadCard.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div
              style={{
                width: "100%",
                height: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PuffLoader color="#fff" size={100} />
            </div>
          }
          height={570}
          endMessage={
            salesNFTs.length === 0 ?
              <div className={styles.emptyText}>
                <PuffLoader color="#fff" size={30} />
                <h2>No sales yet.</h2>
              </div>
              :
              null
          }
        >
          <div className={styles.onDesktop}>
            <Table columns={columnsOld} data={randomItems} />
            {salesNFTs.length !== 0 &&
              <div
                className={`${stylesFilter.filterForm}`}
                style={{ marginTop: "15px" }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // saveToDBForTable();
                  }}
                >
                  <div className={stylesFilter.bsContainer}>
                    <BsSearch className={stylesFilter.bsSearch} />
                  </div>
                  <input
                    placeholder="Search by Name, Hex, Category, No., TokenID"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                  {/* {amountOfResults.length > 0 && (
                      <div className={styles.formSerachLenght}>
                        {amountOfResults.length}{" "}
                        {amountOfResults.length > 1 ? "Results" : "Result"}
                      </div>
                    )} */}
                </form>
              </div>
            }
          </div>
          {loader ? (
            <div
              style={{
                width: "100%",
                height: loader ? "250px" : "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* {isMobile &&
                <PuffLoader color="#fff" size={50} />
              } */}
            </div>
          ) : (
            filterdSalesNFTs &&
            filterdSalesNFTs.map((item, index) => {
              return (
                <div className={styles.onMobile}>
                  <div
                    className={`${styles.tableMobile}`}
                    style={{ position: "relative" }}
                  >
                    <div className={styles.tableHeaderMobile}>
                      <h5 className={styles.headerContentMobile}>Color</h5>
                      <h5 className={styles.headerContentMobile}>Price</h5>
                      <h5
                        className={`${styles.headerContentMobile} ${styles.alignRight}`}
                      >
                        Buyer
                      </h5>
                    </div>
                    <a
                      href={`https://color.museum/gallery/color-nft/${Web3Utils.hexToNumber(
                        `0x${item.hex.slice(1, item.hex.length)}`
                      )}`}
                      target="_blank"
                      key={index}
                    >
                      <div className={styles.contentDataMobile}>
                        <div className={styles.contentCenter}>
                          <div
                            className={styles.colorBox}
                            style={{
                              background: item.hex,
                            }}
                          ></div>
                          <div className={styles.colorBoxText}>
                            <p>{item.hex}</p>
                          </div>
                        </div>
                        <div className={styles.contentCenterGrid}>
                          <div className={styles.contentCenter}>
                            <h6
                              style={{ marginRight: "5px" }}
                              className={styles.priceFontSize}
                            >
                              {item.price}
                            </h6>
                          </div>{" "}
                          <div className={styles.contentCenter}>
                            {item.change >= 0 ? (
                              <BiUpArrow
                                style={{ marginRight: "2px", color: "#05b927" }}
                              />
                            ) : (
                              <BiDownArrow
                                style={{ marginRight: "2px", color: "#bf0000" }}
                              />
                            )}
                            {item.change >= 0 ? (
                              <p style={{ color: "#05b927" }}>
                                {" "}
                                {Math.abs(item.change.toFixed(0))}%
                              </p>
                            ) : (
                              <p style={{ color: "#bf0000" }}>
                                {" "}
                                {Math.abs(item.change.toFixed(0))}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          className={`${styles.contentCenter} ${styles.alignRight} ${styles.onlineDotDiv}`}
                        >
                          <span className={styles.onlineDot}>0x</span>{" "}
                          <p>
                            {item.buyer.substring(0, 5)}...
                            {item.buyer.substring(item.buyer.length - 3)}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`${styles.contentDataMobile} ${styles.contentDataBottomRow}`}
                      >
                        <div className={styles.soldByDiv}>
                          <p>Sold by </p>
                          <span className={styles.onlineDot}>0x</span>{" "}
                          <p>
                            {item.seller.substring(0, 5)}...
                            {item.seller.substring(item.buyer.length - 3)}
                          </p>
                        </div>
                        <div
                          className={`${styles.contentCenter} ${styles.alignRight} ${styles.contentDate}`}
                        >
                          <p>{moment(item.createdAt).fromNow()} ago</p>
                          <a
                            href={`https://etherscan.io/tx/${item.txHash}`}
                            className={styles.txIcon}
                          >
                            <img src={"/images/arrow.png"} alt="Sold" />
                          </a>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </InfiniteScroll>
      </div>
    </Article>
  );
};

export default RecentTradesTable;

const Article = styled.section`
  width: 100%;
  color: #fff;
  .table-main-div {
    p {
      margin: 0;
      font-family: "Sen", sans-serif;
      font-display: swap;
      font-weight: 400;
      font-style: normal;
      font-size: 20px;
      line-height: 20px;
      color: #fff;
    }
    .ActivityView_tablePriceETH__5wy96 img {
      width: 20px;
    }
    .ActivityView_backgroundColor__1Cz_a {
      width: 50px;
      height: 35px;
    }
    .both-table-div {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      align-items: self-start;
      position: relative;
      :before {
        content: "";
        position: absolute;
        width: 5px;
        height: 100%;
        top: 0;
        right: 50%;
        bottom: 0;
        z-index: 999;
        background: #100f0f;
        @media (max-width: 1000px) {
          display: none;
        }
      }
      tbody tr td:last-of-type div p {
        font-size: 0.6rem !important;
      }
      table:nth-child(1) {
        border-right: 0;
      }
      @media (max-width: 1000px) {
        grid-template-columns: repeat(1, 1fr);
        gap: 0;
      }
    }
    table {
      width: 100%;
      border-spacing: 0;
      position: relative;
      padding: 0 20px 20px;
      thead {
        position: sticky;
        top: 0;
        left: 0;
        background: #000;
        z-index: 10;
      }

      @media (max-width: 1000px) {
        display: block;
        overflow: auto;
        padding: 0 5px 0 5px;
      }
    }
    thead th {
      font-family: "Sen", sans-serif !important;
      font-display: swap;
      font-weight: 400;
      font-size: 17px;
      line-height: 100%;
      color: #ffffff;
      margin: 0 0 0 0;
      font-weight: 400;
      min-width: 10%;
      width: 10%;
      text-transform: capitalize;
      background: #000;
    }
    thead tr:nth-child(1) th {
      border-bottom: 0;
    }

    tbody tr:hover {
      background: #1b1b1b;
    }
    tr th:nth-child(1) {
      width: 5%;
    }
    tr th:nth-child(2) {
      width: 9%;
    }
    tr th:nth-child(3) {
      width: 9%;
    }
    tr th:nth-child(4) {
      width: 7%;
    }
    tr th:nth-child(5) {
      width: 7%;
    }
    tr th:nth-child(6) {
      width: 12%;
    }
    tr th:nth-child(7) {
      width: 12%;
    }
    tr th:nth-child(8) {
      width: 8%;
    }
    tr th:nth-child(9) {
      width: 3%;
    }
    th {
      padding-top: 20px !important;
      padding-bottom: 20px !important;
      text-align: left;
      font-family: Sen, sans-serif !important;
      font-display: swap;
      font-size: 1rem;
      line-height: 100%;
      color: #fff;
      margin: 0;
      font-weight: 400;
      min-width: 10%;
      width: 10%;
      text-transform: capitalize;
    }
    tr:first-of-type th {
      border-bottom: 0.25px solid #363636 !important;
    }
    th,
    td {
      margin: 0;
      border-bottom: 0.25px solid #363636;
      :last-child {
        border-right: 0;
        text-align: right;
      }
      @media (max-width: 1920px) {
        padding: 0px 10px;
      }
      @media (max-width: 1000px) {
        padding: 5px 5px;
        &:nth-child(3) {
          padding: 5px 0px 5px 2px;
        }
        &:nth-child(7) {
          text-align: right;
        }
        &:nth-child(4),
        &:nth-child(6),
        &:nth-child(8) {
          padding: 0;
        }
      }
    }
  }
  @media (max-width: 1450px) {
    .table-main-div {
      p {
        font-size: 11px !important;
      }
      border-left: 0;
      border-right: 0;
    }
  }
  @media (max-width: 1000px) {
    padding: 0;
    .table-main-div thead th {
      font-size: 11px;
    }
    .ActivityView_backgroundColor__1Cz_a {
      width: 30px !important;
      height: 23px !important;
    }
    .table-main-div tr th:nth-child(4),
    .table-main-div tr th:nth-child(6),
    .table-main-div tr th:nth-child(8) {
      width: 0%;
    }
    .table-main-div tr th:nth-child(3) {
      width: 20%;
    }
    .table-main-div tr th:nth-child(2) {
      width: 5%;
    }
    .table-main-div tr th:nth-child(7) {
      width: 25%;
      text-align: right;
    }
  }
`;
