import stylesChoose from "../../styles/modules/choose/choose.module.css";
import stylesName from "../../styles/modules/name/name.module.css";
import styles from "../../styles/modules/mint/mintPage.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Connect from "./Connect";
import MintButton from "./MintButton";
import Discount from "./Discount";

const Mint = ({ loader }) => {
  const { choosenColorFinal, choosenNameFinal, connectedAddress, gasPrice } =
    useSelector((state) => state.minting);
  //
  //
  const [fontSizeAmount, setFontSizeAmount] = useState("32");
  const [fontSizeAmountMobile, setFontSizeAmountMobile] = useState("22");
  useEffect(() => {
    if (choosenNameFinal.length < 20) {
      setFontSizeAmount("32");
      setFontSizeAmountMobile("22");
    } else {
      setFontSizeAmount("26");
      setFontSizeAmountMobile("17");
    }
  }, [choosenNameFinal]);
  //
  const { pinIsChecked } = useSelector((state) => state.minting);
  //
  return (
    <>
      <article className={stylesName.text_container}>
        <h1 className={stylesChoose.header}>Mint your color</h1>
        <p className={stylesChoose.description}>
          Bring your Color NFT to life on Ethereum.
        </p>
        <div className={styles.mint_button_hidden}>
          {connectedAddress.length > 0 ? (
            <>
              <MintButton />
              {/* {!pinIsChecked && <Discount />} */}
            </>
          ) : (
            <Connect loader={loader} />
          )}
        </div>
      </article>

      <div
        className={stylesChoose.color}
        style={{ backgroundColor: `${choosenColorFinal}` }}
      >
        <div
          className={stylesChoose.hexidecimal}
          style={{
            bottom: pinIsChecked && "0",
          }}
        >
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenNameFinal}</p>
          <p style={{ fontSize: `${fontSizeAmount}px` }}>{choosenColorFinal}</p>
        </div>
      </div>
      <div
        className={stylesName.mobile_picker}
        style={{
          backgroundColor: `${choosenColorFinal}`,
        }}
      >
        <div
          className={stylesName.hexidecimal_mobile}
          style={{ borderBottom: "1px solid #282828" }}
        >
          <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
            {choosenNameFinal}
          </p>
          <p style={{ fontSize: `${fontSizeAmountMobile}px` }}>
            {choosenColorFinal}
          </p>
        </div>
      </div>
      <div className={styles.wrapperContainerMobile}>
        <div className={styles.lineBottomMobile} />
      </div>
      <div className={stylesChoose.lineSide} />
    </>
  );
};

export default Mint;
