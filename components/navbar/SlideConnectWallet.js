import stylesMintPage from "../../styles/modules/mint/mintPage.module.css";
import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import PuffLoader from "react-spinners/PuffLoader";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import {
  ConnectAddress,
  Connector,
  LocalStorage,
  Web3Provider,
  PendingConnect,
} from "../../store/actions/toggle";
import {
  API_URL,
} from '../../utils/constants';

import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import {
  injected,
  walletLink,
  walletConnectConnector,
} from "../../utils/connector";
import { knock_secretKey } from "../../utils/constants";
import { BsCheck2 } from "react-icons/bs";
// import knock module and create instance
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(knock_secretKey);

const backendUrl = `https://accounts.color.museum/`;
// const backendUrl = `http://localhost:3000/`;
import { isMobile, isIOS } from "react-device-detect";

import { REAL_MODE, WALLET_EXPIRY_TIME ,PROVIDER_FOR_WEB3} from "../../utils/constants";
import toast from "react-hot-toast";

import { useRouter } from "next/router";
import axios from "axios";
import { FaGasPump } from "react-icons/fa";
import stylesNav from "../../styles/modules/nav.module.css";
import { utils } from "ethers";

const SlideConnectWallet = ({ connectWallet, setConnectWallet }) => {
  const dispatch = useDispatch();
  const { activate, account, deactivate, privateKey } = useWeb3React();
  const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_FOR_WEB3));
  const [onConnect, setOnConnect] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);
  const [error, setError] = useState();
  const { library } = useWeb3React();
  const { connectedAddress, gasPrice } = useSelector((state) => state.minting);
  const { logout } = useSelector((state) => state.toggle);
  // function that generate character random string
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
  const [userData, setUserData] = useState({});
  useEffect(() => {
    let userData = localStorage.getItem("userData");
    if (userData == undefined || userData == "" || userData == {}) {
      localStorage.removeItem("userData");
    }
    userData = localStorage.getItem("userData");
    if (userData) {
      userData = JSON.parse(userData);
      setUserData(userData);
    }
  }, []);

  useEffect(() => {
    if (onSuccess == true) {
      setTimeout(() => {
        setOnSuccess(false);
      }, 5000);
    }
  }, [onSuccess]);

  const router = useRouter();
  // Set wallet type and expiry time on local for use this on refresh0
  const setWalletInfoOnLocal = async (type) => {
    localStorage.setItem("color_museum_wallet_type", type); //  1 for metamask, 2 for coinbase, 3 for walletConnect
    localStorage.setItem(
      "color_museum_wallet_expiry",
      Math.floor(new Date().getTime() / 1000) + 60 * WALLET_EXPIRY_TIME
    );
    if (library) console.log("ChainID = ", await library.eth.getChainId());
    if (library && !((await library.eth.getChainId()) == (REAL_MODE ? 1 : 3))) {
      toast(
        <div className={"toastComman"}>
          {`Incorrect chain. Change to Chain No. ${REAL_MODE ? 1 : 3}.`}
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
      dispatch(PendingConnect(false));
      return false;
    }

    if (window.dataLayer && userData) {
      window.dataLayer.push({
        event: "wallet-connected",
        page_location: router.asPath, // existing page url should pass here.
        wallet_selected:
          type === 1 ? "Metamask" : type === 2 ? "Coinbase" : "WalletConnect", //Metamask, Coinbase Wallet, WalletConnect dynamic wallet name should pass here.
        user_id: userData.id, //userbase, user ID should dynamically pass here.
      });
    }
  };

  const storeWalletMint = async() => {
    let ethbalance = await web3.eth.getBalance(account);
    let ethPrice = web3.utils.fromWei(ethbalance, "ether");
    console.log(ethPrice);
    let insertObject = {};
    const utm_source = localStorage.getItem("utm_source");
    const utm_medium = localStorage.getItem("utm_medium");
    const utm_campaign = localStorage.getItem("utm_campaign");
    const utm_term = localStorage.getItem("utm_term");
    const utm_content = localStorage.getItem("utm_content");
    const utm_id = localStorage.getItem("utm_id");
    insertObject["address"] = account;
    insertObject["eth_balance"] = ethPrice;
    insertObject["utm_source"] = utm_source;
    insertObject["utm_medium"] = utm_medium;
    insertObject["utm_campaign"] = utm_campaign;
    insertObject["utm_term"] = utm_term;
    insertObject["utm_content"] = utm_content;
    insertObject["utm_id"] = utm_id;
    const res = await axios.post(`${backendUrl}setConnectWalletMint/`, {
      insertObject: insertObject,
    });
  }

  useEffect(async () => {
    const userData = localStorage.getItem("userData");
    console.log(userData,"asdfasdfasdfsafdsdf");
    if (!account || !library || userData != null) return false;
    var chainID = await library.eth.getChainId();
    if (!(chainID == (REAL_MODE ? 1 : 3))) {
      if (connectedAddress) {
        dispatch(ConnectAddress(""));
      }
      dispatch(PendingConnect(false));
      return false;
    }
    console.log(userData,"checked_chain_id");
    if (account !== undefined && !logout) {
      const rlt = await installSiteAccount();
      if (rlt == 2) {
        console.log("dispatch here1");
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
        toast("Error in obtaining signature. Retry.", {
          style: {
            border: "1px solid #f0291a",
          },
        });
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
    await storeWalletMint();
    dispatch(PendingConnect(false));
  }, [account, logout]);

  const buildSignature = async () => {
    const { ethereum } = window;
    const random_key = makeid(30);
    console.log("current_provide-------", library, library.currentProvider);
    try {
      const sign = await library.currentProvider.request({
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
    console.log("installSiteAccount",account);
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
      if (users.length > 0) {
        // let resultSign = await buildSignature();
        // console.log("result", resultSign);
        // if (resultSign.error) return false;
        // let sign = resultSign.sign;
        // localStorage.setItem("userSignature", sign);
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
        const {
          data: { status: statusInsertData, data: insertedUser, error: error2 },
        } = await axios.post(`${backendUrl}insertData`, {
          tableName: "users",
          insertData: [{ connectedAddress: account }],
          upsert: true,
        });
        console.log(insertedUser, "insertedUser");
        if (statusInsertData != "success") return false;
        let insertObject = {};
        const utm_source = localStorage.getItem("utm_source");
        const utm_medium = localStorage.getItem("utm_medium");
        const utm_campaign = localStorage.getItem("utm_campaign");
        const utm_term = localStorage.getItem("utm_term");
        const utm_content = localStorage.getItem("utm_content");
        const utm_id = localStorage.getItem("utm_id");
        insertObject["knock_id"] = random_id;
        insertObject["user_id"] = insertedUser[0].id;
        insertObject["utm_source"] = utm_source;
        insertObject["utm_medium"] = utm_medium;
        insertObject["utm_campaign"] = utm_campaign;
        insertObject["utm_term"] = utm_term;
        insertObject["utm_content"] = utm_content;
        insertObject["utm_id"] = utm_id;
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
    }
    return 2;
  };
  const activateInjectedProvider = async (providerName) => {
    const { ethereum } = window;

    if (!ethereum?.providers) {
      return undefined;
    }

    let cprovider;
    if (providerName == "CoinBase") {
      cprovider = ethereum.providers.find(
        ({ isCoinbaseWallet }) => isCoinbaseWallet
      );
    }
    if (providerName == "MetaMask") {
      cprovider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
    }
    console.log("providerName", providerName, cprovider);

    if (cprovider) {
      await ethereum.setSelectedProvider(cprovider);
    }
  };
  const removeLocalStorageData = () => {
    localStorage.removeItem("connectedAddress");
    localStorage.removeItem("userSignature");
    localStorage.removeItem("connectedAddress");
    localStorage.removeItem("color_museum_wallet_type");
    localStorage.removeItem("color_museum_wallet_expiry");
    localStorage.removeItem("userData");
    localStorage.removeItem("userWalletAccountData");
  };

  const connectToCoinbaseWallet = async () => {
    // if (isIOS){
    //   window.location.href = "https://go.cb-w.com/NEpf8qrlOqb";
    //   await activate(walletLink);
    //   setWalletInfoOnLocal(2);
    //   dispatch(Connector("Coinbase"));
    // }
    removeLocalStorageData();
    try {
      activateInjectedProvider("CoinBase");
      await activate(walletLink);
      setWalletInfoOnLocal(2);
      dispatch(Connector("Coinbase"));
      dispatch(PendingConnect(true));
      setConnectWallet(false);
    } catch (error) {
      dispatch(PendingConnect(false));
      setError(error);
      console.log(error);
    }
  };

  const [currentPage, setCurrentPage] = useState("/");
  const [localStorageItem, setLocalStorageItem] = useState();

  useEffect(() => {
    setCurrentPage(router.asPath);
    if (localStorage.getItem("choosenColor")) {
      let value = localStorage.getItem("choosenColor").split(", ");
      setLocalStorageItem(value);
    }
  }, [router]);

  const [utm_added, setUtm_added] = useState("");
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const utm_source = queryParams.get("utm_source");
    const utm_medium = queryParams.get("utm_medium");
    const utm_campaign = queryParams.get("utm_campaign");
    const utm_term = queryParams.get("utm_term");
    const utm_content = queryParams.get("utm_content");
    const utm_id = queryParams.get("utm_id");
    const utm_added =
      utm_source && utm_medium && utm_campaign
        ? `?utm_source=${utm_source && utm_source}?utm_medium=${
            utm_medium && utm_medium
          }?utm_campaign=${utm_campaign && utm_campaign}?utm_term=${
            utm_term && utm_term
          }?utm_content=${utm_content && utm_content}?utm_id=${
            utm_id && utm_id
          }`
        : "";
    setUtm_added(utm_added);
  }, []);

  const connectToMetaMask = async () => {
    removeLocalStorageData();
    if (window.ethereum) {
      try {
        console.log("activate_metamask");
        activateInjectedProvider("MetaMask");
        setOnConnect(true);
        await activate(injected);
        setWalletInfoOnLocal(1);
        dispatch(Connector("Metamask"));
        dispatch(PendingConnect(true));
        setConnectWallet(false);
        setOnConnect(false);
        setOnSuccess(true);
      } catch (error) {
        dispatch(PendingConnect(false));
        setError(error);
        console.error(error);
      }
    } else if (isIOS) {
      window.location.href = `https://metamask.app.link/dapp/color.museum${currentPage}${
        localStorageItem &&
        `?color=${localStorageItem[0].slice(
          8,
          14
        )}&name=${localStorageItem[1].slice(
          6
        )}&description=${localStorageItem[2].slice(13)}${utm_added}`
      }`;
      await activate(injected);
      setWalletInfoOnLocal(1);
      dispatch(Connector("Metamask"));
    } else if (isMobile) {
      window.location.href = `https://metamask.app.link/dapp/color.museum${currentPage}${
        localStorageItem &&
        `?color=${localStorageItem[0].slice(
          8,
          14
        )}&name=${localStorageItem[1].slice(
          6
        )}&description=${localStorageItem[2].slice(13)}${utm_added}`
      }`;
    } else {
      window.location.href = "https://metamask.io";
      ("");
    }
  };

  const connectToWalletConnect = async () => {
    removeLocalStorageData();
    try {
      await activate(walletConnectConnector);
      setWalletInfoOnLocal(3);
      dispatch(Connector("WalletConnect"));
      dispatch(PendingConnect(true));
      setConnectWallet(false);
    } catch (error) {
      dispatch(PendingConnect(false));
      setError(error);
      console.log(error);
    }
  };

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={connectWallet}
      overlayClassName="some-custom-overlay-class"
      title={
        <div className={styles.newPurchaseTitle}>
          Connect Wallet
          <IoCloseSharp
            size={30}
            onClick={() => {
              setConnectWallet(false);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setConnectWallet(false);
      }}
    >
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          <h1 className={styles.newDesignHeader}>CHOOSE WALLET </h1>
        </div>
        <button
          className={styles.buttonWalletConnect}
          onClick={() => connectToMetaMask()}
        >
          <img src={"/images/metamask.png"} alt="" />
          <span>metamask</span>
        </button>
        <button
          className={styles.buttonWalletConnect}
          onClick={() => connectToCoinbaseWallet()}
        >
          <img
            src={
              "https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/81d4fea7-0c46-4eaa-0030-4ac473576e00/public"
            }
            alt=""
          />
          <span>COINBASE WALLET</span>
        </button>
        <div className={styles.mobileOnly}>
          <h2>PRO TIP</h2>
          <p>
            For the optimal experience, open
            <br />
            <b>www.color.museum</b> in the built in
            <br />
            browser of Metamask or Coinbase
            <br /> Wallet.
          </p>
        </div>
      </div>
      {onConnect ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>Pending</h4>
        </div>
      ) : onSuccess ? (
        <div className={styles.emailLoaderContainer}>
          <BsCheck2 className={styles.approved} />
          <h4 style={{ color: "#00FF0A" }}>Success!</h4>
        </div>
      ) : (
        <div
          className={stylesMintPage.gasContainer}
          style={{ left: "0", width: "auto", color: "#fff" }}
        >
          <FaGasPump style={{ color: "#fff" }} />
          <p style={{ color: "#fff" }}>Gas Price</p>
          <span style={{ color: "#fff" }}>
            {(Number(gasPrice) / 1000000000).toFixed(0)}
          </span>
          <p style={{ color: "#fff" }}>GWEI</p>
        </div>
      )}
    </SlidingPane>
  );
};

export default SlideConnectWallet;
