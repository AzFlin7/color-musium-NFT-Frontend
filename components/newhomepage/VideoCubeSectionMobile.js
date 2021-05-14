import React, { useEffect, useState } from "react";
import styles from "../../styles/modules/newhomepage/videoCubeSectionMobile.module.css";
import {
  BigPlayButton,
  ControlBar,
  PlaybackRateMenuButton,
  Player,
  PlayToggle,
  ReplayControl,
} from "video-react";
import "video-react/dist/video-react.css";
import { FiArrowUpRight } from "react-icons/fi";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { isMobile } from "react-device-detect";

const CubeSection = ({ userEmail, setUserEmail, notValidEmail }) => {
  const backendUrl = `https://accounts.color.museum/`;
  const router = useRouter();
  const [videoRef, setVideoRef] = useState();
  const [videoState, setVideoState] = useState();
  // const [muted, setMuted] = useState()
  const [emailNumber, setEmailCount] = useState();

  useEffect(() => {
    async function fetchcountdata() {
      const numEmail = await axios.get(`${backendUrl}getEmailCount/`);
      console.log("asdfasdfasdfasdfsadf", numEmail);
      setEmailCount(numEmail.data.count);
    }
    fetchcountdata();
  }, []);

  useEffect(() => {
    if (
      (videoState && videoState.duration) ===
      (videoState && videoState.currentTime)
    ) {
      play();
    }
    // if ((videoState && videoState.paused === false) && isMobile) {
    //   play()
    // }
  }, [videoState, videoRef]);

  const play = () => {
    return videoRef && videoRef.play();
  };

  function handleBind(state) {
    setVideoState(state);
  }

  useEffect(() => {
    if (videoRef) {
      videoRef.subscribeToStateChange(handleBind);
    }
  }, [videoRef, videoState]);

  // email submit
  var emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) {
      toast(
        <div className={"toastComman"}>
          please enter email address
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
    } else if (userEmail && userEmail.toLowerCase().match(emailFormat)) {
      let insertObject = {};
      const utm_source = localStorage.getItem("utm_source");
      const utm_medium = localStorage.getItem("utm_medium");
      const utm_campaign = localStorage.getItem("utm_campaign");
      const utm_term = localStorage.getItem("utm_term");
      const utm_content = localStorage.getItem("utm_content");
      const utm_id = localStorage.getItem("utm_id");
      insertObject["domain"] = "www.color.museum";
      insertObject["email"] = userEmail.toLowerCase();
      insertObject["utm_source"] = utm_source;
      insertObject["utm_medium"] = utm_medium;
      insertObject["utm_campaign"] = utm_campaign;
      insertObject["utm_term"] = utm_term;
      insertObject["utm_content"] = utm_content;
      insertObject["utm_id"] = utm_id;
      const res = await axios.post(`${backendUrl}addMintContact/`, {
        insertObject: insertObject,
      });
      toast(
        <div className={"toastComman"}>
          {res.data.status == "success"
            ? `${userEmail} was added`
            : `${res.data.error}`}
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
      if (res.data.status == "success") router.push("/seedMintRegistration");
    } else {
      toast(
        <div className={"toastComman"}>
          invalid email adress
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
  };

  var settings = {
    // dots: false,
    infinite: true,
    // slidesToShow: 3,
    arrows: false,
    // autoplay: true,
    // autoplaySpeed: 2000,
    // initialSlide: true,
    // touchMove: true,
    // touchThreshold: true,

    speed: 2500,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    slidesToShow: 2,
    slidesToScroll: 1,
    // swipeToSlide: true,
    // centerMode: true,
    // focusOnSelect: true,
  };

  return (
    <>
      <article className={styles.container}>
        <div className={styles.videoPart}>
          <div className={styles.topPart}>
            <Player
              ref={(ref) => setVideoRef(ref)}
              playsInline={true}
              muted={false}
              autoPlay={true}
              // poster="/images/newHomepage/videoBg.png"
              src={"/images/video/bg-uiConcept.mp4"}
              width={"100%"}
              height={"100%"}
            >
              <ControlBar
                disableCompletely={true}
                autoHide={true}
                disableDefaultControls={true}
              >
                <PlayToggle />
                {/* <PlaybackRateMenuButton rates={[2, 1.5, 1]} order={7.1} /> */}
              </ControlBar>
              <BigPlayButton position="right-bottom" />
              <ReplayControl seconds={videoState && videoState.duration} />
            </Player>
          </div>
          <div className={styles.bottomPart}>
            <h2>A NEW DRop studio CREATING NOVEL NFT EXPERIENCES.</h2>
            <button
              className={styles.borderWhiteButton}
              onClick={() => router.push("/comms/beta-v1-is-live")}
            >
              READ ANNOUNCEMENT
            </button>
          </div>
        </div>
        <div className={styles.logos}>
          <div className={styles.logoInner}>
            <div className={styles.logoSliderCss}>
              <Link
                href="https://www.vice.com/en/article/3ab5k8/can-you-own-a-color-a-new-nft-marketplace-is-trying-to-find-out"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/viceLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://designtaxi.com/news/417628/NFT-Color-Museum-Claims-You-Can-Own-Hues-Gain-Royalties-From-Them/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/taxiLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://www.harpersbazaar.com/culture/art-books-music/a39957975/you-can-now-buy-a-color-via-nft-what-does-this-mean-for-art/"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/bazaarLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://www.forbes.com/sites/kamranrosen/2022/03/10/color-innovator-pantone-to-give-away-limited-nfts-in-free-raffle/?sh=5859b7726d74"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/forbesLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://www.theatlantic.com/technology/archive/2022/02/future-internet-blockchain-investment-banking/621480/"
                passHref
              >
                <a target={"_blank"}>
                  <img
                    src={"/images/newHomepage/theAtlanticLogo.png"}
                    alt="Sold"
                  />
                </a>
              </Link>
              <Link
                href="https://www.printmag.com/design-news/the-color-museum/"
                passHref
              >
                <a target={"_blank"}>
                  <img
                    src={"/images/newHomepage/thumb_esquirelogo.png"}
                    alt="Sold"
                  />
                </a>
              </Link>
              <Link
                href="https://www.esquiremag.ph/culture/tech/meta-nft-hype-color-museum-a00304-20220208"
                passHref
              >
                <a target={"_blank"}>
                  <img
                    src={"/images/newHomepage/thumb_esquirelogo1.png"}
                    alt="Sold"
                  />
                </a>
              </Link>
              <Link
                href="https://www.creativebloq.com/news/nft-own-a-colour"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/logos/creativeBloqLogo.png"} alt="Sold" />
                </a>
              </Link>
              {/* secound round */}
              <Link
                href="https://www.vice.com/en/article/3ab5k8/can-you-own-a-color-a-new-nft-marketplace-is-trying-to-find-out"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/viceLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://designtaxi.com/news/417628/NFT-Color-Museum-Claims-You-Can-Own-Hues-Gain-Royalties-From-Them/?utm_source=helloFromColorMuseum&utm_medium=helloFromColorMuseum&utm_campaign=helloFromColorMuseum"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/taxiLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://www.harpersbazaar.com/culture/art-books-music/a39957975/you-can-now-buy-a-color-via-nft-what-does-this-mean-for-art/"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/bazaarLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://www.forbes.com/sites/kamranrosen/2022/03/10/color-innovator-pantone-to-give-away-limited-nfts-in-free-raffle/?sh=5859b7726d74"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/newHomepage/forbesLogo.png"} alt="Sold" />
                </a>
              </Link>
              <Link
                href="https://www.theatlantic.com/technology/archive/2022/02/future-internet-blockchain-investment-banking/621480/"
                passHref
              >
                <a target={"_blank"}>
                  <img
                    src={"/images/newHomepage/theAtlanticLogo.png"}
                    alt="Sold"
                  />
                </a>
              </Link>
              <Link
                href="https://www.printmag.com/design-news/the-color-museum/"
                passHref
              >
                <a target={"_blank"}>
                  <img
                    src={"/images/newHomepage/thumb_esquirelogo.png"}
                    alt="Sold"
                  />
                </a>
              </Link>
              <Link
                href="https://www.esquiremag.ph/culture/tech/meta-nft-hype-color-museum-a00304-20220208"
                passHref
              >
                <a target={"_blank"}>
                  <img
                    src={"/images/newHomepage/thumb_esquirelogo1.png"}
                    alt="Sold"
                  />
                </a>
              </Link>
              <Link
                href="https://www.creativebloq.com/news/nft-own-a-colour"
                passHref
              >
                <a target={"_blank"}>
                  <img src={"/images/logos/creativeBloqLogo.png"} alt="Sold" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </article>
      <article className={styles.dropContainer}>
        <div className={styles.dropPart}>
          <div className={styles.leftPart}>
            <h2>ALL DROPS</h2>
          </div>
          <div className={styles.rightPart}>
            <h4>
              <span className={styles.rundCounter}>2</span>
              Collections
            </h4>
          </div>
        </div>
      </article>
      <article className={styles.container}>
        <div className={styles.genesisPart}>
          <div className={styles.topPart}>
            <div className={styles.flexContent}>
              <h3>Genesis Collection</h3>
              <div className={styles.circle} />
              <h4>ERC-721</h4>
            </div>
            <div className={styles.flexContent}>
              <h1>Color NFT</h1>
            </div>
            <h2 className={styles.liveEthereum}>
              <span>Now live on Ethereum mainnet. </span>
              <a
                href="https://etherscan.io/address/0xcf12413f738ad3a14b9810ba5f86e59fcd9baadf"
                target="_blank"
              >
                <FiArrowUpRight />
              </a>
            </h2>
            <div className={styles.postPart}>
              <button
                className={styles.whiteButton}
                // onClick={() => router.push("/gallery/color-nft")}
              >
                <span>$</span> 400K
              </button>
              <h5>raised during Pre-Seed Mint.</h5>
              {/* <button
                className={styles.borderWhiteButton}
              onClick={() => router.push("/gallery/color-nft")}
              >
                READ POST
              </button> */}
            </div>
            <div className={styles.mintPartMain}>
              <div className={styles.mintPart}>
                <h1>mINT COLors AND EARN YIELD.</h1>
                <h2 className={styles.firstContent}>
                  Revenue is shared with Color NFT holders from the following
                  sources:
                </h2>
                <div className={styles.separate}>
                  <h2>Market transaction fees.</h2>
                  <p>
                    A new, curated marketplace that trades verified and vetted
                    collections, with aggregated liquidity.{" "}
                  </p>
                  <p>
                    Built on 0x V4 NFT Protocol, supporting onchain and offchain
                    orders via ETH/WETH and stablecoin. Audited and deployed on
                    Ethereum mainnet.{" "}
                  </p>
                  <p>
                    Beats or meets gas efficiency of the leading marketplace.
                  </p>

                  <Link href="/gallery/color-nft" passHref>
                    <a className={styles.borderWhiteButton}>
                      TOUR THE BETA MARKET
                    </a>
                  </Link>
                </div>
                <div className={styles.separate}>
                  <h2>Collection royalty fees.</h2>
                  <p>Statement.</p>
                </div>
                <div className={styles.separate}>
                  <h2 className={styles.yieldText}>
                    Yield is won based on color matching or color distance.
                  </h2>
                  <p>Statement.</p>
                  {/* <button
                  className={styles.borderWhiteButton}
                onClick={() => router.push("/gallery/color-nft")}
                >
                  LEARN MORE
                </button> */}
                </div>
              </div>
            </div>
            <div className={styles.formDiv}>
              <div className={styles.innerFormDiv}>
                <h1>JOIN THE seed mint.</h1>
                <h2>Scheduled for September 16, 2022.</h2>

                <div className={styles.peopleText}>
                  <h2>
                    {emailNumber} <span>people on the waitlist.</span>
                  </h2>
                </div>
                <form className={styles.registerForm} onSubmit={handleSubmit}>
                  <input
                    placeholder="ENTER YOUR EMAIL ADDRESS"
                    type="text"
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                    }}
                    style={{ borderColor: notValidEmail ? "red" : "#fff" }}
                  />
                  <button type="submit" className={styles.greenButton}>
                    REGISTER FOR COLOR NFT SEED MINT
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className={styles.bottomPart}></div>
        </div>
      </article>
    </>
  );
};

export default CubeSection;
