import React from "react";

const Cube = ({ size }) => {
  const h = size * 0.5;
  const points = new Float32Array([
    -h,
    -h,
    -h,
    -h,
    h,
    -h,
    -h,
    h,
    -h,
    h,
    h,
    -h,
    h,
    h,
    -h,
    h,
    -h,
    -h,
    h,
    -h,
    -h,
    -h,
    -h,
    -h,
    -h,
    -h,
    h,
    -h,
    h,
    h,
    -h,
    h,
    h,
    h,
    h,
    h,
    h,
    h,
    h,
    h,
    -h,
    h,
    h,
    -h,
    h,
    -h,
    -h,
    h,
    -h,
    -h,
    -h,
    -h,
    -h,
    h,
    -h,
    h,
    -h,
    -h,
    h,
    h,
    h,
    h,
    -h,
    h,
    h,
    h,
    h,
    -h,
    -h,
    h,
    -h,
    h,
  ]);
  return (
    <lineSegments name="colorspace">
      <bufferGeometry>
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={points.length / 3}
          itemSize={3}
          array={points}
        />
      </bufferGeometry>

      <lineBasicMaterial
        attach="material"
        color="white"
        linewidth={4}
        linecap="round"
        linejoin="round"
      />
    </lineSegments>
  );
};

export default Cube;
