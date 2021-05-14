import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {
  ErrorOff,
  ErrorOn,
  MessageObj,
  SuccessOff,
  SuccessOn,
} from '../../store/actions/updateMint';
import styles from '../../styles/modules/mint/mint.module.css';
import { BACKEND } from '../../utils/constants';
import toast from 'react-hot-toast';
import stylesNav from '../../styles/modules/nav.module.css';
import { IoClose, IoCloseSharp } from 'react-icons/io5';

const Update = ({ tokenId, receivedColorName, receivedColorNameDesc }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const updateNameAndDesc = async () => {
    const signature = localStorage.getItem('ownSignature');
    const ownerAddress = localStorage.getItem('ownerAddress');
    try {
      const response = await axios.patch(
        `${BACKEND}/api/v1/image/change/${tokenId}`,
        {
          type: 'both',
          name: receivedColorName,
          description: receivedColorNameDesc,
          signature: signature,
          address: ownerAddress
        }
      );
      if (response.data.success) {
        // dispatch(
        //   MessageObj({
        //     heading: 'Success',
        //     text: 'Nft successfully updated',
        //   })
        // );
        // dispatch(SuccessOn());
        setTimeout(() => {
          // dispatch(SuccessOff());
          router.push(`/gallery/color-nft/${tokenId}`);
        }, 2500);
        toast(
          <div className={'toastComman'}>
            Successfully updated.
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
      } else {
        // dispatch(
        //   MessageObj({
        //     heading: 'Error',
        //     text: response.data.error ? response.data.error : 'Nft not upated',
        //   })
        // );
        // dispatch(ErrorOn());

        setTimeout(() => {
          // dispatch(ErrorOff()); 
          router.push(`/change/${tokenId}`);
        }, 2500);
        toast(
          <div className={'toastComman'}>
            {response.data.error ? response.data.error : 'Nft not upated'}
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
    } catch (error) {
      // dispatch(
      //   MessageObj({
      //     heading: 'Error',
      //     text: error.response.data.error
      //       ? error.response.data.error
      //       : 'Nft not upated',
      //   })
      // );
      // dispatch(ErrorOn());
      toast(
        <div className={'toastComman'}> 
          {error.response.data.error
            ? error.response.data.error
            : 'Nft not upated'}
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
    }
  };
  return (
    <button
      className={styles.disconnectButton}
      onClick={() => updateNameAndDesc()}
    >
      Update
    </button>
  );
};

export default Update;
