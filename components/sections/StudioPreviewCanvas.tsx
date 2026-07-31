"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, Center, ContactShadows, Html, OrbitControls, useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/svara-studio-preview.glb";

function StudioModel() {
  const { scene } = useGLTF(MODEL_URL);

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
}

function LoadingState() {
  return (
    <Html center>
      <div className="rounded-full border border-[#6C63FF]/35 bg-[#080914]/90 px-4 py-2 text-xs font-bold text-[#C4B5FD] shadow-[0_0_24px_rgba(108,99,255,0.25)]">
        Memuat studio 3D…
      </div>
    </Html>
  );
}

export default function StudioPreviewCanvas() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [5, 4, 7], fov: 38 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="h-full w-full"
    >
      <color attach="background" args={["#080914"]} />
      <ambientLight intensity={1.5} />
      <hemisphereLight args={["#9B93FF", "#0A0C18", 1.4]} />
      <directionalLight position={[6, 8, 5]} intensity={3} color="#FFFFFF" />
      <pointLight position={[-5, 3, -4]} intensity={20} distance={18} color="#6C63FF" />
      <pointLight position={[4, 2, 5]} intensity={14} distance={16} color="#00D4FF" />

      <Suspense fallback={<LoadingState />}>
        <Bounds fit clip observe margin={1.18}>
          <StudioModel />
        </Bounds>
        <ContactShadows position={[0, -1.6, 0]} opacity={0.45} scale={18} blur={2.5} far={4} />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.45}
        enablePan={false}
        minDistance={2.5}
        maxDistance={14}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
