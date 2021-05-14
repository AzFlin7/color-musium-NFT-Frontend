import { useSelector, useDispatch } from 'react-redux';
import Web3 from 'web3';
import styles from '../../styles/modules/mint/mint.module.css';
import { MESSAGE, SMARTCONTRACTADDR } from '../../utils/constants';
import { ErrorOn, MessageObj } from '../../store/actions/updateMint';
import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import toast from 'react-hot-toast';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const SignRequest = ({ setAllowAPI, tokenId }) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  const dispatch = useDispatch();
  const [web3, setWeb3] = useState(null);
  const { account, library } = useWeb3React();
  useEffect(() => {
    if (account && library) {
      setWeb3(new Web3(library.givenProvider));
    } else {
      setWeb3(new Web3(window.ethereum));
    }
  }, [library]);
  const signTransaction = async () => {
    try {
      const contract = new web3.eth.Contract(
        [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
              },
            ],
            name: 'ownerOf',
            outputs: [
              {
                internalType: 'address',
                name: '',
                type: 'address',
              },
            ],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        SMARTCONTRACTADDR
      );
      const ownerAddress = await contract.methods.ownerOf(tokenId).call();
      // const message = web3.utils.sha3("Hello World");
      const message = MESSAGE;
      const provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/1d63583bc1bc48ff941b5a62a0518da4");
      const web3sign = new Web3(provider);
//      const signature = await web3sign.eth.personal.sign(message, connectedAddress);
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [
          message,
          connectedAddress,
        ],
      });
      localStorage.setItem("ownSignature",signature);
      localStorage.setItem("ownerAddress",ownerAddress);
      // const signer = await web3sign.eth.personal.ecRecover(message, signature);
      const recoveredAddr= web3sign.eth.accounts.recover(message, signature);
      if (ownerAddress.toLowerCase() === recoveredAddr.toLowerCase())
        setAllowAPI(true);
      else {
        toast(
          <div className={'toastComman'}>
            You are not the owner
            <IoClose
              size={25}
              onClick={(t) => {
                toast.dismiss(t.id);
              }}
            />
          </div>,
          {
            style: {
              border: '1px solid #f0291a',
            },
          }
        );
        // dispatch(
        //   MessageObj({
        //     heading: 'Error',
        //     text: 'You are not the owner',
        //   })
        // );
        // dispatch(ErrorOn());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button
        className={styles.disconnectButton}
        onClick={() => signTransaction()}
      >
        Sign
      </button>
    </>
  );
};

export default SignRequest;
