import styles from "../../styles/modules/newTokenID/newTokenID.module.css";
import stylesNewTokenId from "../../styles/modules/newTokenID/newTokenID.module.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ERC721OrderFeatureABI } from "../../utils/ABIs/ERC721OrdersFeature";
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  API_URL,
} from "../../utils/constants";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import stylesForBottomPart from "../../styles/modules/newTokenID/newTokenID.module.css";
import { BsCheck2 } from "react-icons/bs";
import MoonLoader from "react-spinners/MoonLoader";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const AcceptOfferComponent = ({
  item,
  data,
  afterOrderAccepted,
  closeBecauseOfError,
  ownerOfNFT,
}) => {
  console.log("item", item);
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [disabled, setDisabled] = useState(false);

  const currencyArrayForPrint = ["ETH", "WETH", "USDC", "DAI", "USDT"];
  const decimalForCurrency = [18, 18, 6, 18, 6];

  // accept buy offer
  const acceptBuyOffer = async () => {
    console.log("I am acceptBuyOffer now with this item", item);
    setDisabled(true);
    setOnPending(true);

    const marketPlaceInstance = new web3.eth.Contract( //  get marketplace instance
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var signature = item.signature;
    const buyOrder = {
      // build buy order from item, just copy paste
      direction: 1,
      maker: item.maker,
      taker: item.taker,
      expiry: item.expiry,
      nonce: item.nonce,
      erc20Token: item.erc20Token,
      erc20TokenAmount: item.erc20TokenAmount,
      fees: item.fees,
      erc721Token: item.erc721Token,
      erc721TokenId: item.erc721TokenId,
      erc721TokenProperties: item.erc721TokenProperties,
    };

    // check if order is valid, must pass. if not it means something is wrong
    try {
      await marketPlaceInstance.methods
        .validateERC721OrderSignature(buyOrder, signature)
        .call();
    } catch (e) {
      console.log(e);
      toast(
        <div className={"toastComman"}>
          This order is invalid.
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
      closeBecauseOfError();
      return false;
    }

    var transactionHashOfAccept;
    await marketPlaceInstance.methods
      .sellERC721(buyOrder, signature, buyOrder.erc721TokenId, false, "0x")
      .send({
        from: connectedAddress,
      })
      .on("sending", function () {
        console.log("sending");
        window.dataLayer.push({
          event: "nft_sc_approved",
          crypto_value: removeDecimal(
            getBigNumber(item.erc20TokenAmount).add(
              getBigNumber(item.fees[0].amount)
            )
          ), // if 0.44 WETH
          fiat_value: finalUsdTotal.toFixed(2), // if 451.11 USD
        });
      })
      .on("sent", function () {
        console.log("sent");
      })
      .on("transactionHash", function (transactionHash) {
        console.log("transactionHash", transactionHash);
        transactionHashOfAccept = transactionHash;
      })
      .on("receipt", function (receipt) {
        console.log("receipt", receipt);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        if (confirmationNumber === 1 && receipt.status === true) {
          window.dataLayer.push({
            event: "nft_buynow",
            currency_selected:
              currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)],
            nft_id: data.nftNo,
            token_id: token,
            crypto_value: removeDecimal(
              getBigNumber(item.erc20TokenAmount).add(
                getBigNumber(item.fees[0].amount)
              )
            ),
            fiat_value: finalUsdTotal.toFixed(2),
          });
          console.log("confirmed!", confirmationNumber, receipt);
        }
      })
      .on("error", function (error) {
        console.log("error", error);
        setOnPending(false);
        setDisabled(false);
        if (error.code == 4001) {
          console.log("Rejected.");
          toast(
            <div className={"toastComman"}>
              Rejected.
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
        }
        if (error.message.includes("not mined within 50 blocks")) {
          console.log("Did not mine within 50 blocks.");
          toast(
            <div className={"toastComman"}>
              Did not mine within 50 blocks.
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
        }
        closeBecauseOfError();
        return false;
      });

    // After confirm, set the current value as 3.
    // So the the current value of other orders which current value is 1 and tokenID is same as accepted token will be set as 4
    var currentResult = await axios({
      method: "PATCH",
      url: `${API_URL}/buy_orders/current`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        nonce: item.nonce,
        current: 3,
        acceptingHash: transactionHashOfAccept,
      }),
    }).catch(function (error) {
      console.log("Error is occured when set buy order as accepted.", error);
      closeBecauseOfError();
    });
    console.log("currentResult", currentResult);
    setOnPending(false);
    setOnSuccess(true);
    afterOrderAccepted();
  };

  // Accept sell offer
  // Most of things are same except ether part
  const acceptSellOffer = async () => {
    setDisabled(true);
    setOnPending(true);
    const marketPlaceInstance = new web3.eth.Contract(
      ERC721OrderFeatureABI,
      ERC721OrderFeatureAddress
    );

    var signature = item.signature;
    const sellOrder = {
      direction: 0,
      maker: item.maker,
      taker: item.taker,
      expiry: item.expiry,
      nonce: item.nonce,
      erc20Token: item.erc20Token,
      erc20TokenAmount: item.erc20TokenAmount,
      fees: item.fees,
      erc721Token: item.erc721Token,
      erc721TokenId: item.erc721TokenId,
      erc721TokenProperties: item.erc721TokenProperties,
    };
    try {
      await marketPlaceInstance.methods
        .validateERC721OrderSignature(sellOrder, signature)
        .call();
    } catch (e) {
      toast(
        <div className={"toastComman"}>
          Invalid order.
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
      closeBecauseOfError();
      return false;
    }

    var transactionHashOfAccept;
    var valueOfEtherToSend = ethers.utils.parseUnits("0", "wei");

    // If token is ether, we need to calc the value of ether to send.
    // Other wise value is 0
    if (item.erc20Token == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
      valueOfEtherToSend = ethers.utils
        .parseUnits(String(item.erc20TokenAmount), "wei")
        .add(ethers.utils.parseUnits(String(item.fees[0].amount), "wei"));

    // confirm transaction with value
    await marketPlaceInstance.methods
      .buyERC721(sellOrder, signature, "0x")
      .send({
        from: connectedAddress,
        value: valueOfEtherToSend,
      })
      .on("sending", function () {
        console.log("sending");
        window.dataLayer.push({
          event: "nft_sc_approved",
          crypto_value: removeDecimal(
            getBigNumber(item.erc20TokenAmount).add(
              getBigNumber(item.fees[0].amount)
            )
          ), // if 0.44 WETH
          fiat_value: finalUsdTotal.toFixed(2), // if 451.11 USD
        });
      })
      .on("sent", function () {
        console.log("sent");
      })
      .on("transactionHash", function (transactionHash) {
        console.log("transactionHash", transactionHash);
        transactionHashOfAccept = transactionHash;
      })
      .on("receipt", function (receipt) {
        if (receipt.status === true) {
          window.dataLayer.push({
            event: "nft_offer_accepted_byseller",
            currency_selected:
              currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)],
            nft_id: data.nftNo,
            token_id: token,
            crypto_value: removeDecimal(
              getBigNumber(item.erc20TokenAmount).add(
                getBigNumber(item.fees[0].amount)
              )
            ),
            fiat_value: finalUsdTotal.toFixed(2),
          });
          toast(
            <div className={"toastComman"}>
              Successful transaction.
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
        }
      })
      .on("error", function (error) {
        console.log("error", error);
        setOnPending(false);
        setDisabled(false);
        if (error.code == 4001) {
          console.log("Rejected.");
          toast(
            <div className={"toastComman"}>
              Rejected.
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
        }
        if (error.message.includes("not mined within 50 blocks")) {
          console.log("Did not mine within 50 blocks.");
          toast(
            <div className={"toastComman"}>
              Did not mine within 50 blocks.
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
        }
        closeBecauseOfError();
        return false;
      });

    try {
      var currentResult = await axios({
        method: "PATCH",
        url: `${API_URL}/sell_orders/current`,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          nonce: item.nonce,
          current: 3,
          acceptingHash: transactionHashOfAccept,
        }),
      }).catch(function (error) {
        console.log("Error is occured when set buy order as accepted.", error);
        closeBecauseOfError();
      });
      setOnPending(false);
      setOnSuccess(true);
      afterOrderAccepted();
    } catch (e) {
      console.log("error when set current!", e);
      return false;
    }
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
  const [onPending, setOnPending] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const router = useRouter();
  const { token } = router.query;
  const [finalUsdValue, setFinalUsdValue] = useState(0);
  const [finalUsdTotal, setFinalUsdTotal] = useState(0);

  useEffect(() => {
    const handlePrice = async () => {
      await axios(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
      ).then((res) => {
        console.log(
          "handlePrice",
          res.data.USD,
          typeof res.data.USD == undefined
        );
        if (res.data.USD == undefined) {
          console.log("Error when getting USD price of ether");
          res.data.USD == 1000;
          // return;
        }
        if (
          currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)] !=
            "ETH" &&
          currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)] !=
            "WETH"
        ) {
          setFinalUsdTotal(
            Number(
              removeDecimal(
                getBigNumber(item.erc20TokenAmount).add(
                  getBigNumber(item.fees[0].amount)
                )
              ).toString()
            )
          );
          setFinalUsdValue(removeDecimal(getBigNumber(item.erc20TokenAmount)));
        } else {
          setFinalUsdTotal(
            Number(
              removeDecimal(
                getBigNumber(item.erc20TokenAmount)
                  .add(getBigNumber(item.fees[0].amount))
                  .mul(Math.floor(res.data.USD))
              ).toString()
            )
          );
          setFinalUsdValue(
            removeDecimal(getBigNumber(item.erc20TokenAmount)) * res.data.USD
          );
        }
      });
    };
    handlePrice();
  }, []);

  const getBigNumber = (input) => {
    if (typeof input === "string") return ethers.utils.parseUnits(input, "wei");
    return ethers.utils.parseUnits(String(input), "wei");
  };

  const removeDecimal = (input) => {
    return convertFloat(
      input /
        Math.pow(
          10,
          decimalForCurrency[TokenAddressList.indexOf(item.erc20Token)]
        )
    );
  };

  return (
    <div>
      <h1 className={styles.newDesignHeader}>Accept Offer Now</h1>
      <div className={styles.newDesignFlex} style={{ margin: "40px 0 20px" }}>
        <h3 className={styles.buyNowHeader}>{data.name}</h3>
        <div className={styles.square} style={{ background: data.hex }} />
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Collection</h3>
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
          {/* <img
            src={'/images/Depredation.jpg'}
            alt=''
            className={styles.newPersonImage}
          /> */}
          <div className={styles.userAvtarBg}>
            <span>{item.maker.substring(0, 2)}</span>
          </div>
          <h3 className={styles.buyItNowMain}>
            {ownerOfNFT && ownerOfNFT.substring(0, 6)}...
            {ownerOfNFT && ownerOfNFT.substring(item.taker.length - 6)}
          </h3>
        </div>
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex} style={{ marginBottom: "20px" }}>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          Price
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: "0" }}>
          {removeDecimal(
            getBigNumber(item.erc20TokenAmount).add(
              getBigNumber(item.fees[0].amount)
            )
          )}{" "}
          {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD Value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {finalUsdTotal && finalUsdTotal.toFixed(2)} USD
        </h3>
      </div>
      <div className={styles.newDesignFlex}>
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>Market Fee</h3>
        ) : (
          ""
        )}
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>
            {removeDecimal(
              getBigNumber(item.fees[0].amount).div("75").mul("25")
            )}{" "}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        ) : (
          ""
        )}
      </div>
      <div className={styles.newDesignFlex}>
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>Collection Fee</h3>
        ) : (
          ""
        )}
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>
            {removeDecimal(
              getBigNumber(item.fees[0].amount).div("75").mul("50")
            )}{" "}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        ) : (
          ""
        )}
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex} style={{ marginBottom: "20px" }}>
        {item.order_direction == 1 ? (
          <h3 className={styles.buyNowHeader}> You will receive</h3>
        ) : (
          "Total"
        )}

        {item.order_direction == 1 ? (
          <h3 className={styles.buyNowHeader}>
            {removeDecimal(getBigNumber(item.erc20TokenAmount))}{" "}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        ) : (
          <h3 className={styles.buyNowHeader}>
            {removeDecimal(
              getBigNumber(item.erc20TokenAmount).add(
                getBigNumber(item.fees[0].amount)
              )
            )}{" "}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        )}
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {item.order_direction == 1
            ? finalUsdValue.toFixed(4)
            : finalUsdTotal.toFixed(4)}{" "}
          USD
        </h3>
      </div>
      <div>
        <button
          className={stylesNewTokenId.newWhiteButton}
          disabled={disabled}
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
          onClick={() => {
            if (item.order_direction == 0) acceptSellOffer();
            if (item.order_direction == 1) acceptBuyOffer();
          }}
        >
          Confirm
        </button>
      </div>
      <br />
      {onPending ? (
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <MoonLoader size={32} />
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

export default AcceptOfferComponent;
