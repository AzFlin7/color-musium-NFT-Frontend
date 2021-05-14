import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MakeOfferComponent from "./MakeOfferComponent";
import ApproveTokenComponent from "./ApproveTokenComponent";
import ConfirmOfferComponent from "./ConfirmOfferComponent";
import ConfirmOfferComponentOff from "./ConfirmOfferComponentOff";
import { isMobile } from "react-device-detect";
import { FiChevronRight } from "react-icons/fi";

const makeOrderStepWizard = ({
  orderStepWizardOpen,
  setOrderStepWizardOpen,
  number,
  data,
  getAvailableOrders,
  ownerOfNFT,
}) => {
  /*-------------------------- Redux variables ----------------------------*/
  const { connectedAddress } = useSelector((state) => state.minting);
  const { web3 } = useSelector((state) => state.minting);

  /*---------------------- useState var --------------------*/
  const [stage, setStage] = useState(1); //  stage of the step wizard
  const [selectedCurrency, setSelectedCurrency] = useState("WETH");
  const [selectedCurrencyInput, setSelectedCurrencyInput] = useState(
    data.price_in_eth
      ? selectedCurrency === null ||
        selectedCurrency === "WETH" ||
        selectedCurrency === "ETH"
        ? data.price_in_eth.toFixed(2)
        : data.price_in_usd.toFixed(2)
      : "0"
  );

  const [expireHour, setExpireHour] = useState(""); //expiryDat unit is hour
  const [onChain, setOnChain] = useState("");

  /*------------------- CODE BLOCK START : start, middle, end of making order step functions are here-----------------------*/
  useEffect(() => {
    if (connectedAddress) {
      setStage(1);
    }
  }, [connectedAddress]);

  const setOfferInfo = async (
    //after pass the make offer we need to set the order info (selectedCurrencyInput, selectedCurrency, expireHour)
    selectedCurrencyInputFromStepWizard,
    selectedCurrencyFromStepWizard,
    expireHourFromStepWizard,
    orderType
  ) => {
    setSelectedCurrencyInput(selectedCurrencyInputFromStepWizard);
    setSelectedCurrency(selectedCurrencyFromStepWizard);
    setExpireHour(expireHourFromStepWizard);
    setOnChain(orderType);
  };

  const afterOrderConfirmed = async () => {
    //  after the order is created we need to close the step wizard and go to stag 1, and also update the available orders list
    getAvailableOrders();
    setTimeout(() => {
      setOrderStepWizardOpen(false);
      setStage(1);
    }, 5000);
  };

  const closeStepBecauseOfError = async () => {
    setStage(1);
    setOrderStepWizardOpen(false);
  };
  /*---------------- CODE BLOCK END -------------------------*/

  const [isTokenBack, setIsTokenBack] = useState(false);
  // useEffect(() => {
  //   setStage(3);
  // }, [orderStepWizardOpen]);

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      isOpen={orderStepWizardOpen}
      title={
        <div className={styles.newPurchaseTitle}>
          {stage === 1 ? (
            connectedAddress == ownerOfNFT ? (
              "Make a sell offer"
            ) : isTokenBack ? (
              <div className={styles.breadcrumb}>
                <span>
                  {connectedAddress &&
                  ownerOfNFT &&
                  connectedAddress.toLowerCase() == ownerOfNFT.toLowerCase()
                    ? "List"
                    : "Bid"}
                </span>
                <FiChevronRight
                  className={styles.rightIcon}
                  width={25}
                  height={25}
                />
                <span
                  style={{ color: "#565656", cursor: "pointer" }}
                  onClick={() => setStage(2)}
                >
                  Approve
                </span>
              </div>
            ) : connectedAddress &&
              ownerOfNFT &&
              connectedAddress.toLowerCase() == ownerOfNFT.toLowerCase() ? (
              "List"
            ) : (
              "Bid"
            )
          ) : stage === 3 ? (
            connectedAddress == ownerOfNFT ? (
              "Make sell offer"
            ) : (
              "Make a buy offer"
            )
          ) : (
            <div className={styles.breadcrumb}>
              <span
                style={{ color: "#565656", cursor: "pointer" }}
                onClick={() => {
                  setStage(1);
                  setIsTokenBack(true);
                }}
              >
                {connectedAddress &&
                ownerOfNFT &&
                connectedAddress.toLowerCase() == ownerOfNFT.toLowerCase()
                  ? "List"
                  : "Bid"}
              </span>
              <FiChevronRight
                className={styles.rightIcon}
                width={25}
                height={25}
              />
              <span>Approve</span>
            </div>
          )}
          <IoCloseSharp
            onClick={() => {
              if (stage === 3) {
                setOrderStepWizardOpen(false);
                setStage(1);
              } else {
                setOrderStepWizardOpen(false);
              }
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        if (stage === 3) {
          setOrderStepWizardOpen(false);
          setStage(1);
        } else if (stage === 1) {
          setOrderStepWizardOpen(false);
        } else {
          setStage((stage -= 1));
        }
      }}
    >
      {stage === 1 ? (
        <MakeOfferComponent //  set the information of order here
          data={data}
          stage={stage}
          setStage={setStage}
          setOfferInfo={setOfferInfo}
          title={connectedAddress == ownerOfNFT ? "Sell" : "Buy"}
          number={number}
        />
      ) : stage === 2 ? (
        <ApproveTokenComponent //  approve the token if needed
          selectedCurrency={selectedCurrency}
          selectedCurrencyInput={selectedCurrencyInput}
          setStage={setStage}
          stage={stage}
          tokenType={connectedAddress == ownerOfNFT ? "ERC721" : "ERC20"}
          sellOffer={connectedAddress == ownerOfNFT ? true : false}
          number={number}
        />
      ) : onChain ? (
        <ConfirmOfferComponent // create order
          title={connectedAddress == ownerOfNFT ? "Sell" : "Buy"}
          selectedCurrency={selectedCurrency}
          selectedCurrencyInput={selectedCurrencyInput}
          expireHour={expireHour}
          number={number}
          data={data}
          afterOrderConfirmed={afterOrderConfirmed}
          ownerOfNFT={ownerOfNFT}
        />
      ) : (
        <ConfirmOfferComponentOff // create order
          title={connectedAddress == ownerOfNFT ? "Sell" : "Buy"}
          selectedCurrency={selectedCurrency}
          selectedCurrencyInput={selectedCurrencyInput}
          expireHour={expireHour}
          number={number}
          data={data}
          afterOrderConfirmed={afterOrderConfirmed}
          ownerOfNFT={ownerOfNFT}
          closeStepBecauseOfError={closeStepBecauseOfError}
        />
      )}
    </SlidingPane>
  );
};

export default makeOrderStepWizard;
