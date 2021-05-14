import React, { useRef, useState } from "react";

const ColorPoint = ({
  position,
  color,
  details,
  handleColorPointClick,
  dotSize,
}) => {
  const mesh = useRef(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <mesh
      ref={mesh}
      position={position}
      scale={hovered ? 1.5 : 1}
      onClick={() => {
        setActive(!active);
        handleColorPointClick(details)
      }}
      onPointerOver={() => {
        setHover(true);
        handleColorPointClick(details)
      }}
      onPointerOut={() => setHover(false)}
    >
      <sphereBufferGeometry attach="geometry" args={dotSize} />
      <meshBasicMaterial attach="material" color={color} />
    </mesh>
  );
};

export default ColorPoint;
