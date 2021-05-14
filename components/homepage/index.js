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
import styles from "../../styles/modules/homepage/homepage.module.css";
import DiscountContainer from "./DiscountContainer";
import LastPosts from "./lastPosts";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";

const index = ({ Data, posts }) => {
  const [lastNft, setLastNft] = useState();
  const router = useRouter();
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
    setNumNfts(data[0].numNFT);
  }, []);

  const randomColor = () => {
    const color = Math.floor(Math.random() * Data.documents.length);
    return Data.documents[color].hex;
  };

  return (
    <section
      style={{
        minHeight: "calc(100vh - 123px)",
      }}
    >
      <article className={styles.container}>
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
              <div className={styles.flexContent} style={{ marginTop: "1rem" }}>
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
                    router.push('/comms/beta-v1-is-live')
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
                formatDistance(Date.parse(lastNft.created_at), new Date())}{" "}
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
      </article>
      <DiscountContainer />
      <LastPosts posts={posts} />
    </section>
  );
};

export default index;
