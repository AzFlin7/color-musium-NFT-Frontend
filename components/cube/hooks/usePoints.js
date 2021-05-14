import { useEffect, useState, useMemo } from "react";
import chroma from "chroma-js";
import * as THREE from "three";
import getAllColors from "../http/fetch/getAllColorNFT";

function translate(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * ((value - low1) / (high1 - low1));
}

const mode = {
  func: "rgb",
  x: [0, 255],
  y: [1, 255],
  z: [2, 255],
};

const usePoints = (colors = [], cubeSize) => {
  console.log(cubeSize);
  const [colorList, setColorList] = useState(colors);

  useEffect(() => {
    getAllColors().then((res) => {
      setColorList(res.documents);
    });
  }, []);

  const points = useMemo(() => {
    return colorList.map((col, i) => {
      const colorComp = chroma(col.hex).rgb();

      const color = new THREE.Color(col.hex);

      let pX = translate(
          colorComp[mode.x[0]],
          mode.x[2] || 0,
          mode.x[1],
          -cubeSize * 0.5,
          cubeSize * 0.5
        ),
        pZ = translate(
          colorComp[mode.z[0]],
          mode.z[2] || 0,
          mode.z[1],
          -cubeSize * 0.5,
          cubeSize * 0.5
        ),
        pY = translate(
          colorComp[mode.y[0]],
          mode.y[2] || 0,
          mode.y[1],
          -cubeSize * 0.5,
          cubeSize * 0.5
        );
      return {
        position: new THREE.Vector3(pX, pY, pZ),
        color: new THREE.Color(color.r, color.g, color.b),
        details: col,
      };
    });
  }, [colorList]);

  return points;
};

export default usePoints;
