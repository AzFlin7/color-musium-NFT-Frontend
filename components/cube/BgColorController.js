import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useInterval } from "usehooks-ts";
import { useEffect } from "react";

const BgColorController = ({ colors,setSelectedBackgroundColorName }) => {
  const scene = useThree((state) => state.scene);

  const setColorRandomColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (color.hex) {
      scene.background = new THREE.Color(color.hex);
      setSelectedBackgroundColorName(color.name);
    }
  }

  useInterval(() => {
    setColorRandomColor()
  }, 10000);

  useEffect(() =>{
    setColorRandomColor()
  },[])

  return null;
};

export default BgColorController;
