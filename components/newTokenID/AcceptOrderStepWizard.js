import styles from '../../styles/modules/newTokenID/createAndLoginAccount.module.css';
import { IoIosArrowBack } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CheckOrderStatus from './CheckOrderStatus';
import ApproveTokenComponentForAccepting from './ApproveTokenComponentForAccepting';
import AcceptOfferComponent from './AcceptOfferComponent';
import { isMobile } from 'react-device-detect';

const AcceptOrderStepWizard = ({
  acceptOfferNew,
  setAcceptOfferNew,
  item,
  data,
  getPastOrders,
  getAvailableOrders,
  ownerOfNFT,
}) => {
  const { connectedAddress } = useSelector((state) => state.minting);
  useEffect(() => {
    if (connectedAddress) {
      setStage(1);
    }
  }, [connectedAddress]);
  const [stage, setStage] = useState(1);

  const afterOrderAccepted = () => {
    getAvailableOrders();
    getPastOrders();
    setTimeout(() => {
      setAcceptOfferNew(false);
      setStage(1);
    }, 5000);
  };

  const closeBecauseOfError = () => {
    setAcceptOfferNew(false);
    setStage(1);
  }

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={acceptOfferNew}
      title={
        <div className={styles.newPurchaseTitle}>
          Accept Offer
          <IoCloseSharp
            size={30}
            onClick={() => {
              setAcceptOfferNew(false);
              setStage(1);
            }}
          />
        </div>
      }
      width={isMobile ? '100%' : '30%'}
      onRequestClose={() => {
        setAcceptOfferNew(false);
        setStage(1);
      }}
    >
      {stage === 1 ? (
        <>
          <CheckOrderStatus //  check if order is valid and accepted
            item={item}
            data={data}
            setStage={setStage}
            stage={stage}
            ownerOfNFT={ownerOfNFT}
          />
        </>
      ) : stage === 2 ? (
        <>
          <ApproveTokenComponentForAccepting // approve token if needed
            setStage={setStage}
            stage={stage}
            item={item}
          />
        </>
      ) : stage == 3 ? (
        <AcceptOfferComponent
          stage={stage}
          item={item}
          data={data}
          afterOrderAccepted={afterOrderAccepted}
          closeBecauseOfError={closeBecauseOfError}
          ownerOfNFT={ownerOfNFT}
        />
      ) : null}
    </SlidingPane>
  );
};

export default AcceptOrderStepWizard;
