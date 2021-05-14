import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import Switch from "react-switch";
import OtpInput from "react-otp-input";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { OnPinChecked, PriceToMint } from "../../store/actions/toggle";
import Web3 from "web3";
import {
  DISCOUNT_PRICE,
  PROVIDER,
  SMARTCONTRACTADDR,
} from "../../utils/constants";
import { tokensOfOwnerABI } from "../../utils/tokensOfOwnerABI";
import toast from "react-hot-toast";
import stylesNav from "../../styles/modules/nav.module.css";
import axios from "axios";

const SlideCreateAndLoginAccount = ({
  createAndLoginAccount,
  setCreateAndLoginAccount,
}) => {
  const [stage, setStage] = useState(2);
  const [otpInput, setOtpInput] = useState({ otp: "" });
  const [switchList, setSwitchList] = useState({
    order: false,
    offer: false,
    exclusive: false,
    roadmap: false,
  });
  const backendUrl = `https://accounts.color.museum/`;
  const dispatch = useDispatch();
  const { priceToMint, connectedAddress } = useSelector(
    (state) => state.minting
  );

  const handleAuth = async (e) => {
    e.preventDefault();
    const { elements } = e.target;
    const web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER));
    const contract = new web3.eth.Contract(
      [tokensOfOwnerABI],
      SMARTCONTRACTADDR
    );
    const nfts = await contract.methods.tokensOfOwner(connectedAddress).call();
    //
    const userIsAuthenticated = true;
    if (userIsAuthenticated && nfts.length === 0) {
      toast(
        <div className={"toastComman"}>
          Discount not applicable: no colors detected.
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
    } else if (!userIsAuthenticated) {
      toast(
        <div className={"toastComman"}>
          Invalid PIN.
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
      let p = [];
      for (let i = 0; i < 4; i++) p[i] = elements[i].value;
      let res = await axios.post(`${backendUrl}getPinExpiry/`, { Pin: p });
      if (res.data.data.length < 1) {
        toast(
          <div className={"toastComman"}>
            Invalid PIN.
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
        return;
      }
      let createdDate = new Date(res.data.data[0].created_at);
      let date = new Date();
      if (date - createdDate > 86400000) {
        toast(
          <div className={"toastComman"}>
            Invalid PIN.
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
        return;
      }
      toast(
        <div className={"toastComman"}>
          30% discount applied.
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
      localStorage.setItem("pinChecked", true);
      localStorage.setItem(
        "PinExpired",
        Math.floor(createdDate.getTime()) + 24 * 60 * 60 * 1000
      );
      dispatch(OnPinChecked(true));
      const value = priceToMint * ((100 - DISCOUNT_PRICE) * 0.01);
      // dispatch(PriceToMint(value.toFixed(2)));
    }
  };

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.newSlideContainer}
      overlayClassName="some-custom-overlay-class"
      isOpen={createAndLoginAccount}
      title={
        <div className={styles.newPurchaseTitle}>
          {stage === 1 ? "Create Account or Login" : "Unlock Discount"}
          <IoCloseSharp
            size={30}
            onClick={() => {
              setCreateAndLoginAccount(false);
              setStage(2);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setCreateAndLoginAccount(false);
      }}
    >
      {stage === 1 ? (
        <div className={styles.content}>
          <div className={styles.contentTitle}>
            <h1 className={styles.newDesignHeader}>CREATE ACCOUNT </h1>
            <span>OR LOGIN</span>
          </div>
          <form
            className={styles.newCreateLoginAccount}
            onSubmit={(e) => e.preventDefault()}
          >
            <label>Email Address:</label>
            <input
              placeholder="Enter your email to create an account or login"
              type="text"
            />
            <button type="submit" className={styles.newWhiteButton}>
              proceed
            </button>
          </form>
          <div className={styles.switchList}>
            <div className={styles.switchList}>
              <p className={styles.switchListTitle}>
                With an account, you get:
              </p>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.order}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        order: !switchList.order,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Order Notifications</p>
                </label>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.offer}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        offer: !switchList.offer,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Offers For Your NFTs</p>
                </label>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.exclusive}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        exclusive: !switchList.exclusive,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Exclusive Droplist</p>
                </label>
              </div>
              <div className={styles.switchItem}>
                <label htmlFor="small-radius-switch">
                  <Switch
                    checked={switchList.roadmap}
                    onChange={() =>
                      setSwitchList({
                        ...switchList,
                        roadmap: !switchList.roadmap,
                      })
                    }
                    onColor="#000"
                    onHandleColor="#fff"
                    offColor="#fff"
                    offHandleColor="#000"
                    handleDiameter={20}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={30}
                    width={58}
                    className={styles.react_witch}
                  />
                  <p>Roadmap Updates</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : stage === 2 ? (
        <div className={styles.content}>
          <div className={styles.contentTitle} style={{ marginBottom: "25px" }}>
            <h1 className={styles.newDesignHeader}>ENTER PIN</h1>
          </div>
          <form className={styles.otpForm} onSubmit={(e) => handleAuth(e)}>
            <p className={styles.formDesc}>
              To unlock special offer pricing, enter the provided 4 digit PIN
              code.
            </p>
            <p className={styles.inputCodeTitle}>Input code:</p>
            <OtpInput
              value={otpInput.otp}
              onChange={(otp) => setOtpInput({ otp: otp })}
              numInputs={4}
              className={styles.otpInput}
            />
            <div className={styles.otpButtonList}>
              <button
                type="submit"
                className={styles.newWhiteButton}
                style={{ width: "200px" }}
              >
                AUTHENTICATE
              </button>
            </div>
          </form>
        </div>
      ) : (
        stage === 3 && (
          <div className={styles.content}>
            <div
              className={styles.contentTitle}
              style={{ marginBottom: "24px" }}
            >
              <h1 className={styles.newDesignHeader}>VERIFY EMAIL</h1>
              <span>TO CONTINUE</span>
            </div>
            <form
              className={styles.otpForm}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.formDesc}>
                <p>
                  A verification link has been sent
                  <br /> to <b>theemailprovided@gmail.com</b>
                </p>
              </div>
              <div className={styles.otpButtonList}>
                <button
                  type="submit"
                  className={styles.newWhiteButton}
                  onClick={() => setCreateAndLoginAccount(false)}
                  style={{ width: "200px" }}
                >
                  GO TO GMAIL
                </button>
              </div>
            </form>
          </div>
        )
      )}
      {stage === 1 ? (
        <div className={styles.leftSmallButton}>
          <button
            className={styles.newBorderButton}
            onClick={() => setStage(2)}
          >
            Skip
          </button>
        </div>
      ) : stage === 2 ? (
        <div></div>
      ) : (
        stage === 3 && (
          <div>
            <button
              className={styles.newWhiteButton}
              onClick={() => setStage(1)}
              style={{ width: "250px" }}
            >
              Go To First step
            </button>
          </div>
        )
      )}
    </SlidingPane>
  );
};

export default SlideCreateAndLoginAccount;
