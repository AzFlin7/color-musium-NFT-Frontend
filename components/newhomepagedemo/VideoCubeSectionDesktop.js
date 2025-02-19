import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/newhomepagedemo/videoCubeSectionDesktop.module.css";
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
import TopBlog from "./topBlog";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import AnimatedCards from "./AnimatedCards";
import axios from "axios";
import { useRaf } from "react-use";
import { gsap } from "gsap";
import { NFTCardContainer } from "../gallery/Views";

// const scrollToRef = (ref) => window.scrollTo({ top: ref.current.offsetTop + 50, behavior: 'smooth' });

const VideoCubeSectionDesktop = ({
  Data,
  colors,
  userEmail,
  setUserEmail,
  notValidEmail,
}) => {
  const backendUrl = `https://accounts.color.museum/`;
  const router = useRouter();
  const [videoRef, setVideoRef] = useState();
  const [videoState, setVideoState] = useState();
  const [emailNumber, setEmailCount] = useState();

  const [oneColorSet, setOneColorSet] = useState(0);
  const [onHoverCard, setOnHoverCard] = useState(false);

  // Price increasing or decreasing sort updating
  const [sortData, setSortData] = useState()

  useEffect(() => {
    const sorted =
      Data &&
      Data.documents.sort(function (a, b) {
        if (a.price_in_eth < b.price_in_eth) {
          return 1;
        }
        if (a.price_in_eth > b.price_in_eth) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    setSortData(sorted)
  }, [Data]);


  useEffect(() => {

    onHoverCard ?
      setOneColorSet(oneColorSet)
      :
      setTimeout(() => {
        setOneColorSet(oneColorSet + 1)
      }, 800);

  }, [oneColorSet, onHoverCard])


  const topScroll = useRef();

  const hideOpacity = useRef();

  // useEffect(() => {
  //   handleScrollToElement()
  // }, [router])

  // const handleScrollToElement = () => {
  //   scrollToRef(topScroll)
  // }

  useEffect(() => {
    var divtl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    divtl.fromTo(
      hideOpacity.current,
      {
        opacity: 0,
        duration: 0,
      },
      {
        opacity: 0,
        duration: 0.6,
        ease: "expo.out",
      }
    );
    divtl.to(
      hideOpacity.current,
      {
        opacity: 1,
        duration: 0.6,
      },
      "+=1"
    );

    divtl.to(
      hideOpacity.current,
      {
        opacity: 0,
        duration: 1,
      },
      "+=11.6"
    );
  }, []);



  useEffect(() => {
    async function fetchcountdata() {
      const numEmail = await axios.get(`${backendUrl}getEmailCount/`);
      console.log("asdfasdfasdfasdfsadf", numEmail);
      setEmailCount(numEmail.data.count);
    }
    fetchcountdata();
  }, []);

  const play = () => {
    return videoRef && videoRef.play();
  };

  useEffect(() => {
    if (
      (videoState && videoState.duration) ===
      (videoState && videoState.currentTime)
    ) {
      play();
    }
  }, [videoState, videoRef, router]);

  useEffect(() => {
    if (videoState) {
      return () => {
        videoState.loop = true;
      };
    }
  }, [videoState, videoRef, router]);



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

  return (
    <>
      <div className={styles.videoDivDesktop}>
        <Player
          ref={(ref) => setVideoRef(ref)}
          playsInline={true}
          muted={true}
          autoPlay={true}
          // poster="/images/newHomepage/videoBg.png"
          src={"/images/video/crophomepage.m4v"}
          width={"100%"}
          height={"100%"}
        >
          <ControlBar
            disableCompletely={false}
            autoHide={true}
            disableDefaultControls={true}
          >
            <PlayToggle />
            {/* <PlaybackRateMenuButton rates={[2, 1.5, 1]} order={7.1} /> */}
          </ControlBar>
          <BigPlayButton position="right-bottom" />
          <ReplayControl seconds={videoState && videoState.duration === videoState.currentTime && 30} />
        </Player>
      </div>
      <article className={styles.container}>
        <div className={styles.videoPart}>
          <div className={styles.leftPart}>
            <TopBlog />
            <h2>A NEW DRop studio CREATING NOVEL NFT EXPERIENCES.</h2>
            <button
              className={styles.borderWhiteButton}
              onClick={() => router.push("/comms/beta-v1-is-live")}
            >
              READ ANNOUNCEMENT
            </button>
          </div>
          <div className={styles.rightPart}></div>
        </div>
        <div>
          <div className={styles.logos}>
            <div className={styles.logoInner}>
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

      <div>
        <article className={styles.containerGenesis}>
          <div className={styles.leftPart}>
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
          </div>
          <div className={styles.verticalScroll} >
            <div className={styles.verticalScrollInner}>
              {sortData && sortData.map((card, index) => {
                return (
                  <>
                    <NFTCardContainer
                      id={card.uint256}
                      color={card.hex}
                      name={card.name}
                      number={card.nftNo}
                      price={card.price_in_eth ? card.price_in_eth.toFixed(2) : 0}
                      taretBlank={true}
                    />
                  </>
                );
              })}
            </div>
          </div>
          <div className={styles.rightPart}>
            <img
              src={"/images/newHomepage/congratulations.png"}
              alt="open ai logo"
            />
            <h2>
              <span>$</span>400K
            </h2>
            <h5>raised during Pre-Seed Mint.</h5>
            {/* <button
              className={styles.borderWhiteButton}
            onClick={() => router.push("/gallery/color-nft")}
            >
              READ POST
            </button> */}
          </div>
        </article>
        <article
          className={styles.containerMint}
          style={{ position: "relative", zIndex: "111" }}
        >
          {/* <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <AnimatedCards colors={colors} />
          </div> */}
          <div className={styles.mintPart}>
            <div className={styles.topPart}>
              <h1>mINT COLors AND EARN YIELD.</h1>
              <h2 className={styles.firstContent}>
                Revenue is shared with Color NFT holders from the following
                sources:
              </h2>
            </div>

            <div className={styles.bottoPart}>
              <div className={styles.leftPart}>
                <div className={styles.separate}>
                  <h2>Market transaction fees.</h2>
                  <p>
                    We are building a new, curated marketplace that trades verified and vetted
                    collections, with aggregated liquidity. Use the Color Museum to trade across all major markets.{" "}
                  </p>
                  <p>
                    The Beta market is built on 0x V4 NFT Protocol, supporting onchain and offchain
                    orders via ETH/WETH and stablecoin. Audited and deployed on
                    Ethereum mainnet.{" "}
                  </p>
                  <p>
                    Beating or meeting gas efficiency of the leading Ethereum
                    mainnet market.
                  </p>
                  <Link href="/gallery/color-nft" passHref>
                    <a className={styles.borderWhiteButton}>TOUR THE BETA MARKET</a>
                  </Link>
                  {/* <button
                    className={styles.borderWhiteButton}
                    onClick={() => router.push("/gallery/color-nft")}
                  >
                    TOUR THE BETA MARKET
                  </button> */}
                </div>
                <div className={styles.separate}>
                  <h2>Collection royalty fees.</h2>
                  <p>
                    We are partnering up with new and established artists and brands to launch new collections. {" "}
                  </p>
                  <p>
                    These new collections will use the Color NFT global palette in composition, streaming color royalties to Color NFT holders when they trade on Color Museum and other markets.{" "}
                  </p>
                  <p>
                    Rugfools is our genesis avatar collection to launch.
                  </p>
                  <button
                    className={styles.borderWhiteButton}
                    onClick={() => router.push("/comms/beta-v1-is-live")}
                  >
                    LEARN MORE
                  </button>
                </div>
                <div className={styles.separate}>
                  <h2 className={styles.yieldText}>
                    Yield is won based on color matching or color distance.
                  </h2>
                  <p>
                    Color yield accrues based on exact color matching or to the closest color.
                  </p>
                  <p>
                    The Color NFT Collection is limited to 10,000 colors, but NFT images contain millions of color possibilities. {" "}
                  </p>
                  <p>
                    When an NFT trades with colors that have not been minted as Color NFTs, the fee goes to the closest minted color based on the CIEDE2000 algorithm: color distance.{" "}
                  </p>
                  {/* <button
                    className={styles.borderWhiteButton}
                  onClick={() => router.push("/gallery/color-nft")}
                  >
                    LEARN MORE
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </article>
        {/* <article className={styles.containerForm}>
          <div className={styles.mintPart}>
            <div className={styles.formDiv}>
              <h1>JOIN THE COLOR NFT SEED MINT.</h1>

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
                <h2>Scheduled for September 16, 2022.</h2>
              </form>
              <div className={styles.peopleText}>
                <h2>
                  {emailNumber}
                  <span>Scheduled for September 16, 2022.</span>
                  <span>people on the waitlist.</span>
                </h2>
              </div>
            </div>
          </div>
        </article> */}
      </div>
    </>
  );
};

export default VideoCubeSectionDesktop;
