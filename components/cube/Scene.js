import React, { FC, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Cube from "./Cube";
import { OrbitControls } from "@react-three/drei";
import BbColorController from "./BgColorController";
import ColorPoint from "./ColorPoint";
import usePoints from "./hooks/usePoints";
import { useWindowSize } from "react-use";
import { NFTCardContainer } from "../../components/gallery/Views";
import getAllColorNFT from "./http/fetch/getAllColorNFT";
import styles from "../../styles/modules/cube/cube.module.css";

const CameraController = ({ cubeSize }) => {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.75}
      zoomSpeed={0.25}
      autoRotate
      autoRotateSpeed={2}
      maxDistance={cubeSize * 1.75}
      maxPolarAngle={Math.PI * 4}
      maxAzimuthAngle={Infinity}
      minAzimuthAngle={-Infinity}
    />
  );
};

const Scene = ({ colors }) => {
  const [selectedColor, setSelectedColor] = React.useState(null);
  const [selectedBackgroundColorName, setSelectedBackgroundColorName] =
    React.useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedColor(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [selectedColor]);

  const handleColorPointClick = (color) => {
    setSelectedColor(color);
  };

  const isDesktop = true;

  const cubeSize = isDesktop ? 100 : 20;
  const dotSize = isDesktop ? [0.8, 6, 6] : [0.2, 6, 6];
  const points = usePoints(colors, cubeSize);
  const [taretBlank, setTaretBlank] = useState(true);

  return (
    <div className={styles.container}>
      {selectedColor && (
        <div className={styles.textLeft}>
          <div className={styles.cardContainer}>
            <NFTCardContainer
              id={selectedColor.uint256}
              color={selectedColor.hex}
              name={selectedColor.name}
              number={selectedColor.nftNo}
              price={selectedColor.price_in_eth.toFixed(2)}
              taretBlank={taretBlank}
              handleShow={() => {}}
            />
          </div>
        </div>
      )}
      {selectedBackgroundColorName &&
        selectedBackgroundColorName !== "Unnamed" && (
          <div className={styles.textRight}>{selectedBackgroundColorName}</div>
        )}
      <Canvas
        className="w-screen h-screen"
        id="canvas"
        linear
        camera={{
          position: [0, 0, cubeSize * 1.5],
        }}
      >
        <ambientLight />
        {/* <color attach="background" args={["#202124"]} /> */}
        <fog attach="fog" color="#202124" near={150} far={300} />

        <Cube size={cubeSize} key={cubeSize} />

        {points.map((point, i) => (
          <ColorPoint
            key={dotSize + i}
            {...point}
            handleColorPointClick={handleColorPointClick}
            dotSize={dotSize}
          />
        ))}
        <CameraController cubeSize={cubeSize} key={cubeSize} />
        <BbColorController
          colors={colors}
          setSelectedBackgroundColorName={setSelectedBackgroundColorName}
        />
      </Canvas>
    </div>
  );
};

export default Scene;
