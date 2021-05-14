import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/fixedCollapeFooter.module.css";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import PuffLoader from "react-spinners/PuffLoader";
import toast from "react-hot-toast";
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { FiArrowUpRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { DISCOUNT_PRICE } from "../../utils/constants";
import axios from "axios";
import moment from "moment";

const StickyOffer = (props) => {
  const [whiteTheme, setWhiteTheme] = useState(true);
  const { pinIsChecked } = useSelector((state) => state.minting);

  const backendUrl = `https://accounts.color.museum/`;
  const [stickyCollape, setStickyCollape] = useState(false);
  const [loading, setLoading] = useState(false);
  const topPart = props;
  const [PinExpired, setPinExpired] = useState([]);

  useEffect(() => {
    if (!openSpecialOffer) {
      setStickyCollape(true);
    } else {
      setStickyCollape(false);
    }
  }, [openSpecialOffer]);

  const handleSubmit = async (e) => {
    let connectedAddress = localStorage.getItem("userWalletAccountData");
    e.preventDefault();
    const { elements } = e.target;
    const email = elements.email.value;
    console.log("submit");
    setLoading(true);
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let res;
    let insertObject = {};
    const utm_source = localStorage.getItem("utm_source");
    const utm_medium = localStorage.getItem("utm_medium");
    const utm_campaign = localStorage.getItem("utm_campaign");
    const utm_term = localStorage.getItem("utm_term");
    const utm_content = localStorage.getItem("utm_content");
    const utm_id = localStorage.getItem("utm_id");
    insertObject["Address"] = connectedAddress;
    insertObject["email"] = email;
    insertObject["utm_source"] = utm_source;
    insertObject["utm_medium"] = utm_medium;
    insertObject["utm_campaign"] = utm_campaign;
    insertObject["utm_term"] = utm_term;
    insertObject["utm_content"] = utm_content;
    insertObject["utm_id"] = utm_id;
    if (email && re.test(email))
      res = await axios.post(`${backendUrl}createDiscountPin/`, {
        insertObject: insertObject,
      });
    toast(
      <div className={"toastComman"}>
        {email && re.test(email) && res.data.status == "success"
          ? `Code sent to ${email}`
          : email && re.test(email) && res.data.status != "success"
          ? "Create Pin Failed"
          : !email
          ? "Enter an email address."
          : !re.test(email) && "Invalid email address"}
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
    setTimeout(() => {
      elements.email.value = null;
      setLoading(false);
    }, 1000);
  };
  const stickyOffer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stickyOffer.current && !stickyOffer.current.contains(e.target)) {
        setStickyCollape(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", (e) => {
      e.key === "Escape" && setStickyCollape(false);
    });

    // Bind the event listener
    let pinExpired = new Date(Number(localStorage.getItem("PinExpired")));
    let now = new Date();
    if (pinExpired < now) {
      localStorage.setItem("pinChecked", false);
    }
    setPinExpired(pinExpired);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", (e) => e);
    };
  }, [stickyCollape]);

  useEffect(() => {
    let pinExpired = new Date(Number(localStorage.getItem("PinExpired")));
    setPinExpired(pinExpired);
  }, [pinIsChecked]);

  const isiOS = function iOS() {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
      // iPad on iOS 13 detection
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    );
  };
  // Lock screen scroll
  const lockScroll = React.useCallback(() => {
    document.body.dataset.scrollLock = "true";
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "var(--scrollbar-compensation)";

    if (isiOS) {
      const scrollOffset = window.pageYOffset;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollOffset.current}px`;
      document.body.style.width = "100%";
    }
  }, []);

  // Unlock screen scroll
  const unlockScroll = React.useCallback(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    if (isiOS) {
      const scrollOffset = window.pageYOffset;

      document.body.style.position = "";
      document.body.style.top = ``;
      document.body.style.width = "";
      window.scrollTo(0, scrollOffset.current);
    }
    delete document.body.dataset.scrollLock;
  }, []);

  // Lock screen scroll if filter is opened
  useEffect(() => {
    if (stickyCollape) lockScroll();
    if (!stickyCollape) unlockScroll();
    if (stickyCollape) {
      document.body.classList.add("stickyOfferOpen");
    } else {
      document.body.classList.remove("stickyOfferOpen");
    }
  }, [stickyCollape]);

  return (
    <div className={styles.stickyCollapeMain}>
      <div
        className={`${styles.fixedCollapeFooter} ${
          stickyCollape && styles.active
        } ${topPart.topPart && styles.topPart}`}
        ref={stickyOffer}
        onClick={() => {
          if (!stickyCollape) setStickyCollape(true);
        }}
        style={{
          backgroundColor: whiteTheme && "#FAFAF6",
          borderColor: whiteTheme && "#FAFAF6",
        }}
      >
        {pinIsChecked ? (
          <div className={styles.expandText} style={{ minHeight: "55px" }}>
            <h2
              style={{
                color: whiteTheme && "#060606",
              }}
            >
              {DISCOUNT_PRICE}% DISCOUNT APPLIED
            </h2>
            <h1
              style={{
                color: whiteTheme && "#060606",
              }}
            >
              PIN WILL EXPIRE.
            </h1>
            <h2
              style={{
                color: whiteTheme && "#060606",
              }}
            >
              {/* //            24 hours 52 minutes 12 seconds */}
              {moment(PinExpired).fromNow() === "in a d."
                ? "in a day."
                : moment(PinExpired).fromNow()}
            </h2>
          </div>
        ) : stickyCollape ? (
          <div className={styles.openFixedCollpe}>
            <div className={styles.leftContent}>
              <div className={styles.innerLeftContent}>
                <h2
                  style={{
                    color: whiteTheme && "#060606",
                  }}
                >
                  SEED MINT
                </h2>
                <h1
                  style={{
                    color: whiteTheme && "#060606",
                  }}
                >
                  {" "}
                  REGISTER FOR THE COLOR NFT SEED MINT
                </h1>
                <p
                  style={{
                    color: whiteTheme && "#060606",
                  }}
                >
                  Rugfools mint on October 1, 2022. 1 Color NFT = 1 free Rugfool
                  NFT on mint date.
                </p>
              </div>
            </div>
            <div className={styles.rightContent}>
              <form
                className={styles.newCreateLoginAccount}
                onSubmit={handleSubmit}
              >
                <p
                  style={{
                    color: whiteTheme && "#060606",
                  }}
                >
                  SCHEDULED FOR SEPTEMBER 16, 2022
                </p>
                <div className={styles.inputAndButton}>
                  <input
                    placeholder="Enter your email"
                    type="text"
                    name="email"
                  />
                  <button
                    type="submit"
                    className={`${styles.newWhiteButton} ${
                      loading && styles.loadButton
                    }`}
                  >
                    {loading && (
                      <div className={styles.puffLoader}>
                        <PuffLoader color="#000" size={30} />
                      </div>
                    )}
                    REGISTER
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.expandText}>
              <h2
                style={{
                  color: whiteTheme && "#060606",
                }}
              >
                SEED MINT
              </h2>
              <h1
                style={{
                  color: whiteTheme && "#060606",
                }}
              >
                REGISTER FOR THE COLOR NFT SEED MINT
              </h1>
              <h2
                style={{
                  color: whiteTheme && "#060606",
                }}
              >
                SCHEDULED FOR SEPTEMBER 16, 2022
              </h2>
              {!stickyCollape && (
                <div
                  className={styles.mobileCollapeIcon}
                  onClick={() => setStickyCollape(!stickyCollape)}
                  style={{
                    borderColor: whiteTheme && "#FAFAF6",
                  }}
                >
                  {stickyCollape ? (
                    <MdKeyboardArrowUp
                      size={50}
                      color={whiteTheme ? "#272727" : "#fff"}
                    />
                  ) : (
                    <MdKeyboardArrowDown
                      size={50}
                      color={whiteTheme ? "#272727" : "#fff"}
                    />
                  )}
                </div>
              )}
            </div>
          </>
        )}
        {!pinIsChecked && stickyCollape && (
          <div
            className={styles.collapeIcon}
            onClick={() => setStickyCollape(!stickyCollape)}
            style={{
              borderColor: whiteTheme && "#FAFAF6",
            }}
          >
            {stickyCollape ? (
              <MdKeyboardArrowUp
                size={50}
                color={whiteTheme ? "#272727" : "#fff"}
              />
            ) : (
              <MdKeyboardArrowDown
                size={50}
                color={whiteTheme ? "#272727" : "#fff"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyOffer;
