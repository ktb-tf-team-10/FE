// Model.jsx
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";

function GLBModel({ url, scale = 1, rotationSpeed = 0.003 }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed;
    }
  });

  return <primitive ref={ref} object={scene} scale={scale} />;
}

//useGLTF.preload("/models/myModel.glb");

export default function ModelViewer() {
  return (
    <div style={{ width: "100%", height: 500 }}>
      <Canvas camera={{ position: [0, 1.2, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} />

        <Suspense fallback={null}>
          <GLBModel url="/models/model1.glb" scale={1} rotationSpeed={0.003} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
