import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ErrorOff, MessageObj } from '../../store/actions/updateMint';
import styles from '../../styles/modules/statusChange/statusChange.module.css';
import toast from 'react-hot-toast';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

const Error = () => {
  const { messageObj } = useSelector((state) => state.updateMint);
  const dispatch = useDispatch();
  const [animation, setAnimation] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(ErrorOff());
      setAnimation(false);
      dispatch(
        MessageObj({
          heading: '',
          text: '',
        })
      );
    }, 5000);
    return () => clearTimeout(timeout);
  }, [animation]);

  return (
    <>
      {animation ? (
        <>
          {messageObj.text && messageObj.text !== ''
            ? null
            : toast(
                <div className={'toastComman'}>
                  Action not verified
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
              )}
        </>
      ) : null}
    </>
  );
};

export default Error;
