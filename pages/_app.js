import "../styles/globals.css";
import Nav from "../components/navbar";
import { storeWrapper } from "../store";
import { Dock } from "../components/navbar/Dock/Dock";
import Footer from "../components/footer/Footer";
import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  BlacklistedHex,
  BlacklistedName,
  ColorChange,
  ColorsAlreadyMinted,
  DescriptionChange,
  GasPrice,
  HexToNumber,
  NameChange,
  OnPinChecked,
  PriceToMint,
} from "../store/actions/toggle";
import { randomHexColor } from "random-hex-color-generator";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import TagManager from "react-gtm-module";
import Gleap from "gleap";
import { Toaster } from "react-hot-toast";
import { DISCOUNT_PRICE } from "../utils/constants";
import { isMobile } from "react-device-detect";
import moment from "moment";
import styles from "../styles/modules/homepage/firstSection.module.css";
import Loader from "../components/Loader/Loader";
import KnockSlider from "../components/knockSlider/KnockSlider";

import PlausibleProvider from "next-plausible";

const Web3Utils = require("web3-utils");

const getLibrary = (provider) => {
  return new Web3(provider);
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-PB9P7KR" });
  }, []);

  const { choosenColorFinal, pinIsChecked } = useSelector(
    (state) => state.minting
  );
  const { fullWidthPage } = useSelector((state) => state.toggle);

  const dispatch = useDispatch();
  useEffect(() => {
    const handleColors = async () => {
      var data;
      try {
        data = await axios("https://metadata.color.museum/api/v1/image/");
      } catch (e) {}
      dispatch(ColorsAlreadyMinted(data.data.array));
    };
    handleColors();
    dispatch(BlacklistedHex());
    dispatch(BlacklistedName());
    //
    //
    const handleGas = async () => {
      await axios("https://api.gasprice.io/v1/estimates").then((res) => {
        dispatch(
          GasPrice((res.data.result.instant.feeCap * 1000000000).toFixed(0))
        );
      });
    };
    handleGas();
    //
    //
    const queryParams = new URLSearchParams(window.location.search);
    const color = queryParams.get("color");
    const name = queryParams.get("name");
    const description = queryParams.get("description");
    if (color && name && description) {
      dispatch(ColorChange(`#${color}`));
      dispatch(NameChange(name));
      dispatch(DescriptionChange(description));
    } else if (localStorage.getItem("choosenColor")) {
      let value = localStorage.getItem("choosenColor").split(", ");
      dispatch(ColorChange(value[0].slice(7, 14)));
      if (value[1]) {
        dispatch(NameChange(value[1].slice(6)));
      }
      if (value[2]) {
        dispatch(DescriptionChange(value[2].slice(13)));
      }
    } else if (choosenColorFinal.length === 0) {
      const color = randomHexColor();
      dispatch(ColorChange(color));
    }
  }, []);
  //
  //
  useEffect(() => {
    if (choosenColorFinal !== "") {
      let color = choosenColorFinal.slice(1, choosenColorFinal.length);
      color = Web3Utils.hexToNumber(`0x${color}`);
      dispatch(HexToNumber(color));
    }
  }, [choosenColorFinal]);

  const [pageLoading, setPageLoading] = useState(false);
  const router = useRouter();
  const [inHomePage, setInHomePage] = useState(false);
  const [topPart, setTopPart] = useState(false);

  const [effectiveType, setEffectiveType] = useState("4g");
  useEffect(() => {
    setEffectiveType(
      navigator.connection ? navigator.connection.effectiveType : "4g"
    );
  }, []);
  useEffect(() => {
    Router.onRouteChangeStart = (url) => {
      // Some page has started loading
      if (
        effectiveType === "3g" ||
        effectiveType === "2g" ||
        effectiveType === "slow-2g"
      ) {
        setPageLoading(true);
      }
    };

    Router.onRouteChangeComplete = (url) => {
      // Some page has finished loading
      setTimeout(() => {
        setPageLoading(false);
      }, 1000);
    };

    Router.onRouteChangeError = (err, url) => {
      // an error occurred.
      setPageLoading(true);
    };
  }, [Router]);

  useEffect(() => {
    // Run within useEffect to execute this code on the frontend.
    Gleap.initialize("hjFQgtr4guUqv8p9TLyiyF24mu3Ou3l3");
  }, []);

  useEffect(() => {
    router.asPath === "/trade" && router.push("/gallery/color-nft");
    router.asPath === "/gallery" && router.push("/gallery/color-nft");
    router.asPath === "/mint-colors" && router.push("/choose");
  }, [router]);

  useEffect(() => {
    setPageLoading(true);
    if (
      router.pathname === "/" ||
      router.pathname === "/videohomepage" ||
      router.pathname === "/videohomepagenew" ||
      window.location.host === "http://localhost:3000" ||
      ("www.color.museum" && window.location.href.indexOf("/?") > -1)
    ) {
      setInHomePage(true);
    } else if (
      pinIsChecked &&
      (router.asPath === "/mint" ||
        router.asPath === "/choose" ||
        router.asPath === "/name" ||
        router.asPath === "/describe" ||
        router.asPath === "/mint-failed" ||
        router.asPath === "/mint-success" ||
        router.asPath === "/mint-pending")
    ) {
      setInHomePage(true);
    } else {
      setInHomePage(false);
    }

    if (
      (router.pathname === "/mint" ||
        router.pathname === `/mint?uniqueld` ||
        router.pathname === `/mint?uniqueld=` ||
        router.pathname === "/choose" ||
        router.pathname === "/name" ||
        router.pathname === "/describe" ||
        router.pathname === "/mint-failed" ||
        router.pathname === "/mint-success" ||
        router.pathname === "/mint-pending" ||
        router.pathname === "/change" ||
        router.pathname === `/change/${router.query.id}`) &&
      !isMobile
    ) {
      setTopPart(true);
    } else {
      setTopPart(false);
    }
    setTimeout(() => {
      setPageLoading(false);
    }, 250);
  }, [router, pinIsChecked]);

  const { priceToMint } = useSelector((state) => state.minting);
  // useEffect(() => {
  //   if (localStorage.getItem("pinChecked") == "true" && pinIsChecked) {
  //     let pinExpired = localStorage.getItem("PinExpired");
  //     let date = new Date();
  //     if (date - pinExpired > 0) {
  //       localStorage.clear("pinChecked");
  //       localStorage.clear("PinExpired");
  //       dispatch(OnPinChecked(false));
  //       const value = (priceToMint / (100 - DISCOUNT_PRICE)) * 100;
  //       dispatch(PriceToMint(value.toFixed(2)));
  //     }
  //     return;
  //   } else if (localStorage.getItem("pinChecked") == "true" && !pinIsChecked) {
  //     let pinExpired = localStorage.getItem("PinExpired");
  //     let date = new Date();
  //     if (date - pinExpired > 0) return;
  //     dispatch(OnPinChecked(true));
  //     window.dataLayer.push({
  //       event: "mint_discount",
  //     });
  //     const value = priceToMint * ((100 - DISCOUNT_PRICE) * 0.01);
  //     localStorage.setItem("pinChecked", true);
  //     dispatch(PriceToMint(value.toFixed(2)));
  //   } else {
  //     dispatch(OnPinChecked(false));
  //   }
  // }, [router, pinIsChecked]);

  const [normalHeight, setNormalHeight] = useState(false);
  useEffect(() => {
    if (router.asPath === "/comms") {
      setNormalHeight(true);
    } else {
      setNormalHeight(false);
    }
  }, []);

  useEffect(() => {
    if (window) {
      let matched = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (matched) console.log("Currently in dark mode");
      else console.log("Currently in light mode");
    }
  }, []);

  // for date changes
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s",
      s: "seconds",
      ss: "%d seconds",
      m: "a min.",
      mm: "%d mins.",
      h: "1 hr", //this is the setting that you need to change
      hh: "%d hrs",
      d: "a day",
      dd: "%d days",
      w: "a week",
      ww: "%d weeks",
      M: "1 month", //change this for month
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window._vwo_code = window._vwo_code || (function () {
  //       var account_id = 637899,
  //         settings_tolerance = 2000,
  //         library_tolerance = 2500,
  //         use_existing_jquery = false,
  //         is_spa = 1,
  //         hide_element = 'body',
  //         /* DO NOT EDIT BELOW THIS LINE */
  //         f = false, d = document, code = { use_existing_jquery: function () { return use_existing_jquery; }, library_tolerance: function () { return library_tolerance; }, finish: function () { if (!f) { f = true; var a = d.getElementById('_vis_opt_path_hides'); if (a) a.parentNode.removeChild(a); } }, finished: function () { return f; }, load: function (a) { var b = d.createElement('script'); b.fetchPriority = 'high'; b.src = a; b.type = 'text/javascript'; b.innerText; b.onerror = function () { _vwo_code.finish(); }; d.getElementsByTagName('head')[0].appendChild(b); }, init: function () { window.settings_timer = setTimeout(function () { _vwo_code.finish() }, settings_tolerance); var a = d.createElement('style'), b = hide_element ? hide_element + '{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}' : '', h = d.getElementsByTagName('head')[0]; a.setAttribute('id', '_vis_opt_path_hides'); a.setAttribute('type', 'text/css'); if (a.styleSheet) a.styleSheet.cssText = b; else a.appendChild(d.createTextNode(b)); h.appendChild(a); this.load('https://dev.visualwebsiteoptimizer.com/j.php?a=' + account_id + '&u=' + encodeURIComponent(d.URL) + '&f=' + (+is_spa) + '&r=' + Math.random()); return settings_timer; } }; window._vwo_settings_timer = code.init(); return code;
  //     }())
  //   }
  // }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-150x150.png" sizes="150x150" />
        <link rel="icon" href="/favicon-192x192.png" sizes="192x192" />
        <link rel="icon" href="/favicon-512x512.png" sizes="512x512" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>Color Museum | New NFT Market + Launchpad</title>
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.color.museum" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.color.museum" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;500;600;700&family=Inter:wght@100;300;400;500;600&family=Quicksand:wght@300;400;500;700&family=Sen:wght@400;700;800&display=swap"
          rel="stylesheet"
        />

        {/* <!-- Start VWO Async SmartCode --> */}
        <script type="text/javascript">
          {`window._vwo_code = window._vwo_code || (function(){
          var account_id=637899,
          settings_tolerance=2000,
          library_tolerance=2500,
          use_existing_jquery=false,
          is_spa=1,
          hide_element='body',
          /* DO NOT EDIT BELOW THIS LINE */
          f=false,d=document,code={use_existing_jquery:function(){return use_existing_jquery;},library_tolerance:function(){return library_tolerance;},finish:function(){if(!f){f = true;var a=d.getElementById('_vis_opt_path_hides');if(a)a.parentNode.removeChild(a);}},finished:function(){return f;},load:function(a){var b=d.createElement('script');b.fetchPriority='high';b.src=a;b.type='text/javascript';b.innerText;b.onerror=function(){_vwo_code.finish();};d.getElementsByTagName('head')[0].appendChild(b);},init:function(){window.settings_timer = setTimeout(function () { _vwo_code.finish() }, settings_tolerance);var a=d.createElement('style'),b=hide_element?hide_element+'{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}':'',h=d.getElementsByTagName('head')[0];a.setAttribute('id','_vis_opt_path_hides');a.setAttribute('type','text/css');if(a.styleSheet)a.styleSheet.cssText=b;else a.appendChild(d.createTextNode(b));h.appendChild(a);this.load('https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&f='+(+is_spa)+'&r='+Math.random());return settings_timer; }};window._vwo_settings_timer = code.init(); return code; }());
          `}
        </script>
        {/* <!-- End VWO Async SmartCode --> */}
        <script
          defer
          data-domain="https://color.museum/"
          src="https://plausible.io/js/script.js"
        ></script>
      </Head>
      <>
        {!pageLoading ? (
          <PlausibleProvider domain="https://color.museum/">
            <Web3ReactProvider getLibrary={getLibrary}>
              <Nav />

              {fullWidthPage ? (
                <>
                  <section className={`fullwrapper ${topPart && "marginTop"}`}>
                    <Component {...pageProps} />
                    <Dock />
                  </section>
                  <Footer
                    // inHomePage={inHomePage}
                    topPart={topPart}
                  />
                </>
              ) : (
                <>
                  <section
                    className={`wrapper ${normalHeight && "normalHeight"} ${
                      topPart && "marginTop"
                    }`}
                  >
                    <Component {...pageProps} />
                    <Dock />
                    <div className="overflow_modal" id="overflow_modal" />
                  </section>
                  <Footer
                    // inHomePage={inHomePage}
                    topPart={topPart}
                  />
                </>
              )}
            </Web3ReactProvider>
          </PlausibleProvider>
        ) : (
          <div className={styles.fullPageLoader}>
            <Loader />
          </div>
        )}
        <KnockSlider />
        <Toaster
          position="top-center"
          containerClassName="toasterContainer"
          toastOptions={{
            className: "toastCustomClass",
            duration: 5000,
            style: {
              background: "#000000",
              borderRadius: "5px",
              color: "#fff",
              fontFamily: "Plaid-M",
              fontWeight: 520,
              fontSize: "16px",
              lineHeight: "19px",
              maxWidth: "80vw",
            },
          }}
        />
      </>
    </>
  );
}

export default storeWrapper.withRedux(MyApp);
