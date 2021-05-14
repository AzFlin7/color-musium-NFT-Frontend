import styles from "../../styles/modules/header/slideMenu.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
const { randomHexColor } = require("random-hex-color-generator");

const SlideNavigate = ({ slideMenu, setSlideMenu }) => {
  const router = useRouter();

  const [background, setBackground] = useState("#fff");

  useEffect(() => {
    const interval = setInterval(() => {
      setBackground(randomHexColor());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SlidingPane
      closeIcon={<IoIosArrowBack />}
      className={styles.menuSlideContainer}
      isOpen={slideMenu}
      overlayClassName="some-custom-overlay-class"
      title={
        <div className={styles.headMenuTitle}>
          Menu
          <IoCloseSharp
            size={30}
            onClick={() => {
              setSlideMenu(false);
            }}
          />
        </div>
      }
      width={isMobile ? "100%" : "30%"}
      onRequestClose={() => {
        setSlideMenu(false);
      }}
    >
      <div className={styles.menuContent}>
        <div className={styles.contentTitle}>
          <h1 className={styles.menuHeader}>Navigate</h1>
        </div>
        <div>
          <Link href="/choose" passHref>
            <a className={styles.navigateButton}>
              <div
                className={styles.square}
                style={{ background: background }}
              />
              <span>MINT COLORS</span>
            </a>
          </Link>
          <Link href="/cube" passHref>
            <a className={styles.navigateButton}>
              <div className={styles.imgDiv}>
                <Image
                  src={"https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/fc1ac706-ed6b-40ac-2d92-88fde155d300/public"}
                  width="25px"
                  height="25px"
                  priority={true}
                />
              </div>
              <span>COLOR CUBE</span>
            </a>
          </Link>
          <Link href="/gallery/color-nft" passHref>
            <a className={styles.navigateButton}>
              <div className={styles.imgDiv}>
                <Image
                  src={"https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/0c7c5a94-72e5-4a18-163f-f894e0e63b00/public"}
                  width="25px"
                  height="25px"
                  priority={true}
                />
              </div>
              <span>BETA MARKET</span>
            </a>
          </Link>
          <Link
            href="https://www.rugfools.com?utm_source=colorMuseum&utm_medium=menu&utm_campaign=rugfoolsMenuButton"
            passHref
          >
            <a target={"_blank"} className={styles.navigateButton}>
              <div className={styles.imgDiv}>
                <Image
                  src={"https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/97ec8098-27cb-489a-af94-a1a56f312500/public"}
                  width="25px"
                  height="25px"
                  priority={true}
                />
              </div>
              <span style={{ fontSize: "15px" }}>
                Rugfools
                {/* <img src={"/images/menuImage/rugfoolsTextImg.svg"} alt="" /> */}
              </span>
            </a>
          </Link>
          <Link href="https://www.twitter.com/colordotmuseum" passHref>
            <a target={"_blank"} className={styles.navigateButton}>
              <div className={styles.imgDiv}>
                <Image
                  src={"https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/9f539463-b758-4bd9-a73f-7819bccd2e00/public"}
                  width="30px"
                  height="30px"
                  priority={true}
                />
              </div>
              <span> TWITTER</span>
            </a>
          </Link>
          <Link href="https://discord.gg/colormuseum" passHref>
            <a target={"_blank"} className={styles.navigateButton}>
              <div className={styles.imgDiv}>
                <Image
                  src={"https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/2d306e43-4641-4d59-274a-138e09bfc700/public"}
                  width="25px"
                  height="25px"
                  priority={true}
                />
              </div>
              <span>DISCORD</span>
            </a>
          </Link>
          <Link href="/comms" passHref>
            <a className={styles.navigateButton}>
              <div className={styles.imgDiv}>
                <Image
                  src={"https://imagedelivery.net/furqUze10SH4m_58FGg1OQ/4fdee957-8505-47a3-1c99-8fd5f7f65800/public"}
                  width="25px"
                  height="25px"
                  priority={true}
                />
              </div>
              <span>BLOG</span>
            </a>
          </Link>
        </div>
      </div>
    </SlidingPane>
  );
};

export default SlideNavigate;
