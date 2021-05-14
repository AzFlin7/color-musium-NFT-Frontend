import styles from "../../styles/modules/newTokenID/newTokenID.module.css";
import stylesNewTokenId from "../../styles/modules/newTokenID/newTokenID.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import { NFTabi } from "../../utils/ABIs/NFTabi";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
  API_URL,
  MARKETOWNER,
  REAL_MODE,
} from "../../utils/constants";
import { COLOR_NFT_FEES } from "../../utils/tradeInformation";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { tokenABI } from "../../utils/ABIs/TokenABI";
import toast from "react-hot-toast";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import { BsCheck2 } from "react-icons/bs";
import PuffLoader from "react-spinners/PuffLoader";
const { ERC721Order } = require("@0x/protocol-utils");
import { recoverTypedSignature_v4 } from "eth-sig-util";

const ConfirmOfferComponent = ({
  title, //  the title of the button, it represent the order direction here
  selectedCurrency, //  the type of currency
  selectedCurrencyInput, //  the amount of currency
  expireHour, //  the expiryDay as hour
  number, //  the tokenID of NFT
  data, //  the data of the NFT which contains the minter, color etc...
  afterOrderConfirmed, //  the functions which handle things after order confirmed
  ownerOfNFT, // NFT ower address
  closeStepBecauseOfError, // close the stepwizard
}) => {
  const router = useRouter();
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const mintingAddress = data.minting_address;
  const { token } = router.query;

  const marketPlaceInstance = new web3.eth.Contract( //  Marketplace instance
    ERC721OrderFeatureABI,
    ERC721OrderFeatureAddress
  );

  const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR); //  get color NFT instance

  const checkOrderStatus = async (order) => {
    // get NFT owner
    var NFTTaker;
    try {
      NFTTaker = await NFTInstance.methods.ownerOf(order.erc721TokenId).call();
    } catch (e) {
      console.log("Something is wrong with: ", e);
      return false;
    }
    if (order.direction == 1 && connectedAddress == NFTTaker) {
      console.log("Owner can not make offer!");
      toast(
        <div className={"toastComman"}>
          You own this already.
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
    if (order.direction == 0 && connectedAddress != NFTTaker) {
      console.log("You are not the owner!");
      toast(
        <div className={"toastComman"}>
          You own this already.
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
    return true;
  };

  const signOrder = async (order) => {
    const NFTOrder = new ERC721Order({
      chainId: order.chainId,
      verifyingContract: order.verifyingContract,
      direction: order.direction,
      maker: order.maker,
      taker: order.taker,
      expiry: order.expiry,
      nonce: order.nonce,
      erc20Token: order.erc20Token,
      erc20TokenAmount: order.erc20TokenAmount,
      fees: order.fees,
      erc721Token: order.erc721Token, // color NFT address
      erc721TokenId: order.erc721TokenId, // exact tokenID
      erc721TokenProperties: order.erc721TokenProperties, // no property for now
    });

    const EIP712_DOMAIN_PARAMETERS = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ];

    const FEE_ABI = [
      { type: "address", name: "recipient" },
      { type: "uint256", name: "amount" },
      { type: "bytes", name: "feeData" },
    ];

    const PROPERTY_ABI = [
      { type: "address", name: "propertyValidator" },
      { type: "bytes", name: "propertyData" },
    ];

    const STRUCT_ABI = [
      { type: "uint8", name: "direction" },
      { type: "address", name: "maker" },
      { type: "address", name: "taker" },
      { type: "uint256", name: "expiry" },
      { type: "uint256", name: "nonce" },
      { type: "address", name: "erc20Token" },
      { type: "uint256", name: "erc20TokenAmount" },
      { type: "Fee[]", name: "fees" },
      { type: "address", name: "erc721Token" },
      { type: "uint256", name: "erc721TokenId" },
      { type: "Property[]", name: "erc721TokenProperties" },
    ];

    console.log("NFTOrder", NFTOrder);
    const { domain, message } = NFTOrder.getEIP712TypedData();
    const types = {
      EIP712Domain: EIP712_DOMAIN_PARAMETERS,
      ["ERC721Order"]: STRUCT_ABI,
      ["Fee"]: FEE_ABI,
      ["Property"]: PROPERTY_ABI,
    };
    console.log("types\n", types, "\nmessage\n", message, "\ndomain\n", domain);

    var msgParams = JSON.stringify({
      types,
      domain,
      primaryType: "ERC721Order",
      message,
    });
    console.log(msgParams);
    var from = connectedAddress;
    var params = [from, msgParams];
    var method = "eth_signTypedData_v4";

    // const util = require('ethereumjs-util');

    var signature, rSignature;
    await web3.currentProvider.send(
      {
        method,
        params,
        from,
      },
      function async(err, result) {
        if (err) return console.dir(err);
        if (result.error) {
          alert(result.error.message);
        }
        if (result.error) return console.error("ERROR", result);
        console.log("TYPED SIGNED:" + JSON.stringify(result));

        const recovered = recoverTypedSignature_v4({
          data: JSON.parse(msgParams),
          sig: result.result,
        });
        console.log("recovered", recovered);

        const { v, r, s } = ethers.utils.splitSignature(result.result);
        // const res = util.fromRpcSig(result.result);
        // console.log("res", res);
        signature = {
          v,
          r,
          s,
          signatureType: 2,
        };
        console.log(signature);

        // const w3w = new Web3Wrapper(Web3.currentProvider);
        // const rpcSig = w3w.signTypedDataAsync(from, JSON.parse(msgParams));
        // console.log("rpcSig", rpcSig);

        marketPlaceInstance.methods
          .validateERC721OrderSignature(order, signature)
          .call();
        rSignature = result.result;
      }
    );
    console.log("rSignature", rSignature);
    return rSignature;
  };

  // users make buy order here
  const makeBuyOrder = async () => {
    setDisabled(true); // disable button
    setOnPending(true); // and show users pending alert
    if (connectedAddress == "") {
      // check if wallet is connected, hope this part is never called.
      console.log("Please connect to wallet!");
      toast(
        <div className={"toastComman"}>
          No wallet connected
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

    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR); //  get color NFT instance

    var NFTTaker;
    try {
      NFTTaker = await NFTInstance.methods.ownerOf(number).call();
    } catch (e) {
      console.log("Something is wrong with: ", e);
      return false;
    }
    var expireTime = expireHour * 60 * 60; //  calc exact expire time left in seconds

    // get selected token instance
    const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
    const indexOfCurrency = currencyArray.indexOf(selectedCurrency);
    console.log(indexOfCurrency);
    const tokenInstance = new web3.eth.Contract(
      tokenABI,
      TokenAddressList[indexOfCurrency]
    );

    // calc exact amount of erc20 token amount with decimals
    const decimal = await tokenInstance.methods.decimals().call();
    var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
    erc20AmountBN = erc20AmountBN.div(Math.pow(10, 18 - decimal));

    const order = {
      chainId: REAL_MODE ? 1 : 3,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      direction: 1, // 1 for buy order
      maker: connectedAddress, // maker is connectedAddress when making buy order
      taker: NFTTaker, // taker is ownerOf NFT
      expiry: Math.floor(new Date().getTime() / 1000) + expireTime, // expire time + current time
      nonce: 0, // Will be set on backend
      erc20Token: TokenAddressList[indexOfCurrency], // the selected token address
      erc20TokenAmount: erc20AmountBN
        .div(1000)
        .mul(1000 - (25 + COLOR_NFT_FEES * 10))
        .toString(), // exact amount of token which owner will receive
      fees: [
        // exact amount of token which owner of marketplace will receive
        {
          recipient: MARKETOWNER,
          amount: erc20AmountBN
            .mul(25 + COLOR_NFT_FEES * 10)
            .div(1000)
            .toString(),
          feeData: "0x",
        },
      ],
      erc721Token: SMARTCONTRACTADDR, // color NFT address
      erc721TokenId: Number(number), // exact tokenID
      erc721TokenProperties: [], // no property for now
    };

    if (!checkOrderStatus(order)) {
      toast(
        <div className={"toastComman"}>
          Something is wrong with order.
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
      closeStepBecauseOfError();
    }

    var fetchData = order;
    fetchData.nft_color_id = "62ec1da706ff5da975b9c1bf";
    const signatureForFetch = {
      signatureType: 4,
      v: 0,
      r: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
      s: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
    };
    fetchData.signature = signatureForFetch;
    console.log("fetchData:", fetchData);
    const fetchResult = await axios({
      // Enter your IP address here
      method: "POST",
      url: `${API_URL}/off_order/create`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
    }).catch(function (err) {
      toast(
        <div className={"toastComman"}>
          Something wrong connect to server.
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
    });
    if (fetchResult.data.success == true) console.log("Order added!");
    else {
      toast(
        <div className={"toastComman"}>
          Error occurred. Check network connection or click Help button.
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
    console.log(fetchResult);
    order.nonce = fetchResult.data.nonce; //set nonce

    console.log("order", order);
    const sig = await signOrder(order);
    if (typeof sig == "undefined") {
      toast(
        <div className={"toastComman"}>
          Making signature is failed!
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
      closeStepBecauseOfError();
      return;
    }

    console.log("signature", sig);
    const fetchDataForMake = {
      nonce: order.nonce,
      signature: sig,
    };

    const fetchResultOfMake = await axios({
      // Enter your IP address here
      method: "PATCH",
      url: `${API_URL}/off_order/make`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(fetchDataForMake), // body data type must match "Content-Type" header
    }).catch(function (err) {
      toast(
        <div className={"toastComman"}>
          Something wrong connect to server.
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
      closeStepBecauseOfError();
    });

    setOnPending(false);
    setOnSuccess(true);
    afterOrderConfirmed();
  };

  const makeSellOrder = async () => {
    setDisabled(true); // disable button
    setOnPending(true); // and show users pending alert
    if (connectedAddress == "") {
      // check if wallet is connected, hope this part is never called.
      console.log("Please connect to wallet!");
      toast(
        <div className={"toastComman"}>
          No wallet connected
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

    const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR); //  get color NFT instance

    var NFTTaker;
    try {
      NFTTaker = await NFTInstance.methods.ownerOf(number).call();
    } catch (e) {
      console.log("Something is wrong with: ", e);
      return false;
    }
    var expireTime = expireHour * 60 * 60; //  calc exact expire time left in seconds

    // get selected token instance
    const currencyArray = ["ETH", "WETH", "USDC", "DAI", "USDT"];
    const indexOfCurrency = currencyArray.indexOf(selectedCurrency);
    console.log(indexOfCurrency);
    const tokenInstance = new web3.eth.Contract(
      tokenABI,
      TokenAddressList[indexOfCurrency]
    );

    // calc exact amount of erc20 token amount with decimals
    var erc20AmountBN = ethers.utils.parseEther(selectedCurrencyInput);
    if (indexOfCurrency != 0) {
      const tokenInstance = new web3.eth.Contract(
        tokenABI,
        TokenAddressList[indexOfCurrency]
      );
      const decimal = await tokenInstance.methods.decimals().call();
      erc20AmountBN = erc20AmountBN.div(Math.pow(10, 18 - decimal));
    }

    const order = {
      chainId: REAL_MODE ? 1 : 3,
      verifyingContract: "0x0000000000000000000000000000000000000000",
      direction: 0, // 1 for buy order
      maker: connectedAddress, // maker is connectedAddress when making buy order
      taker: "0x0000000000000000000000000000000000000000", // taker is ownerOf NFT
      expiry: Math.floor(new Date().getTime() / 1000) + expireTime, // expire time + current time
      nonce: 0, // Will be set on backend
      erc20Token: TokenAddressList[indexOfCurrency], // the selected token address
      erc20TokenAmount: erc20AmountBN
        .div(1000)
        .mul(1000 - (25 + COLOR_NFT_FEES * 10))
        .toString(), // exact amount of token which owner will receive
      fees: [
        // exact amount of token which owner of marketplace will receive
        {
          recipient: MARKETOWNER,
          amount: erc20AmountBN
            .mul(25 + COLOR_NFT_FEES * 10)
            .div(1000)
            .toString(),
          feeData: "0x",
        },
      ],
      erc721Token: SMARTCONTRACTADDR, // color NFT address
      erc721TokenId: Number(number), // exact tokenID
      erc721TokenProperties: [], // no property for now
    };

    if (!checkOrderStatus(order)) {
      toast(
        <div className={"toastComman"}>
          Something is wrong with order.
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
      closeStepBecauseOfError();
    }

    var fetchData = order;
    fetchData.nft_color_id = "62ec1da706ff5da975b9c1bf";
    const signatureForFetch = {
      signatureType: 4,
      v: 0,
      r: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
      s: "0x0000000000000000000000000000000000000000000000000000006d6168616d",
    };
    fetchData.signature = signatureForFetch;
    console.log("fetchData:", fetchData);
    const fetchResult = await axios({
      // Enter your IP address here
      method: "POST",
      url: `${API_URL}/off_order/create`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(fetchData), // body data type must match "Content-Type" header
    }).catch(function (err) {
      toast(
        <div className={"toastComman"}>
          Something wrong connect to server.
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
    });
    if (fetchResult.data.success == true) console.log("Order added!");
    else {
      toast(
        <div className={"toastComman"}>
          Error occurred. Check network connection or click Help button.
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
    console.log(fetchResult);
    order.nonce = fetchResult.data.nonce; //set nonce

    console.log("order", order);
    const sig = await signOrder(order);
    if (typeof sig == "undefined") {
      toast(
        <div className={"toastComman"}>
          Making signature is failed!
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
      closeStepBecauseOfError();
      return;
    }

    console.log("signature", sig);
    const fetchDataForMake = {
      nonce: order.nonce,
      signature: sig,
    };

    const fetchResultOfMake = await axios({
      // Enter your IP address here
      method: "PATCH",
      url: `${API_URL}/off_order/make`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(fetchDataForMake), // body data type must match "Content-Type" header
    }).catch(function (err) {
      toast(
        <div className={"toastComman"}>
          Something wrong connect to server.
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
      closeStepBecauseOfError();
    });

    setOnPending(false);
    setOnSuccess(true);
    afterOrderConfirmed();
  };

  const [disabled, setDisabled] = useState(false);
  const [onPending, setOnPending] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const [finalUsdValue, setFinalUsdValue] = useState(0);
  const [finalUsdTotal, setFinalUsdTotal] = useState(0);

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

  useEffect(() => {
    const handlePrice = async () => {
      await axios(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      ).then((res) => {
        const currency =
          selectedCurrency === "WETH" || selectedCurrency === "ETH"
            ? res.data.USD
            : 1;
        setFinalUsdValue(
          Number(selectedCurrencyInput.replace(",", ".")) * currency
        );
        if (title == "Buy") {
          const buyValue = (
            (Number(selectedCurrencyInput.replace(",", ".")) * 100.0) /
            100
          ).toFixed(6);
          setFinalUsdTotal(Number(buyValue) * currency);
        } else {
          const sellValue = (
            (Number(selectedCurrencyInput.replace(",", ".")) * (100 - 7.5)) /
            100
          ).toFixed(6);
          setFinalUsdTotal(Number(sellValue) * currency);
        }
      });
    };
    handlePrice();
  }, []);

  return (
    <div>
      <h1 className={styles.newDesignHeader}>Make {title} Offer Now</h1>
      <div className={styles.newDesignFlex} style={{ margin: "40px 0 20px" }}>
        <h3 className={styles.buyNowHeader}>{data.name}</h3>
        <div className={styles.square} style={{ background: data.hex }} />
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Category</h3>
        <h3
          className={styles.buyItNowMain}
          style={{ textTransform: "capitalize" }}
        >
          {data.base_color_name}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>NFT No.</h3>
        <h3 className={styles.buyItNowMain}>{data.nftNo}</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Rarity</h3>
        <h3 className={styles.buyItNowMain}>1 of 1</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Token ID</h3>
        <h3 className={styles.buyItNowMain}>{token}</h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Owner</h3>
        <div className={styles.newDesignOwnerFlex}>
          <div
            src={"/images/Depredation.jpg"}
            alt=""
            className={styles.newPersonImage}
          >
            0x
          </div>
          <h3 className={styles.buyItNowMain}>
            {ownerOfNFT && ownerOfNFT.substring(0, 6)}...
            {ownerOfNFT && ownerOfNFT.substring(ownerOfNFT.length - 6)}
          </h3>
        </div>
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex} style={{ marginBottom: "20px" }}>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          Price
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          {convertFloat(Number(selectedCurrencyInput).toFixed(10))}{" "}
          {selectedCurrency}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {convertFloat(finalUsdValue.toFixed(10))} USD
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0 0 1rem 0" }}>
          {title == "Buy" ? "" : "Transaction Fee"}
        </h3>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0 0 1rem 0" }}>
          {title == "Buy" ? "" : 2.5 + "% "}
          {title == "Buy"
            ? ""
            : convertFloat(
                (
                  (Number(selectedCurrencyInput.replace(",", ".")) * 2.5) /
                  100
                ).toFixed(10)
              )}
              &nbsp;
          {title == "Buy" ? null : selectedCurrency}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0" }}>
          {title == "Buy" ? "" : "Collection Fee"}
        </h3>
        <h3 className={styles.buyItNowMainSub} style={{ margin: "0" }}>
          {title == "Buy" ? "" : COLOR_NFT_FEES + "% "}
          {title == "Buy"
            ? ""
            : convertFloat(
                (
                  (Number(selectedCurrencyInput.replace(",", ".")) *
                    COLOR_NFT_FEES) /
                  100
                ).toFixed(10)
              )}
              &nbsp;
          {title == "Buy" ? null : selectedCurrency}
        </h3>
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex} style={{ marginBottom: "20px" }}>
        <h3 className={styles.buyNowHeader}>
          {title == "Buy" ? "Total" : "You will receive"}
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          {title == "Buy"
            ? convertFloat(
                (
                  (Number(selectedCurrencyInput.replace(",", ".")) * 100) /
                  100
                ).toFixed(6)
              )
            : convertFloat(
                (
                  (Number(selectedCurrencyInput.replace(",", ".")) *
                    (100 - 7.5)) /
                  100
                ).toFixed(6)
              )}
          &nbsp;{selectedCurrency}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {finalUsdTotal.toFixed(2)} USD
        </h3>
      </div>
      <div>
        <button
          className={stylesNewTokenId.newWhiteButton}
          disabled={disabled}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          onClick={() => {
            if (title == "Buy") makeBuyOrder();
            if (title == "Sell") makeSellOrder();
          }}
        >
          Confirm
        </button>
      </div>
      <br />
      {onPending ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <PuffLoader size={32} />
          <h4>
            Pending
            <br />
            Please don't go anywhere else
          </h4>
        </div>
      ) : onSuccess ? (
        <div className={styles.emailLoaderContainer}>
          <BsCheck2 className={styles.approved} />
          <h4 style={{ color: "#00FF0A" }}>Success!</h4>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ConfirmOfferComponent;
