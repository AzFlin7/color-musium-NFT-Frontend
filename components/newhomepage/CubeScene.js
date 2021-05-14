import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Cube from "../cube/Cube";
import { OrbitControls } from "@react-three/drei";
import BbColorController from "../cube/BgColorController";
import ColorPoint from "./ColorPoint";
import usePoints from "../cube/hooks/usePoints";

import styles from "../../styles/modules/cube/cube.module.css";
import { useRouter } from "next/router";

const CameraController = ({ cubeSize }) => {
  return (
    <OrbitControls
      enableDamping
      dampingFactor={0.75}
      zoomSpeed={0.25}
      autoRotate
      autoRotateSpeed={2}
      maxDistance={cubeSize * 2}
      maxPolarAngle={Math.PI * 4}
      maxAzimuthAngle={Infinity}
      minAzimuthAngle={-Infinity}
    />
  );
};

const CubeScene = ({ colors }) => {
  const [selectedBackgroundColorName, setSelectedBackgroundColorName] =
    React.useState("");

  const isDesktop = true;

  const cubeSize = isDesktop ? 100 : 20;
  const dotSize = isDesktop ? [0.8, 6, 6] : [0.2, 6, 6];
  const points = usePoints(colors, cubeSize);


  const router = useRouter();
  const [smallCube, setSmallCube] = useState(false)

  useEffect(() => {
    if (router.pathname === "/videohomepage") {
      setSmallCube(true)
    }
  }, [router])


  return (
    <div className={`${styles.container} ${smallCube && styles.smallCube}`}>
      {selectedBackgroundColorName &&
        selectedBackgroundColorName !== "Unnamed" && (
          <div className={styles.textRight}>{selectedBackgroundColorName}</div>
        )}
      <Canvas
        className="w-screen h-screen"
        id="canvas"
        linear
        camera={{
          position: [0, 0, cubeSize * 2],
        }}
      >
        <ambientLight />
        {/* <color attach="background" args={["#202124"]} /> */}
        <fog attach="fog" color="#202124" near={150} far={300} />

        <Cube size={cubeSize} key={cubeSize} />

        {points.map((point, i) => (
          <ColorPoint key={dotSize + i} {...point} dotSize={dotSize} />
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

export default CubeScene;
