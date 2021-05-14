import React, { useRef } from "react";

const ColorPoint = ({ position, color, dotSize }) => {
  const mesh = useRef(null);

  return (
    <mesh ref={mesh} position={position}>
      <sphereBufferGeometry attach="geometry" args={dotSize} />
      <meshBasicMaterial attach="material" color={color} />
    </mesh>
  );
};

export default ColorPoint;
