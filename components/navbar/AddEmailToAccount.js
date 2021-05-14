import React, { useState, useEffect } from "react";
import { isMobile } from "react-device-detect";
import { IoIosArrowBack } from "react-icons/io";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import styles from "../../styles/modules/newTokenID/createAndLoginAccount.module.css";
import axios from "axios";
import toast from "react-hot-toast";
import stylesNav from "../../styles/modules/nav.module.css";
import { Knock } from "@knocklabs/node";
import { knock_secretKey } from "../../utils/constants";
const knockClient = new Knock(knock_secretKey);

const AddEmailToAccount = ({ setAddEmail, addEmail }) => {
  const backendUrl = `https://accounts.color.museum/`;
  const [userData, setUserData] = useState([]);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [email, setEmail] = useState();

  useEffect(() => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email && email) || re.test(userData && userData.email)) {
      setVerifyEmail(true);
    } else {
      setVerifyEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (addEmail == false) return;
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, [addEmail]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { elements } = e.target;
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email && email)) {
      toast(
        <div className={"toastComman"}>
          {`Invalid Email address : ${email}`}
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
      elements.email.value = null;
      return;
    }
    let connectedAddress = localStorage.getItem("userWalletAccountData");
    let {
      data: { data: users, error: error1 },
    } = await axios.post(`${backendUrl}getUserByAddress/`, {
      address: connectedAddress,
    });
    if (users.length > 0) {
      var kvalue = await knockClient.users.identify(userData.knock_id, {
        email: email,
      });
      const {
        data: { data: data, error: error },
      } = await axios.post(`${backendUrl}updateEmailByUserId`, {
        email,
        user_id: users[0].id,
      });
      userData.email = email;
      elements.email.value = null;
      elements.email.placeholder = userData.email;
      localStorage.setItem("userData", JSON.stringify(userData));

      toast(
        <div className={"toastComman"}>
          {`Updated to ${email}`}
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
  };
  const dispatch = useDispatch();
  return (
    <>
      <SlidingPane
        closeIcon={
          <IoIosArrowBack onClick={() => dispatch(setAddEmail(false))} />
        }
        className={styles.newSlideContainer}
        isOpen={addEmail}
        title={
          <div className={styles.newPurchaseTitle}>
            SETTINGS
            <IoCloseSharp onClick={() => setAddEmail(false)} />
          </div>
        }
        width={isMobile ? "100%" : "30%"}
        onRequestClose={() => {
          setAddEmail(false);
        }}
      >
        <>
          <div className={styles.content}>
            <div
              className={styles.contentTitle}
              style={{ display: "block", margin: "0 0 2.5rem" }}
            >
              <h1
                className={styles.newDesignHeader}
                style={{ marginBottom: ".5rem" }}
              >
                NOTIFICATIONS
              </h1>
              <label>Receive order notifications and receipts by email.</label>
            </div>

            <form
              className={styles.newCreateLoginAccount}
              onSubmit={handleSubmit}
            >
              <label>Email Address:</label>
              {/* {userData.email != null ? (
                <img
                  className={styles.InputIcon}
                  src={"/images/check_icon.png"}
                />
              ) : (
                ""
              )} */}
              <div style={{ position: "relative" }}>
                <input
                  placeholder={
                    userData.email ? userData.email : "Enter an email address"
                  }
                  type="text"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    border: "2px solid #292929",
                    height: "56px",
                    width: "100%",
                    paddingRight: "150px",
                  }}
                />

                <button
                  type="submit"
                  className={`${styles.newWhiteButton} `}
                  style={{
                    fontSize: "18px",
                    padding: "12px 20px",
                    width: "fit-content",
                    height: "fit-content",
                    position: "absolute",
                    right: "0",
                    marginTop: "2px",
                    height: "52px",
                  }}
                >
                  {userData.email == null ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </>
      </SlidingPane>
    </>
  );
};

export default AddEmailToAccount;
