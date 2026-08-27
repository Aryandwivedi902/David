"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

// Moving Colored Light rig that shifts colors and orbits in the background
function MovingPointLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      // Orbiting light path
      lightRef.current.position.x = Math.sin(time * 0.4) * 3.5;
      lightRef.current.position.y = Math.cos(time * 0.25) * 2.5;
      lightRef.current.position.z = Math.sin(time * 0.3) * 1.5 + 1;

      // Dynamically shift light color from gold, amber to soft teal/sapphire
      const r = Math.sin(time * 0.1) * 0.15 + 0.85; // 0.7 - 1.0
      const g = Math.sin(time * 0.15) * 0.15 + 0.7; // 0.55 - 0.85
      const b = Math.sin(time * 0.2) * 0.2 + 0.4;   // 0.2 - 0.6
      lightRef.current.color.setRGB(r, g, b);
    }
  });

  return <pointLight ref={lightRef} intensity={2.2} distance={10} />;
}

// Abstract 3D Lounge Chair Geometry reacting to cursor parallax
function FloatingChair({ position, rotationSpeed }: { position: [number, number, number]; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Basic rotation
      meshRef.current.rotation.y = time * rotationSpeed;
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.08;
      
      // Target position with mouse cursor parallax + gentle wave float
      const targetX = position[0] + state.pointer.x * 0.4;
      const targetY = position[1] + state.pointer.y * 0.2 + Math.sin(time * 0.4) * 0.15;
      
      // Damp position
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={position} scale={0.68}>
      {/* Cushion */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.6, -0.55]} rotation={[0.05, 0, 0]}>
        <boxGeometry args={[1.2, 1.1, 0.15]} />
        <meshStandardMaterial color="#111625" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Frame Gold Border */}
      <mesh position={[0, 0.6, -0.63]}>
        <boxGeometry args={[1.24, 1.14, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Armrests */}
      <mesh position={[-0.6, 0.3, 0]}>
        <boxGeometry args={[0.08, 0.5, 1.0]} />
        <meshStandardMaterial color="#111625" metalness={0.5} roughness={0.2} />
      </mesh>
      <mesh position={[0.6, 0.3, 0]}>
        <boxGeometry args={[0.08, 0.5, 1.0]} />
        <meshStandardMaterial color="#111625" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Legs */}
      {[-0.5, 0.5].map((x, xIdx) => 
        [-0.5, 0.5].map((z, zIdx) => (
          <mesh key={`${xIdx}-${zIdx}`} position={[x, -0.4, z]}>
            <cylinderGeometry args={[0.04, 0.02, 0.8, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
          </mesh>
        ))
      )}
    </group>
  );
}

// Abstract 3D Coffee Table Geometry reacting to cursor parallax
function FloatingTable({ position, rotationSpeed }: { position: [number, number, number]; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      meshRef.current.rotation.y = time * rotationSpeed;
      meshRef.current.rotation.z = Math.sin(time * 0.15) * 0.06;

      const targetX = position[0] + state.pointer.x * 0.3;
      const targetY = position[1] + state.pointer.y * 0.15 + Math.cos(time * 0.5) * 0.12;

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <group ref={meshRef} position={position} scale={0.65}>
      {/* Table top glass wireframe */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.1} transparent opacity={0.6} wireframe />
      </mesh>

      {/* Gold Ring Tabletop edge */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.52, 0.04, 8, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Base Column */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1.0, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Solid Bottom base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.7, 0.8, 0.15, 16]} />
        <meshStandardMaterial color="#111625" metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Extra floating detail: A rotating gold geometric design element
function FloatingRing({ position, rotationSpeed }: { position: [number, number, number]; rotationSpeed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x = time * rotationSpeed;
      meshRef.current.rotation.y = time * (rotationSpeed * 0.5);
      meshRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.25;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={0.4}>
      <torusGeometry args={[1.2, 0.15, 8, 24]} />
      <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} wireframe />
    </mesh>
  );
}

// Floating star particle embers
function SlowStarfield() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 120;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12; // X
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2; // Z
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.065} color="#d4af37" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function GlobalBackground3D() {
  const [webglSupported, setWebglSupported] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const supports = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(supports);
    } catch (e) {
      setWebglSupported(false);
    }
    setLoading(false);
  }, []);

  if (loading || !webglSupported) {
    return <div className="fixed inset-0 -z-50 bg-navy-deep pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-50 w-full h-full bg-navy-deep pointer-events-none overflow-hidden">
      {/* Base dark backdrop */}
      <div className="absolute inset-0 bg-navy-deep" />
      
      {/* Glowing ambient radial halos */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full" />

      {/* R3F transparent Canvas layer */}
      <div className="w-full h-full opacity-65">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[4, 5, 3]} intensity={1.8} color="#ffffff" />
          <directionalLight position={[-4, -5, -3]} intensity={0.5} color="#d4af37" />
          
          <MovingPointLight />

          {/* Left: Floating luxury lounge chair */}
          <FloatingChair position={[-2.3, 0.7, -0.8]} rotationSpeed={0.05} />

          {/* Center-Top: Floating golden geometric design ring */}
          <FloatingRing position={[0, 1.8, -1.8]} rotationSpeed={0.06} />

          {/* Right: Floating luxury coffee table */}
          <FloatingTable position={[2.3, -0.7, -0.8]} rotationSpeed={-0.04} />

          <SlowStarfield />
        </Canvas>
      </div>
    </div>
  );
}
