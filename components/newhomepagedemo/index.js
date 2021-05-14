import { formatDistance } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TopBlog from "./topBlog";
import { FiArrowUpRight } from "react-icons/fi";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { supaAPIUrl, supaCanon } from "../../utils/constants";
import { createClient } from "@supabase/supabase-js";
import styles from "../../styles/modules/newhomepagedemo/newHomepage.module.css";
import DiscountContainer from "./DiscountContainer";
import LastPosts from "./lastPosts";
import VideoSection from "./VideoSection";
import CubeScene from "./CubeScene";
import VideoCubeSectionMobile from "./VideoCubeSectionMobile";
import VideoCubeSectionDesktop from "./VideoCubeSectionDesktop";

function getWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';
  const width = hasWindow ? window.innerWidth : null;
  const height = hasWindow ? window.innerHeight : null;
  return {
    width,
    height
  }
}

const NewHomepageDemo = ({ Data, posts, colors }) => {
  const [lastNft, setLastNft] = useState();
  const router = useRouter();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (Data) {
      setLastNft(
        Data.documents.slice(
          Data.documents.length - 1,
          Data.documents.length
        )[0]
      );
    }
  }, [Data]);

  const supabase = createClient(supaAPIUrl, supaCanon);
  const [numNfts, setNumNfts] = useState(0);

  useEffect(async () => {
    const { data } = await supabase
      .from("collections")
      .select("*")
      .eq("name", "color-nft\n");
    if (data) setNumNfts(data[0].numNFT);
  }, []);

  const randomColor = () => {
    const color = Math.floor(Math.random() * Data.documents.length);
    return Data.documents[color].hex;
  };

  // email validation
  var emailFormat =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [userEmail, setUserEmail] = useState();
  const [notValidEmail, setNotValidEmail] = useState(false);

  useEffect(() => {
    if (userEmail && !userEmail.toLowerCase().match(emailFormat)) {
      setNotValidEmail(true);
    } else {
      setNotValidEmail(false);
    }
  }, [userEmail, notValidEmail]);

  return (
    <>
      {/* <article className={styles.container}>
        <div className={styles.innerContianer}>
          <div className={styles.rowContent}>
            <div className={styles.containerContentLeft}>
              <div className={styles.leftInner}>
                <div className={styles.flexContent}>
                  <h3>
                    <span>Genesis</span> Collection
                  </h3>
                  <h4>
                    <div className={styles.circle} />
                    ERC-721
                  </h4>
                </div>
                <div className={styles.flexContent}>
                  <h1>Color NFT</h1>
                  <h2>by Color Museum</h2>
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
                <div className={styles.mintedColorsContainer}>
                  <div
                    className={styles.circleContainer}
                    style={{
                      width: Data ? `${Data.array.length / 100}%` : "0%",
                      background: randomColor(),
                      overflow: "hidden",
                    }}
                  >
                    {Data.documents.map((item, index) => {
                      return (
                        <div
                          style={{
                            width: "4px",
                            height: "4px",
                            background: item.hex,
                          }}
                          key={index}
                        />
                      );
                    })}
                  </div>
                  <div className={styles.innerContainerFlex}>
                    <h2>{numNfts}</h2>
                    <h3>Colors Minted</h3>
                  </div>
                  <div className={styles.innerContainerFlex}>
                    <h2>10,000</h2>
                    <h4>MAX</h4>
                  </div>
                </div>
                <div
                  className={styles.flexContent}
                  style={{ marginTop: "1rem" }}
                >
                  <button
                    className={styles.whiteButton}
                    onClick={() => router.push("/choose")}
                  >
                    Mint
                  </button>
                  <button
                    className={styles.whiteButton}
                    onClick={() => router.push("/gallery/color-nft")}
                  >
                    Trade
                  </button>
                  <button
                    className={styles.whiteButton}
                    onClick={() => {
                      router.push("/comms/beta-v1-is-live");
                      // toast(
                      //   <div className={"toastComman"}>
                      //     Coming mid-Q3.
                      //     <IoClose
                      //       size={25}
                      //       onClick={(t) => {
                      //         toast.dismiss(t.id);
                      //       }}
                      //     />
                      //   </div>,
                      //   {
                      //     style: {
                      //       background: "#ff660d",
                      //     },
                      //   }
                      // );
                    }}
                  >
                    Earn
                  </button>
                </div>
              </div>
              {!isMobile && <TopBlog />}
            </div>
            <div>
              <h1 className={styles.lastMintedColor}>Last minted color</h1>
              <Link href={`/gallery/color-nft/${lastNft && lastNft.uint256}`}>
                <div
                  className="recentlyContainer"
                  style={{
                    borderColor: lastNft ? lastNft.hex : "#000",
                    textDecoration: "none",
                    display: "block",
                    background: "#000",
                    cursor: "pointer",
                  }}
                >
                  <div className="containerContent">
                    <div className="recentlyHeader">
                      <div className="flex_cardContainer">
                        <div className="logo_cardImage">
                          <Image
                            src={"/images/logo.png"}
                            alt="logo NFTs"
                            data-atropos-offset="5"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                      <div className="address" data-atropos-offset="5">
                        {lastNft ? lastNft.nftNo : "2"}
                      </div>
                    </div>
                    <div
                      className="backgroundContainer"
                      style={{ background: lastNft ? lastNft.hex : "#000" }}
                    ></div>
                    <div
                      className="recentlyHeader"
                      style={{
                        marginTop: "3px",
                      }}
                    >
                      <div
                        className="recentlyP"
                        style={{
                          fontSize: `18px`,
                        }}
                      >
                        {lastNft ? lastNft.name : "Black"}
                      </div>
                      <div
                        className="recentlyP margin_right"
                        style={{
                          textTransform: "uppercase",
                          fontSize: `18px`,
                          color: "#fff",
                        }}
                      >
                        {lastNft ? lastNft.hex : "#000"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <h3 className={styles.mintedFor}>
                Minted for{" "}
                <span>
                  {lastNft &&
                    lastNft.price_in_eth &&
                    lastNft.price_in_eth.toFixed(2)}
                </span>
                <span>ETH</span>
              </h3>
              <h4 className={styles.timeMinted}>
                {lastNft &&
                  formatDistance(
                    Date.parse(lastNft.created_at),
                    new Date()
                  )}{" "}
                ago by{" "}
                <Link
                  href={`/profile/${lastNft && lastNft.ens_name
                    ? lastNft.ens_name
                    : lastNft && lastNft.minting_address
                    }`}
                  passHref
                >
                  <a style={{ width: "auto" }}>
                    {lastNft && lastNft.ens_name
                      ? lastNft.ens_name
                      : lastNft &&
                      lastNft.minting_address !== null &&
                      `${lastNft.minting_address.substring(
                        0,
                        6
                      )}...${lastNft.minting_address.substring(
                        lastNft.minting_address.length - 6
                      )}`}
                  </a>
                </Link>
                <a
                  href={`https://etherscan.io/tx/${lastNft && lastNft.transactionHash
                    }`}
                  target="_blank"
                >
                  <FiArrowUpRight />
                </a>
              </h4>
              {isMobile && <TopBlog />}
            </div>
          </div>
        </div>
      </article> */}
      {/* <DiscountContainer /> */}
      {/* <LastPosts posts={posts} /> */}
      {windowDimensions.width > 1000 ?
        <div className={styles.showDesktop}>
          <VideoCubeSectionDesktop
            Data={Data}
            colors={colors}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            notValidEmail={notValidEmail}
          />
        </div>
        :
        <div className={styles.showMobile}>
          <VideoCubeSectionMobile
            Data={Data}
            userEmail={userEmail}
            setUserEmail={setUserEmail}
            notValidEmail={notValidEmail}
          />
        </div>
      }
      <VideoSection />
      <article className={styles.tableContentSection}>
        <div className={styles.tableContentContainer}>
          {/* <div className={styles.leftPart}>
            <h2>New to Color Museum?</h2>
            <h3>Explore the whitepaper for enlightenment.</h3>
            <div className={styles.listTypeText}>
              <h4>TABLE OF CONTENTS</h4>
              <ul>
                <li>
                  <div className={styles.listDiv}>
                    <p>1</p>
                    <div>
                      <h1>Overview</h1>
                      <h2>A blurb about that chapter.</h2>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>2</p>
                    <div>
                      <h1>History of Color Museum</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>3</p>
                    <div>
                      <h1>BETA Market</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>4</p>
                    <div>
                      <h1>Color NFT</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>5</p>
                    <div>
                      <h1>Launchpad</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>6</p>
                    <div>
                      <h1>Color Yield</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>7</p>
                    <div>
                      <h1>Color NFT Minting Strategies</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>8</p>
                    <div>
                      <h1>Misconceptions</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>9</p>
                    <div>
                      <h1>Rugfools</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>10</p>
                    <div>
                      <h1>Competing with OpenSea</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>11</p>
                    <div>
                      <h1>Roadmap</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>12</p>
                    <div>
                      <h1>Team</h1>
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.listDiv}>
                    <p>13</p>
                    <div>
                      <h1>Community</h1>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div> */}
          <div className={styles.leftPart}>
            <LastPosts posts={posts} />
          </div>
          <div className={styles.rightPart}>
            <div className={styles.tableBoxImg}>
              {/* <img src={"/images/newHomepage/rightTableImg.png"} alt="Sold" /> */}
              <Link href={`/cube`}>
                <div
                  className={styles.containerCude}
                  style={{ cursor: "pointer" }}
                >
                  <CubeScene colors={colors} />
                </div>
              </Link>
              <div className={styles.imgaeBottom}>
                <div className={styles.leftSideText}>
                  <h2>Explore the Color Cube.</h2>
                  <h3>
                    Contains all minted colors spaced based on the CIEDE2000
                    color distance algorithm, which impacts Color Yield
                    distribution.{" "}
                  </h3>
                </div>
                {/* <div className={styles.rightSideBtn}>
                  <button
                    className={styles.whiteButton}
                    onClick={() => router.push("/gallery/color-nft")}
                  >
                    Learn More
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <div className={styles.logos}>
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
          </div>
        </div> */}
      </article>
      {/* <DiscountContainer /> */}
    </>
  );
};

export default NewHomepageDemo;
