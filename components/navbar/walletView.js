import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { SiEthereum } from "react-icons/si";
import { isMobile } from "react-device-detect";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ConnectAddress,
  LocalStorage,
  PendingConnect,
} from "../../store/actions/toggle";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { PROVIDER_FOR_WEB3 } from "../../utils/constants";
import { Tooltip } from "react-tippy";
import "react-tippy/dist/tippy.css";
import { useRouter } from "next/router";

const walletView = ({ walletIsOpen, setWalletIsOpen }) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const [loader, setLoader] = useState(false);
  const [receivedNfts, setReceivedNfts] = useState();
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
    if (connectedAddress) {
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": "color_sk_knpt1iz27hto0d0a",
        },
      };
      const handleToken = async () => {
        await axios(
          `https://api.simplehash.com/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${connectedAddress}`,
          options
        ).then((res) => {
          setLoader(true);
          setReceivedNfts(res.data.nfts);
          handleNext(res.data.next);
        });
      };
      handleToken();
    }
  }, [connectedAddress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (walletIsOpen) {
        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "x-api-key": "color_sk_knpt1iz27hto0d0a",
          },
        };
        const handleToken = async () => {
          await axios(
            `https://api.simplehash.com/api/v0/nfts/owners?chains=ethereum&wallet_addresses=${connectedAddress}`,
            options
          ).then((res) => {
            setLoader(true);
            setReceivedNfts(res.data.nfts);
            handleNext(res.data.next);
          });
        };
        handleToken();
        console.log("first");
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [walletIsOpen]);

  const router = useRouter();

  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const disconnect = () => {
    localStorage.removeItem("connectedAddress");
    deactivate();
    dispatch(LocalStorage());
    dispatch(ConnectAddress(""));
    dispatch(PendingConnect(false));
    localStorage.removeItem("userSignature");
    localStorage.removeItem("connectedAddress");
    localStorage.removeItem("color_museum_wallet_type");
    localStorage.removeItem("color_museum_wallet_expiry");
    localStorage.removeItem("userData");
    localStorage.removeItem("userWalletAccountData");
    setWalletIsOpen(false);
    let userData = localStorage.getItem("userData");
    if (window.dataLayer && userData) {
      window.dataLayer.push({
        event: "wallet-disconnected",
        page_location: router.asPath, // existing page url should pass here.
      });
    }
  };

  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_FOR_WEB3));
  const [ethValue, setEthValue] = useState("0.00");
  useEffect(() => {
    if (connectedAddress) {
      const handle = async () => {
        let value = await web3.eth.getBalance(connectedAddress);
        value = web3.utils.fromWei(value, "ether");
        setEthValue(value === "0" ? "0.00" : value.slice(0, 4));
      };
      handle();
      const constantCheck = setInterval(() => {
        handle();
      }, 5000);
      return () => clearInterval(constantCheck);
    }
  }, [connectedAddress]);

  const [baseCollections, setBaseCollections] = useState();
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

  const [usdValue, setUsdValue] = useState("0.00");
  useEffect(() => {
    const handle = async () => {
      await axios(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      ).then((res) => setUsdValue(res.data.USD * ethValue));
    };
    handle();
  }, [ethValue]);

  return (
    <>
      {" "}
      <SlidingPane
        closeIcon={<IoIosArrowBack />}
        className={styles.newSlideContainer}
        overlayClassName="some-custom-overlay-class"
        isOpen={walletIsOpen}
        title={
          <div className={styles.newPurchaseTitle}>
            <span className={styles.headTitleText}>Wallet</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoCloseSharp
                size={30}
                onClick={() => {
                  setWalletIsOpen(false);
                }}
              />
            </div>
          </div>
        }
        width={isMobile ? "100%" : "30%"}
        onRequestClose={() => {
          setWalletIsOpen(false);
        }}
      >
        <div style={{ padding: "0 10px" }}>
          <div>
            <div className={styles.flexContainer}>
              <div className={styles.greenCircle} />
              <h1>
                {connectedAddress.substring(0, 6)}...
                {connectedAddress.substring(connectedAddress.length - 6)}
              </h1>
              <div style={{ marginLeft: "0.5rem" }}>
                <Tooltip
                  title={"Ethereum mainnet"}
                  position="top"
                  trigger="mouseenter"
                  arrow
                  size={"big"}
                  interactive={true}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <SiEthereum style={{ fontSize: "1.25rem" }} />
                </Tooltip>
              </div>
            </div>
            <div className={styles.fund_main_div}>
              <h2 className={styles.fundTitle}>Funds</h2>
              <div
                className={styles.priceDiv}
                style={{ alignItems: "flex-end", marginBottom: "1rem" }}
              >
                <h2 className={styles.ethValue}>{ethValue}</h2>
                <div
                  className={styles.priceDiv}
                  style={{ alignItems: "center" }}
                >
                  <h3 className={styles.ethValueEth}>ETH</h3>
                  <div className={styles.whiteCircle} />
                  <h4 style={{ margin: "0", fontSize: "1.5rem" }}>
                    ${Number(usdValue).toFixed(1)} USD
                  </h4>
                </div>
              </div>
              <a
                className={styles.coinbasePay}
                href={"https://coinbase.com"}
                target="_blank"
              >
                <img src={"/images/button-image.png"} alt="button image" />
              </a>
              {filteredData && filteredData.length > 0 && (
                <>
                  <div className={styles.fundListTitle}>
                    <h2 className={styles.itemsTitle}>Items</h2>
                    <h3 className={styles.itemsCollection}>
                      {receivedNfts && receivedNfts.length}
                      {receivedNfts && receivedNfts.length > 1
                        ? " Items"
                        : " Item"}
                    </h3>
                    <h3 className={styles.itemsCollection}>
                      <div className={styles.whiteCircle} />
                      {baseCollections && baseCollections.length}
                      {baseCollections && baseCollections.length > 1
                        ? " Collections"
                        : " Collection"}
                    </h3>
                  </div>
                  <div className={styles.gridContainer}>
                    {filteredData &&
                      filteredData.slice(0, 18).map((item, i) => {
                        if (
                          item.contract_address ===
                          "0xcF12413F738AD3a14B9810bA5f86E59fcd9BaaDf"
                        ) {
                          return (
                            <Link href={`/gallery/color-nft/${item.token_id}`}>
                              <div
                                onClick={() => {
                                  setWalletIsOpen(false);
                                }}
                                style={{
                                  width: "100%",
                                  height: "55px",
                                  background: item.extra_metadata.hex,
                                  cursor: "pointer",
                                }}
                              />
                            </Link>
                          );
                        } else {
                          return (
                            <img
                              src={item.previews.image_medium_url}
                              alt={item.name}
                              key={i}
                              className={styles.imageGrid}
                              onClick={() => {
                                setWalletIsOpen(false);
                              }}
                            />
                          );
                        }
                      })}
                  </div>
                  {filteredData && filteredData.length > 18 && (
                    <Link passHref href={`/${connectedAddress}`}>
                      <a
                        className={styles.viewButton}
                        onClick={() => {
                          setWalletIsOpen(false);
                        }}
                      >
                        View All
                      </a>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <button
            className={styles.disconnectButton}
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      </SlidingPane>
    </>
  );
};

export default walletView;
