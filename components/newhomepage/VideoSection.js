import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/modules/newhomepage/videoSection.module.css";
// import '~video-react/dist/video-react.css';
import {
  BigPlayButton,
  ControlBar,
  PlaybackRateMenuButton,
  Player,
  PlayToggle,
} from "video-react";
import "video-react/dist/video-react.css";
import Fullscreen from "fullscreen-react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Link from "next/link";

const VideoSection = () => {
  const [videoRef, setVideoRef] = useState();
  const [videoState, setVideoState] = useState();

  function handleBind(state) {
    setVideoState(state);
  }

  useEffect(() => {
    if (videoRef) {
      videoRef.subscribeToStateChange(handleBind);
    }
  }, [videoRef, videoState]);

  const [isEnter, setIsEnter] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setIsEnter(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [isEnter]);

  const [linkUrl, setlinkUrl] = useState(false);

  const [utm_source, setUtm_source] = useState();
  const [utm_medium, setUtm_medium] = useState("colorMuseumHomepage");
  const [utm_campaign, setUtm_campaign] = useState();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const utm_source = queryParams.get("utm_source");
    const utm_medium = queryParams.get("utm_medium");
    const utm_campaign = queryParams.get("utm_campaign");

    if (utm_source != null && utm_medium != null && utm_campaign != null) {
      setUtm_source(utm_source);
      // setUtm_medium(utm_medium)
      setUtm_campaign(utm_campaign);
      setlinkUrl(true);
    } else {
      setlinkUrl(false);
    }
  }, [videoState]);

  return (
    <div className={styles.videoSection}>
      <div className={styles.videoContainer}>
        <div
          className={`${styles.videoInnerContainer} ${styles.mobileVersion}`}
        >
          <div className={styles.mobileContainer}>
            <div className={styles.topPart}>
              <h3>GENESIS AVATAR COLLECTION</h3>
              <h4>MINT DATE: 10.1.22</h4>
            </div>
          </div>
          <div className={styles.videoPlayBtn}>
            <Fullscreen isEnter={isEnter} onChange={setIsEnter}>
              <>
                {isEnter && (
                  <div className={styles.mobileVideo}>
                    <AiOutlineCloseCircle
                      size={50}
                      className={styles.closeVideoPopup}
                      onClick={() => setIsEnter(false)}
                    />
                    <Player
                      ref={(ref) => setVideoRef(ref)}
                      playsInline
                      muted={false}
                      autoPlay={true}
                      src={"/images/newHomepage/mobileHomepage.mp4"}
                    >
                      <ControlBar autoHide={true} disableDefaultControls={true}>
                        <PlayToggle />
                      </ControlBar>
                      <BigPlayButton position="center" />
                    </Player>
                  </div>
                )}
              </>
            </Fullscreen>
            <img
              src="/images/newHomepage/mobileRegfoolVideo.png"
              alt="omarFarooqComms"
              className={styles.image}
              onClick={() => {
                setIsEnter(true);
              }}
            />
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.bottomPart}>
              <div className={styles.text}>
                <h1>TEN THOUSAND RUGS READY TO DO DUE DILIGENCE.</h1>
                <p>Free mint for Color NFT holders.</p>
              </div>
              <div>
                <Link
                  href={`${
                    linkUrl
                      ? `https://www.rugfools.com?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}`
                      : "https://www.rugfools.com?utm_source=colorMuseum&utm_medium=colorMuseumHomepage&utm_campaign=CMlearnMoreButton"
                  }`}
                  passHref
                >
                  <a className={styles.whiteButton} target={"_blank"}>
                    Learn More
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.videoInnerContainer} ${styles.desktopVersion} largeVideo newhomepage`}
          style={{ position: "relative" }}
        >
          <Player
            ref={(ref) => setVideoRef(ref)}
            playsInline
            muted={false}
            poster="/images/newHomepage/videoBg-min.png"
            src={"/images/newHomepage/homeVideoNew.mp4"}
            width={400}
            height={500}
          >
            <ControlBar autoHide={true} disableDefaultControls={true}>
              <PlayToggle />
              {/* <PlaybackRateMenuButton rates={[2, 1.5, 1]} order={7.1} /> */}
            </ControlBar>
            <BigPlayButton position="center" />
          </Player>
          {videoState && videoState.paused ? (
            <>
              <div className={styles.topVideoPart}>
                <div className={styles.videoDate}>
                  GENESIS AVATAR COLLECTION
                </div>
                <div
                  className={`${styles.videoLaunchpad} ${
                    videoState && videoState.paused && styles.whiteText
                  }`}
                  style={{
                    color:
                      videoState && videoState.currentTime > 0
                        ? "#fff"
                        : "#000",
                  }}
                >
                  MINT DATE: 10.1.22
                </div>
              </div>
              <div className={styles.bottomVideoPart}>
                <div className={styles.videoBottomText}>
                  <h1>RUGFOOLS</h1>
                  <h2>
                    10,000 rugs ready to do due diligence. Free mint for Color
                    NFT holders.
                  </h2>
                </div>
                <div className={styles.videoBottomBtn}>
                  <Link
                    href={`${
                      linkUrl
                        ? `https://www.rugfools.com?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}`
                        : "https://www.rugfools.com?utm_source=colorMuseum&utm_medium=colorMuseumHomepage&utm_campaign=CMlearnMoreButton"
                    }`}
                    passHref
                  >
                    <a className={styles.whiteButton} target={"_blank"}>
                      Learn More
                    </a>
                  </Link>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
