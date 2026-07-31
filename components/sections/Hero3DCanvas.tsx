"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Group, Mesh } from "three";

function FloatingStudioSpeaker() {
  const groupRef = useRef<Group>(null);
  const speakerConeRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle slow rotation
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.6;
    }
    if (speakerConeRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
      speakerConeRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.08 : 1}
    >
      {/* Outer Studio Speaker Cabinet */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 2.4, 1.2]} />
        <meshPhysicalMaterial
          color="#121214"
          roughness={0.25}
          metalness={0.8}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Speaker Bezel Ring */}
      <mesh position={[0, 0.3, 0.61]} castShadow>
        <ringGeometry args={[0.42, 0.52, 32]} />
        <meshStandardMaterial
          color="#6C63FF"
          metalness={0.9}
          roughness={0.1}
          emissive="#6C63FF"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Woofer Cone */}
      <mesh ref={speakerConeRef} position={[0, 0.3, 0.55]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.35]} />
        <meshStandardMaterial
          color="#22252B"
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Dust Cap */}
      <mesh position={[0, 0.3, 0.65]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial
          color="#6C63FF"
          metalness={0.9}
          roughness={0.1}
          emissive="#6C63FF"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Tweeter Frame */}
      <mesh position={[0, -0.6, 0.61]}>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Orbiting Audio Wave Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.6, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#00D4FF"
          emissive="#00D4FF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Floating Audio Node Orbs */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <mesh position={[-1.4, 1.1, 0.3]}>
          <icosahedronGeometry args={[0.18, 1]} />
          <MeshDistortMaterial
            color="#6C63FF"
            emissive="#6C63FF"
            emissiveIntensity={0.8}
            speed={2}
            distort={0.3}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
        <mesh position={[1.5, -0.9, -0.2]}>
          <icosahedronGeometry args={[0.22, 1]} />
          <MeshDistortMaterial
            color="#00D4FF"
            emissive="#00D4FF"
            emissiveIntensity={0.7}
            speed={2.5}
            distort={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="h-full w-full"
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        {/* Main Purple Studio Key Light */}
        <pointLight position={[3, 4, 4]} color="#6C63FF" intensity={3.5} distance={10} />
        {/* Subtle Cyan Rim Light */}
        <pointLight position={[-4, -3, -2]} color="#00D4FF" intensity={2.5} distance={10} />
        {/* Directional Soft Light */}
        <directionalLight position={[0, 5, 2]} intensity={0.8} color="#FFFFFF" />

        {/* Floating Speaker Object */}
        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.8}>
          <FloatingStudioSpeaker />
        </Float>
      </Canvas>
    </div>
  );
}
