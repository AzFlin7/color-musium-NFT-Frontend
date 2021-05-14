import stylesMain from '../../styles/modules/newTokenID/createAndLoginAccount.module.css';
import styles from '../../styles/modules/newTokenID/newTokenID.module.css';
import stylesNewTokenId from '../../styles/modules/newTokenID/newTokenID.module.css';
import { IoClose, IoCloseSharp } from 'react-icons/io5';
import { tokenABI } from '../../utils/ABIs/TokenABI';
import {
  ERC721OrderFeatureAddress,
  TokenAddressList,
  SMARTCONTRACTADDR,
  API_URL,
} from '../../utils/constants';
import { useSelector } from 'react-redux';
import { NFTabi } from '../../utils/ABIs/NFTabi';
import React, { useEffect, useState } from 'react';
import stylesForBottomPart from '../../styles/modules/newTokenID/newTokenID.module.css';
import PuffLoader from 'react-spinners/PuffLoader';
import { ethers } from 'ethers';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ERC721OrderFeatureABI } from '../../utils/ABIs/ERC721OrdersFeature';
import toast from 'react-hot-toast';
import MoonLoader from 'react-spinners/MoonLoader';

const CheckOrderStatus = ({
  item, // the order item
  setStage,
  stage,
  data,
  ownerOfNFT
}) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);
  const [onChecking, setOnChecking] = useState(true);
  const [errorResult, setErrorResult] = useState(
    'You can not accept this offer'
  );
  const [pendingStatue, setPendingStatus] = useState(0);
  const router = useRouter();
  const { token } = router.query;
  const currencyArrayForPrint = ['ETH', 'WETH', 'USDC', 'DAI', 'USDT'];
  const decimalForCurrency = [18, 18, 6, 18, 6];

  useEffect(async () => {
    if (stage != 1)
      //  when not on this stage
      return false;

    setOnChecking(true);

    // check if order is expired
    const currentTime = Math.floor(new Date().getTime() / 1000);
    // console.log(currentTime, item);
    if (currentTime > item.expiry) {
      setOnChecking(false);
      setErrorResult('Order has expired.');
      return false;
    }

    // check if sell order is valid
    if (item.order_direction == 0 && item.maker != connectedAddress) {
      const NFTInstance = new web3.eth.Contract(NFTabi, SMARTCONTRACTADDR);
      var ownerOfNFT = await NFTInstance.methods
        .ownerOf(item.erc721TokenId)
        .call();
      if (ownerOfNFT == item.maker) {
        //  check if NFT is in maker's hand
        if (item.erc20Token != '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
          //  if not native token
          // check if buyer has enough amount of token
          const tokenInstance = new web3.eth.Contract(
            tokenABI,
            item.erc20Token
          ); // get token instance
          var amountOfTaker = await tokenInstance.methods
            .balanceOf(connectedAddress)
            .call();
          //check if buyer can pay both the price and fee
          if (
            ethers.utils
              .parseUnits(amountOfTaker, 'wei')
              .gte(
                ethers.utils
                  .parseUnits(item.erc20TokenAmount, 'wei')
                  .add(ethers.utils.parseUnits(item.fees[0].amount, 'wei'))
              )
          ) {
            setErrorResult('You are correct!');
            setOnChecking(false);
            setStage(2);
            setPendingStatus(2);
          } else {
            setOnChecking(false);
            setErrorResult('ERC20 balance is insufficient.');
            setPendingStatus(1);
            toast(
              <div className={"toastComman"}>
                ERC20 balance is insufficient.
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
        } else {
          // check if buyer has enough amount of eth
          const balanceOfOwner = await web3.eth.getBalance(connectedAddress);
          console.log(balanceOfOwner);
          if (balanceOfOwner < Number(item.erc20TokenAmount)) {
            setOnChecking(false);
            setErrorResult('ETH balance is insufficient.');
            setPendingStatus(1);
            toast(
              <div className={"toastComman"}>
                ETH balance is insufficient.
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
          } else {
            setErrorResult('You are correct!');
            setOnChecking(false);
            setStage(2);
            setPendingStatus(2);
          }
        }
      } else {
        console.log('Something is wrong. Report via Help button.');
        return false;
      }
    }
    // check if buy order is valid
    else if (item.order_direction == 1 && item.taker == connectedAddress) {
      // check if buyer has enough amount of token
      // token can not be eth when making buy order so don't need to worry about it in this part
      const tokenInstance = new web3.eth.Contract(tokenABI, item.erc20Token);
      var amountOfMaker = await tokenInstance.methods
        .balanceOf(item.maker)
        .call();
      if (
        ethers.utils
          .parseUnits(amountOfMaker, 'wei')
          .gte(
            ethers.utils
              .parseUnits(item.erc20TokenAmount, 'wei')
              .add(ethers.utils.parseUnits(item.fees[0].amount, 'wei'))
          )
      ) {
        setErrorResult('You are correct!');
        setOnChecking(false);
        setStage(2);
        setPendingStatus(2);
      } else {
        setOnChecking(false);
        setErrorResult('ERC20 balance is insufficient.');
        setPendingStatus(1);
        toast(
          <div className={"toastComman"}>
            ERC20 balance is insufficient.
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
    } else {
      setErrorResult('You are the creator of this order.');
      setOnChecking(false);
      return false;
    }
  }, [stage]);

  const convertFloat = (value) => {
    var cvalue = value.toString();
    var pos = 0;
    for (var i = 0; i < cvalue.length; i++) {
      if (cvalue[i] == '.') {
        pos = 1;
        continue;
      }
      if (pos) {
        if (cvalue[i] != '0') break;
        pos++;
      }
    }
    return parseFloat(Number(value).toFixed(pos + 1));
  };
  const [finalUsdValue, setFinalUsdValue] = useState(0);
  const [finalUsdTotal, setFinalUsdTotal] = useState(0);

  useEffect(() => {
    const handlePrice = async () => {
      await axios(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
      ).then((res) => {
        console.log("handlePrice", res.data.USD, typeof res.data.USD == undefined);
        if(res.data.USD == undefined) {
          console.log("Error when getting USD price of ether");
          return;
        }
        if(currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)] != "ETH" && currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)] != "WETH"){
          setFinalUsdTotal(
            Number(removeDecimal(getBigNumber(item.erc20TokenAmount).add(getBigNumber(item.fees[0].amount))).toString())
          );
          setFinalUsdValue(
            removeDecimal(getBigNumber(item.erc20TokenAmount))
          );
        }else {
          setFinalUsdTotal(
            Number(removeDecimal(getBigNumber(item.erc20TokenAmount).add(getBigNumber(item.fees[0].amount)).mul(Math.floor(res.data.USD))).toString())
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
    return convertFloat(input / Math.pow(10, decimalForCurrency[TokenAddressList.indexOf(item.erc20Token)]));
  }
  return (
    <div>
      <h1 className={styles.newDesignHeader}>Accept Offer Now</h1>
      <div className={styles.newDesignFlex} style={{ margin: '40px 0 20px' }}>
        <h3 className={styles.buyNowHeader}>{data.name}</h3>
        <div className={styles.square} style={{ background: data.hex }} />
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMain}>Collection</h3>
        <h3
          className={styles.buyItNowMain}
          style={{ textTransform: 'capitalize' }}
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
      <div className={styles.newDesignFlex} style={{ marginBottom: '20px' }}>
        <h3 className={styles.buyNowHeader} style={{ margin: '0' }}>
          Price
        </h3>
        <h3 className={styles.buyNowHeader} style={{ margin: '0' }}>
          {removeDecimal(getBigNumber(item.erc20TokenAmount).add(getBigNumber(item.fees[0].amount)))}{' '}
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
          ''
        )}
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>
            {
              removeDecimal(getBigNumber(item.fees[0].amount).div("75").mul("25"))
            }{' '}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        ) : (
          ''
        )}
      </div>
      <div className={styles.newDesignFlex}>
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>Collection Fee</h3>
        ) : (
          ''
        )}
        {item.order_direction == 1 ? (
          <h3 className={styles.buyItNowMainSub}>
            {
              removeDecimal(getBigNumber(item.fees[0].amount).div("75").mul("50"))
            }{' '}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        ) : (
          ''
        )}
      </div>
      <div className={styles.offerLine} />
      <div className={styles.newDesignFlex} style={{ marginBottom: '20px' }}>
        {item.order_direction == 1 ? (
          <h3 className={styles.buyNowHeader}> You will receive</h3>
        ) : (
          'Total'
        )}

        {item.order_direction == 1 ? (
          <h3 className={styles.buyNowHeader}>
            {
              removeDecimal(getBigNumber(item.erc20TokenAmount))
            }
            {' '}
              {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        ) : (
          <h3 className={styles.buyNowHeader}>
            {removeDecimal(getBigNumber(item.erc20TokenAmount).add(getBigNumber(item.fees[0].amount)))}{' '}
            {currencyArrayForPrint[TokenAddressList.indexOf(item.erc20Token)]}
          </h3>
        )}
      </div>
      <div className={styles.newDesignFlex}>
        <h3 className={styles.buyItNowMainSub}>USD value</h3>
        <h3 className={styles.buyItNowMainSub}>
          {item.order_direction == 1
            ? finalUsdValue.toFixed(2)
            : finalUsdTotal.toFixed(2)}{' '}
          USD
        </h3>
      </div>
      {
        pendingStatue == 0 ? 
        <div className={stylesForBottomPart.emailLoaderContainer}>
          <MoonLoader size={32} />
          <h4>
            Checking...
          </h4>
        </div>
        : pendingStatue >= 1 ?
          <div>
            <button className={stylesNewTokenId.newWhiteButton} style={{ cursor: 'not-allowed' }}>
              NOT ENOUGH FUNDS
            </button>
          </div>
        : ("")
      }
    </div>
  );
};

export default CheckOrderStatus;
