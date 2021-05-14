import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/nav.module.css";
import { PriceToMint, Toggle } from "../../store/actions/toggle";
import { DiscountApplied } from "../../store/actions/updateMint";
import {
  SMARTCONTRACTADDR,
  PROVIDER_FOR_WEB3,
  WALLET_EXPIRY_TIME,
  PROVIDER,
  DISCOUNT_PRICE,
} from "../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import ConnectPage from "../Connect/Connect";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useENSName } from "use-ens-name";
import SlideConnectWallet from "./SlideConnectWallet";
import { isMobile } from "react-device-detect";
import { RiWallet3Fill } from "react-icons/ri";
import { BsFillGearFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import {
  injected,
  walletLink,
  walletConnectConnector,
} from "../../utils/connector";
import AddEmailToAccount from "./AddEmailToAccount";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI";
import { REAL_MODE, knock_publicKey } from "../../utils/constants";
import axios from "axios";
import Knock from "@knocklabs/client";
const knockClient = new Knock(knock_publicKey);
import PuffLoader from "react-spinners/PuffLoader";
import { TbBell } from "react-icons/tb";
import WalletView from "./walletView";
// Required CSS import, unless you're overriding the styling
import "@knocklabs/react-notification-feed/dist/index.css";
import { useRouter } from "next/router";
import {
  ConnectAddress,
  LocalStorage,
  Web3Provider,
  PendingConnect,
} from "../../store/actions/toggle";
import toast from "react-hot-toast";
import KnockSlider from "../knockSlider/KnockSlider";
import { notificationOn } from "../../store/actions/notification";
import SlideNavigate from "./SlideNavigate";
import disableScroll from "disable-scroll";

const Index = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { account, activate, library, deactivate } = useWeb3React();
  const { fullWidthPage } = useSelector((state) => state.toggle);

  const [name, setName] = useState("/");
  const { pendingConnect, connectedAddress, warnActive, applied } = useSelector(
    (state) => state.minting
  );
  const { localStorageChange } = useSelector((state) => state.toggle);
  const backendUrl = `https://accounts.color.museum/`;
  useEffect(async () => {
    if (window.location.pathname) {
      setName(window.location.pathname);
    } else setName("/");
  }, []);
  const makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  console.log("data");
  const activateInjectedProvider = (providerName) => {
    console.log("providerName", providerName);
    const { ethereum } = window;

    if (!ethereum?.providers) {
      return undefined;
    }

    let provider;
    if (providerName == "CoinBase") {
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }) => isCoinbaseWallet
      );
    }
    if (providerName == "MetaMask") {
      console.log("provider", provider);
      provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
    }

    if (provider) {
      ethereum.setSelectedProvider(provider);
    }
  };
  const { logout } = useSelector((state) => state.toggle);
  useEffect(async () => {
    console.log("index's account is changed");
    const userData = localStorage.getItem("userData");
    if (!account || !library || userData == null) return false;
    var chainID = await library.eth.getChainId();
    if (!(chainID == (REAL_MODE ? 1 : 3))) {
      if (connectedAddress) {
        dispatch(ConnectAddress(""));
      }
      dispatch(PendingConnect(false));
      return false;
    }
    if (account !== undefined && !logout) {
      const rlt = await installSiteAccount();
      if (rlt == 2) {
        console.log("dispatch here2");
        dispatch(ConnectAddress(account));
        toast(
          <div className={"toastComman"}>
            Wallet is connected.
            <IoClose
              size={25}
              onClick={(t) => {
                toast.dismiss(t.id);
              }}
            />
          </div>,
          {
            style: {
              border: "1px solid #00FF0A",
            },
          }
        );
      } else if (rlt == false) {
        console.log("failed_connect_coinbaseWallet!");
        localStorage.removeItem("connectedAddress");
        deactivate();
        dispatch(LocalStorage());
        dispatch(ConnectAddress(""));
        localStorage.removeItem("userSignature");
        localStorage.removeItem("connectedAddress");
        localStorage.removeItem("color_museum_wallet_type");
        localStorage.removeItem("color_museum_wallet_expiry");
        localStorage.removeItem("userWalletAccountData");
        localStorage.removeItem("userData");
      } else {
        const wallet_expiry = localStorage.getItem(
          "color_museum_wallet_expiry"
        );
        const wallet_type = localStorage.getItem("color_museum_wallet_type");
        const user_data = localStorage.getItem("userData");
        if (wallet_type == null) return;
        if (
          wallet_expiry == null ||
          Number(wallet_expiry) < Math.floor(new Date().getTime() / 1000) ||
          user_data == null
        )
          return;
        dispatch(ConnectAddress(account));
      }
    }
    dispatch(PendingConnect(false));
  }, [account, logout]);

  const buildSignature = async () => {
    const random_key = makeid(30);
    try {
      const sign = await ethereum.request({
        method: "personal_sign",
        params: [
          "Returning address: signature login required.",
          account,
          random_key,
        ],
      });
      return { sign: sign, error: null };
    } catch (error) {
      return { error: error, sign: null };
    }
  };

  const installSiteAccount = async () => {
    const random_id = makeid(30);
    const connectedAddressLocal = localStorage.getItem("connectedAddress");
    if (connectedAddressLocal == account && account !== undefined) {
      return 1;
    }
    localStorage.setItem("connectedAddress", account);
    localStorage.setItem("userWalletAccountData", account);
    if (account !== undefined) {
      let {
        data: { status: status, data: users, error },
      } = await axios.post(`${backendUrl}getUserByAddress`, {
        address: account,
      });
      console.log("users", users);
      if (users.length > 0) {
        let sign = localStorage.getItem("userSignature");
        if (connectedAddressLocal != account && connectedAddressLocal)
          dispatch(ConnectAddress(""));
        // if (
        //   !sign ||
        //   (connectedAddressLocal != account && connectedAddressLocal)
        // ) {
        //   console.log("signing started!");
        //   let resultSign = await buildSignature();
        //   console.log("result", resultSign);
        //   if (resultSign.error) return false;
        //   sign = resultSign.sign;
        //   localStorage.setItem("userSignature", sign);
        // }
        // let {
        //   data: { status: statusAccount, data: accounts, error },
        // } = await axios.post(`${backendUrl}getAccountByUserId`, {
        //   address: account,
        //   userID: users[0].id,
        //   signature: sign,
        // });
        let {
          data: { status: statusAccount, data: accounts, error },
        } = await axios.post(`${backendUrl}getAccountByUserIdNonSignature`, {
          address: account,
          userID: users[0].id
        });
        if (statusAccount != "success") return false;
        if (accounts.length > 0) {
          localStorage.setItem("userData", JSON.stringify(accounts[0]));
          localStorage.setItem("userWalletAccountData", account);
          dispatch(LocalStorage());
        } else {
          let insertObject = {};
          insertObject["knock_id"] = random_id;
          insertObject["user_id"] = users[0].id;
          // sign up to knock site
          await knockClient.users.identify(random_id, {
            name: random_id,
            // email: elements.email.value,
          });
          const {
            data: { status: statusCreateUser, data: data1, error: error1 },
          } = await axios.post("https://accounts.color.museum/createUser", {
            insertObject: insertObject,
          });
          if (error1 || statusCreateUser != "success") {
            console.log(error1);
          } else {
            localStorage.setItem("userWalletAccountData", account);
            localStorage.setItem("userData", JSON.stringify(data1[0]));
          }
        }
      } else {
        return false;
      }
    }
    return 2;
  };

  const removeLocalStorageData = () => {
    localStorage.removeItem("connectedAddress");
  };

  const [checkWalletConnectionPassed, setCheckWalletConnectionPassed] =
    useState(false);

  useEffect(() => {
    if (checkWalletConnectionPassed) {
      console.log(checkWalletConnectionPassed, "checkWalletConnectionPassed");
      checkIfDisconnect();
    }
  }, [checkWalletConnectionPassed]);

  useEffect(async () => {
    console.log("I am built");
    checkWalletConnectionPassed = false;
    const wallet_type = localStorage.getItem("color_museum_wallet_type");
    const wallet_expiry = localStorage.getItem("color_museum_wallet_expiry");
    const signature = localStorage.getItem("userSignature");
    const userData = localStorage.getItem("userData");
    const connectedAddressLocal = localStorage.getItem("connectedAddress");
    setTimeout(async () => {
      if (connectedAddress != "" || library != null || !signature) {
        dispatch(PendingConnect(false));
        return;
      }
      // let connected_Address = localStorage.getItem("userWalletAccountData");
      if (wallet_type == null) {
        dispatch(PendingConnect(false));
        return;
      }
      if (
        wallet_expiry == null ||
        Number(wallet_expiry) < Math.floor(new Date().getTime() / 1000)
      ) {
        dispatch(PendingConnect(false));
        localStorage.removeItem("connectedAddress");
        localStorage.removeItem("color_museum_wallet_type");
        localStorage.removeItem("color_museum_wallet_expiry");
        localStorage.removeItem("userSignature");
        localStorage.removeItem("userWalletAccountData");
        return;
      }
      removeLocalStorageData();
      switch (Number(wallet_type)) {
        case 1:
          await connectToMetaMask();
          break;
        case 2: // coinbase
          await connectToCoinbaseWallet();
          break;
        case 3: // walletConnect
          await connectToWalletConnect();
          break;
      }
      setCheckWalletConnectionPassed(true);
    }, 2000);
  }, []);

  // Mint Discount
  // useEffect(() => {
  //   if (connectedAddress) handleOwnsColors();
  // }, [connectedAddress]);
  // const { priceToMint } = useSelector((state) => state.minting);
  // const handleOwnsColors = async () => {
  //   if (!connectedAddress) return;
  //   const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
  //   const contract = new web3.eth.Contract(
  //     [tokensOfOwnerABI],
  //     SMARTCONTRACTADDR
  //   );
  //   const nfts = await contract.methods.tokensOfOwner(connectedAddress).call();
  //   if (applied) {
  //     if (nfts.length > 0) {
  //       toast(
  //         <div className={"toastComman"}>
  //           30% discount applied.
  //           <IoClose
  //             size={25}
  //             onClick={(t) => {
  //               toast.dismiss(t.id);
  //             }}
  //           />
  //         </div>,
  //         {
  //           style: {
  //             border: "1px solid #00FF0A",
  //           },
  //         }
  //       );
  //       const value = priceToMint * ((100 - DISCOUNT_PRICE) * 0.01);
  //       dispatch(PriceToMint(value.toFixed(2)));
  //       dispatch(DiscountApplied());

  //     }
  //   }
  // };
  // Mint Discount

  useEffect(async () => {
    //when library(wallet) changes
    if (library) {
      if ((await library.eth.getChainId()) == (REAL_MODE ? 1 : 3)) {
        const WEB3 = new Web3(library.givenProvider);
        dispatch(Web3Provider(WEB3)); // set web3 with current library
      }
    }
  }, [library]);
  // Set wallet type and expiry time on local for use this on refresh
  const setWalletInfoOnLocal = async (type) => {
    localStorage.setItem("color_museum_wallet_type", type); //  1 for metamask, 2 for coinbase, 3 for walletConnect
    localStorage.setItem(
      "color_museum_wallet_expiry",
      Math.floor(new Date().getTime() / 1000) + 60 * WALLET_EXPIRY_TIME
    );
    console.log(localStorage.getItem(connectedAddress));
    if (library) console.log("ChainID = ", await library.eth.getChainId());
    if (library && !((await library.eth.getChainId()) == (REAL_MODE ? 1 : 3))) {
      toast(
        <div className={"toastComman"}>
          {`Incorrect chain. Change your wallet chain to ${
            REAL_MODE ? "Ethereum" : "Ropsten"
          }.`}
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
      return false;
    }
  };

  const connectToCoinbaseWallet = async () => {
    try {
      activateInjectedProvider("CoinBase");
      activate(walletLink);
      setWalletInfoOnLocal(2);
    } catch (error) {
      dispatch(PendingConnect(false));
      console.log(error);
    }
  };

  const connectToMetaMask = async () => {
    console.log("I am on metamask!");
    console.log("bibig");
    try {
      activateInjectedProvider("MetaMask");
      await activate(injected);
      setWalletInfoOnLocal(1);
      // dispatch(Connector('Metamask'));
    } catch (error) {
      dispatch(PendingConnect(false));
      console.log("I am on metamask's error!");
      console.error(error);
    }
  };

  const connectToWalletConnect = async () => {
    try {
      await activate(walletConnectConnector);
      setWalletInfoOnLocal(3);
    } catch (e) {
      dispatch(PendingConnect(false));
      console.log(e);
    }
  };

  const [warningPlace, setWarningPlace] = useState(false);
  useEffect(() => {
    if (
      name === "/choose" ||
      name === "/name" ||
      name === "/describe" ||
      name === "/mint" ||
      name.slice(0, 7) === "/change" ||
      name.slice(0, 5) === "/mint"
    ) {
      setWarningPlace(true);
    } else {
      setWarningPlace(false);
    }
  }, [name]);

  //
  //
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_FOR_WEB3));

  const hiddenModal = () => {};
  const [modalShowFlag, setModalShowFlag] = useState("none");
  const [show, setShow] = useState(false);
  const [copyText, setCopyText] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const copyFunction = () => {
    setCopyText(true);
    setTimeout(() => {
      setCopyText(false);
    }, 3000);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const utm_source = queryParams.get("utm_source");
    const utm_medium = queryParams.get("utm_medium");
    const utm_campaign = queryParams.get("utm_campaign");
    const utm_term = queryParams.get("utm_term");
    const utm_content = queryParams.get("utm_content");
    const utm_id = queryParams.get("utm_id");
    if (utm_source) {
      localStorage.setItem("utm_source", utm_source);
    }
    if (utm_medium) {
      localStorage.setItem("utm_medium", utm_medium);
    }
    if (utm_campaign) {
      localStorage.setItem("utm_campaign", utm_campaign);
    }
    if (utm_term) {
      localStorage.setItem("utm_term", utm_term);
    }
    if (utm_content) {
      localStorage.setItem("utm_content", utm_content);
    }
    if (utm_id) {
      localStorage.setItem("utm_id", utm_id);
    }

    let userData = localStorage.getItem("userData");
    if (userData == "undefined") {
      localStorage.removeItem("userData");
    }
    userData = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);

      if (userData.id) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }

    setShow(show);
  }, [show]);

  const closeHandler = (e) => {
    setShow(false);
  };
  const openHandler = (e) => {
    setShow(true);
  };
  //
  //
  const [ethValue, setEthValue] = useState(false);
  const [ensNameFinal, setEnsNameFinal] = useState("");

  const checkIfDisconnect = () => {
    if (!account && connectedAddress) {
      localStorage.removeItem("connectedAddress");
      dispatch(LocalStorage());
      dispatch(ConnectAddress(""));
      dispatch(PendingConnect(false));
      localStorage.removeItem("userSignature");
      localStorage.removeItem("connectedAddress");
      localStorage.removeItem("color_museum_wallet_type");
      localStorage.removeItem("color_museum_wallet_expiry");
      localStorage.removeItem("userData");
      localStorage.removeItem("userWalletAccountData");
    }
  };

  useEffect(async () => {
    if (checkWalletConnectionPassed) {
      if (!account && connectedAddress) {
        checkIfDisconnect();
      }
    }
    if (account) {
      let value = await web3.eth.getBalance(account);
      value = web3.utils.fromWei(value, "ether");
      setEthValue(value.slice(0, 4));
      setCheckWalletConnectionPassed(true);
    }
  }, [account]);

  const ens = useENSName(connectedAddress);
  useEffect(() => {
    if (ens !== null) {
      setEnsNameFinal(ens);
    }
  }, [ens]);

  //
  //

  const [connectWallet, setConnectWallet] = useState(false);
  const [slideMenu, setSlideMenu] = useState(false);
  const { toggle } = useSelector((state) => state.toggle);

  // function disableScrolling() {
  //   var x = window.scrollX;
  //   var y = window.scrollY;
  //   window.onscroll = function () { window.scrollTo(x, y); };
  // }

  // function enableScrolling() {
  //   window.onscroll = function () { };
  // }

  useEffect(() => {
    if (slideMenu) {
      disableScroll.on();
    } else {
      disableScroll.off();
    }
  }, [slideMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (toggle && e.keyCode === 27) {
        dispatch(Toggle());
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  const [addEmail, setAddEmail] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("skipDate") && isMobile) setIsSkipped(true);
  }, [localStorageChange]);
  const contract = new web3.eth.Contract([tokensOfOwnerABI], SMARTCONTRACTADDR);

  const [colorReceived, setColorReceived] = useState();
  useEffect(() => {
    if (connectedAddress && REAL_MODE == 1) {
      const handle = async () => {
        let nfts = await contract.methods
          .tokensOfOwner(connectedAddress)
          .call();
        if (nfts.length > 0) {
          const randomNumber = Math.floor(Math.random() * nfts.length);
          let web3Number = Web3.utils.numberToHex(nfts[randomNumber]);
          web3Number = web3Number.slice(2);
          setColorReceived(`#${web3Number}`);
        }
      };
      handle();
    }
  }, [connectedAddress]);

  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
  const [jwtToken, setJwtToken] = useState("");
  const [knock_userID, setKnock_userID] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    document.body.classList.toggle("notification-modal-open", isVisible);
  }, [isVisible]);

  const getJWTToken = async () => {
    var jwtToken = await axios({
      method: "PATCH",
      url: "https://orders.color.museum/api/v1/others",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ user_id: knock_userID }),
    });
    setJwtToken(await jwtToken.data);
    return await jwtToken.data;
  };

  useEffect(async () => {
    let userData = localStorage.getItem("userData");
    if (userData === undefined) {
      localStorage.removeItem("userData");
    }
    if (userData) {
      userData = JSON.parse(userData);
      setUserData(userData);
      setKnock_userID(userData.knock_id);
      if (userData.id) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
  }, [localStorageChange]);

  useEffect(async () => {
    if (knock_userID) {
      await getJWTToken();
    }
  }, [knock_userID]);

  useEffect(async () => {
    if (jwtToken) {
      knockClient.authenticate(knock_userID, jwtToken);
    }
  }, [jwtToken]);

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
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };
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
  useEffect(() => {
    if (addEmail || connectWallet) lockScroll();
    if (!connectWallet && !addEmail) unlockScroll();
  }, [connectWallet, addEmail]);

  const [walletIsOpen, setWalletIsOpen] = useState(false);

  const [onGallery, setOnGallery] = useState(false);
  useEffect(() => {
    if (router.asPath.startsWith("/gallery/color-nft")) {
      setOnGallery(true);
    } else {
      setOnGallery(false);
    }
  }, [router]);

  const { notificationCount } = useSelector((state) => state.notification);
  return (
    <>
      <div
        style={{
          visibility: show ? "visible" : "hidden",
          opacity: show ? "1" : "0",
          display: show ? "flex" : "none",
        }}
        className={styles.overlay}
      >
        <div className={styles.popup}>
          <div className={styles.popup_account_div}>
            <h2>accounts</h2>
            <span className={styles.close} onClick={closeHandler}>
              &times;
            </span>
          </div>
          <div className={styles.popup_button}>
            <div className={styles.popup_change}>
              <span>Connected with MetaMask</span>
              <button className={styles.popup_change_btn}>change</button>
            </div>
            <button className={styles.connectButton} onClick={openHandler}>
              {connectedAddress.substring(0, 6)}...
              {connectedAddress.substring(connectedAddress.length - 6)}
              <div className={styles.greenConnected} />
            </button>

            <div className={styles.popup_link}>
              <CopyToClipboard
                text={connectedAddress}
                className={styles.popup_copy_id}
                onCopy={copyFunction}
              >
                <span>{copyText ? "Copied!" : "Copy Address"}</span>
              </CopyToClipboard>
              <a href={""} target="_blank">
                View on Explorer
              </a>
            </div>
          </div>

          <div className={styles.popup_footer}>
            Your transactions will appear here...
          </div>
        </div>
      </div>
      <div className={styles.modal} style={{ display: modalShowFlag }}>
        <div className={styles.modal_main}>
          <ConnectPage hideModal={() => hiddenModal()} />
        </div>
      </div>
      <nav
        className={`${
          fullWidthPage ? styles.nav_container : styles.nav_container
        }`}
        style={{ zIndex: "20" }}
      >
        <div className={styles.nav_wrapper}>
          <div className={styles.nav_inner_wrapper}>
            <Link href="/" className={styles.logo_container} passHref>
              <div className={styles.logo}>
                <Image
                  src={"/images/logo.png"}
                  alt="logo"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </Link>
            <span className={styles.betaText}>BETA</span>
          </div>
          {/* <div className={styles.centerMenu}>
            <h2 onClick={() => router.push('/choose')}>Mint</h2>
            <h2 onClick={() => router.push('/gallery')}>Trade</h2>
            <h2 onClick={() => {
              toast(
                <div className={"toastComman"}>
                  Coming Soon.
                  <IoClose
                    size={25}
                    onClick={(t) => {
                      toast.dismiss(t.id);
                    }}
                  />
                </div>,
                {
                  style: {
                    background: "#ff660d",
                  },
                }
              );
            }}>Earn</h2>
            <h2 onClick={() => router.push('/cube')}>Cube</h2>
            <h2 onClick={() => {
              toast(
                <div className={"toastComman"}>
                  Coming Soon.
                  <IoClose
                    size={25}
                    onClick={(t) => {
                      toast.dismiss(t.id);
                    }}
                  />
                </div>,
                {
                  style: {
                    background: "#ff660d",
                  },
                }
              );
            }}>WhitePaper</h2>
          </div> */}
          <div className={styles.connectedAddress}>
            <div className={styles.connected_content}>
              {connectedAddress !== "" ? (
                <>
                  {isMobile ? (
                    <>
                      <div className={styles.flexConnected}>
                        <div
                          style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <TbBell
                            className={styles.wallet}
                            onClick={() => {
                              dispatch(notificationOn());
                            }}
                          />
                          {notificationCount > 0 && (
                            <span
                              className={`${styles.amountOfNewNotifications} ${
                                notificationCount > 2 ? styles.laregText : null
                              }`}
                            >
                              {notificationCount}
                            </span>
                          )}
                        </div>
                        <RiWallet3Fill
                          size="20px"
                          className={styles.wallet}
                          onClick={() => {
                            if (loggedIn && !connectedAddress) {
                              setConnectWallet(true);
                            } else {
                              setWalletIsOpen(true);
                            }
                          }}
                        />

                        <BsFillGearFill
                          size="20px"
                          className={styles.wallet}
                          onClick={() => setAddEmail(true)}
                        />
                        <button
                          className={`${styles.buyButton} ${styles.connect}`}
                          onClick={() => setSlideMenu(true)}
                          style={{ marginLeft: " 10px" }}
                        >
                          Menu
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.dotContainer}>
                        <div
                          style={{
                            // padding: "5px",
                            height: "30px",
                            display: "flex",
                          }}
                        >
                          <div style={{ position: "relative" }}>
                            <TbBell
                              className={styles.wallet}
                              onClick={() => {
                                dispatch(notificationOn());
                              }}
                            />
                            {notificationCount > 0 && (
                              <span
                                className={`${
                                  styles.amountOfNewNotifications
                                } ${
                                  notificationCount > 2
                                    ? styles.laregText
                                    : null
                                }`}
                              >
                                {notificationCount}
                              </span>
                            )}
                          </div>
                          <RiWallet3Fill
                            size="20px"
                            className={styles.wallet}
                            onClick={() => {
                              if (loggedIn && !connectedAddress) {
                                setConnectWallet(true);
                              } else {
                                setWalletIsOpen(true);
                              }
                            }}
                          />

                          <BsFillGearFill
                            size="20px"
                            className={styles.wallet}
                            onClick={() => setAddEmail(true)}
                          />
                        </div>
                      </div>
                      <div className={styles.flexConnected}>
                        <div className={styles.userInfo}>
                          {colorReceived ? (
                            <div
                              className={styles.square0x}
                              style={{ background: colorReceived }}
                            ></div>
                          ) : (
                            <div className={styles.square0x}>0x</div>
                          )}
                          <span className={styles.greenCircle} />
                          <h5>
                            {ensNameFinal !== ""
                              ? ensNameFinal
                              : `${connectedAddress.substring(0, 6)}
                      ...
                      ${connectedAddress.substring(
                        connectedAddress.length - 6
                      )}`}
                          </h5>
                          <h3>
                            {ethValue !== null || ethValue !== ""
                              ? ethValue
                              : 0}{" "}
                            ETH
                          </h3>
                        </div>
                      </div>
                      <button
                        className={styles.buyButton}
                        onClick={() => setSlideMenu(true)}
                        style={{ marginLeft: " 20px" }}
                      >
                        Menu
                      </button>
                    </>
                  )}
                </>
              ) : pendingConnect ? (
                <div className={styles.buyButtonAnimation}>
                  <PuffLoader color={"#ffffff"} size={32} />
                </div>
              ) : (
                <>
                  <>
                    <button
                      className={styles.buyButton}
                      onClick={() => setSlideMenu(true)}
                    >
                      Menu
                    </button>
                  </>
                </>
              )}
            </div>
          </div>
        </div>
        {onGallery && warnActive && (
          <div className={styles.warning}>
            <h2>TRADING IS ACTIVE</h2>
            <span className={styles.dotCss}></span>
            <p>Beta V1 is now live.</p>
          </div>
        )}
      </nav>
      <div className={styles.firstSideline} />
      <div className={styles.secondSideline} />

      <SlideConnectWallet
        connectWallet={connectWallet}
        setConnectWallet={setConnectWallet}
      />
      <SlideNavigate slideMenu={slideMenu} setSlideMenu={setSlideMenu} />
      <AddEmailToAccount setAddEmail={setAddEmail} addEmail={addEmail} />
      <WalletView
        walletIsOpen={walletIsOpen}
        setWalletIsOpen={setWalletIsOpen}
      />
      {/* <KnockSlider
        openSlide={openSlide}
        setOpenSlide={setOpenSlide}
        setAmountOfNewNotifications={setAmountOfNewNotifications}
        userData={userData}
      /> */}
    </>
  );
};

export default Index;

const EmptyComponentKnock = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "Sen",
      }}
    >
      <p style={{ margin: 0 }} className={styles.noActivity}>
        No new activity to report.
      </p>
    </div>
  );
};
