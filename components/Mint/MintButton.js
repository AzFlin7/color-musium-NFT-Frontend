import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
import {
  IsMintingOn,
  LocalStorage,
  PriceToMintUsd,
  TransactionHash,
} from '../../store/actions/toggle';
import styles from '../../styles/modules/mint/mint.module.css';
import {
  DISCOUNT_PRICE,
  PROVIDER,
  API_URL,
  SMARTCONTRACTADDR,
} from '../../utils/constants';
import { tokensOfOwnerABI } from '../../utils/tokensOfOwnerABI';
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";

const MintButton = () => {
  const dispatch = useDispatch();
  const [tokenId, setTokenId] = useState('');
  const backendUrl = `https://accounts.color.museum/`;
  // const backendUrl = `http://localhost:3000/`;
  
  const getBigNumber = (input) => {
    if (typeof input === "string") return ethers.utils.parseUnits(input, "wei");
    return ethers.utils.parseUnits(String(input), "wei");
  };

  useEffect(() => {
    if (hexToNumber) {
      if (hexToNumber === 0) {
        setTokenId(1000000);
      } else {
        setTokenId(hexToNumber);
      }
    }
  }, [hexToNumber]);
  //
  const checkDiscountApplicable = async (address) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
    const contract = new web3.eth.Contract(
      [tokensOfOwnerABI],
      SMARTCONTRACTADDR
    );
    const nfts = await contract.methods.tokensOfOwner(address).call();
    return nfts.length > 0 ? true : false;
  };
  const router = useRouter();
  //
  const {
    choosenColorFinal,
    choosenNameFinal,
    choosenDescriptionFinal,
    connectedAddress,
    hexToNumber,
    gasPrice,
    transactionHash,
    web3,
    connector,
    priceToMint,
    pinIsChecked,
  } = useSelector((state) => state.minting);
  const handleRedirect = () => {
    localStorage.setItem('mint-pending-access', true);
    dispatch(LocalStorage());
    router.push('/mint-pending');
  };
  const handleRedirectSuccess = async() => {
    var USDPrice = await axios({
      method: "GET",
      url: `${API_URL}/others/tokenPrice`,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      return res.data.USD;
    });
    let insertObject = {};
    const utm_source = localStorage.getItem("utm_source");
    const utm_medium = localStorage.getItem("utm_medium");
    const utm_campaign = localStorage.getItem("utm_campaign");
    const utm_term = localStorage.getItem("utm_term");
    const utm_content = localStorage.getItem("utm_content");
    const utm_id = localStorage.getItem("utm_id");
    insertObject["utm_source"] = utm_source;
    insertObject["utm_medium"] = utm_medium;
    insertObject["utm_campaign"] = utm_campaign;
    insertObject["utm_term"] = utm_term;
    insertObject["utm_content"] = utm_content;
    insertObject["utm_id"] = utm_id;
    insertObject["address"] = connectedAddress;
    insertObject["ethprice"] = priceToMint;
    insertObject["usdprice"] = getBigNumber(Math.floor(priceToMint * 1000))
    .mul(getBigNumber(Math.floor(USDPrice)))
    .div(getBigNumber(Math.pow(10, 3)));
    console.log("insertObject", insertObject["usdprice"].toString());
    const res = await axios.post(`${backendUrl}setMintedInformation/`, {
      insertObject: insertObject,
    });
    dispatch(IsMintingOn());
    localStorage.setItem('mint-success-access', true);
    dispatch(LocalStorage());
    router.push('/mint-success');
  };
  const handleRedirectFail = () => {
    dispatch(IsMintingOn());
    localStorage.setItem('mint-failed-access', true);
    dispatch(LocalStorage());
    router.push('/mint-failed');
  };
  const sendMint = async () => {
    if (connectedAddress === '') {
      alert('Try Wallet Connection!');
    } else if (hexToNumber === '') {
      alert('Insert Token Id!');
    } else {
      window.dataLayer.push({
        event: 'mint-started',
        wallet_selected: connector, //Metamask, Coinbase Wallet, WalletConnect dynamic wallet name should pass here.
        user_id: connectedAddress, //userbase, user ID should dynamically pass here.
      });

      const contract_address = SMARTCONTRACTADDR;
      const abi = [
        {
          inputs: [],
          name: 'name',
          outputs: [
            {
              internalType: 'string',
              name: '',
              type: 'string',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          constant: true,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_to',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_tokenId',
              type: 'uint256',
            },
          ],
          name: 'mint',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
          payable: true,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'user',
              type: 'address',
            },
          ],
          name: 'isWhiteList',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ];
      const thisAddress = connectedAddress;
      const thisGasPrice = gasPrice !== 0 && gasPrice ? gasPrice : 60000000000;
      let value = web3.utils.toWei(
        localStorage.getItem('EspecificAmount')
          ? localStorage.getItem('EspecificAmount')
          : priceToMint.toString(),
        'ether'
      );
      const contract = new web3.eth.Contract(abi, contract_address);
      const isDiscountApplicable = await checkDiscountApplicable(thisAddress);
      if (isDiscountApplicable && pinIsChecked) {
        // value = value * ((100 - DISCOUNT_PRICE) * 0.01);
        const ethToUsdPrice = async () => {
          let usdPrice = 0;
          await axios(
            'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
          ).then((res) => (usdPrice = res.data.USD));
          let ethPrice = Number(priceToMint);
          ethPrice = ethPrice * ((100 - DISCOUNT_PRICE) * 0.01);
          // dispatch(PriceToMintUsd(usdPrice * ethPrice));
        };
        ethToUsdPrice();
      } else {
        const ethToUsdPrice = async () => {
          let usdPrice = 0;
          await axios(
            'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
          ).then((res) => (usdPrice = res.data.USD));
          let ethPrice = Number(priceToMint);
          // dispatch(PriceToMintUsd(usdPrice * ethPrice));
        };
        ethToUsdPrice();
      }
      await contract.methods
        .mint(thisAddress, tokenId)
        .send({
          from: thisAddress,
          value,
          gas: 220000,
          maxFeePerGas: thisGasPrice,
          maxPriorityFeePerGas: 2000000000,
        })
        .on('transactionHash', function (hash) {
          dispatch(TransactionHash(hash));
          localStorage.setItem('mintingAddress', connectedAddress);
          localStorage.setItem('mintingTransactionHash', hash);
          localStorage.setItem('mintingName', choosenNameFinal);
          localStorage.setItem('mintingColor', choosenColorFinal);
          localStorage.setItem('mintingDescription', choosenDescriptionFinal);
          localStorage.setItem('mintingHexToNumber', hexToNumber);
          handleRedirect();
        })
        .on('confirmation', function (confirmationNumber, receipt) {
          if (confirmationNumber === 1 && receipt.status === true) {
            handleRedirectSuccess();
          }
        })
        .on('failed', function (a) {
          console.log(a);
        })
        .on('receipt', function (receipt) {
          console.log(receipt);
        })
        .on('error', function (error, receipt) {
          console.log(error);
          if (error.message.includes('not mined within 50 blocks')) {
            const handle = setInterval(() => {
              web3.eth.getTransactionReceipt(transactionHash).then((resp) => {
                if (resp != null && resp.blockNumber > 0) {
                  clearInterval(handle);
                  handleRedirectSuccess();
                }
              });
            });
          } else if (
            error.message.includes('User denied transaction signature') ||
            error.message.includes('User rejected the transaction')
          ) {
            console.log('keep on mint page');
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
            null;
          } else {
            handleRedirectFail();
          }
        });
      }
  };

  return (
    <button className={styles.disconnectButton} onClick={() => sendMint()}>
      Mint For {priceToMint} ETH
    </button>
  );
};

export default MintButton;
