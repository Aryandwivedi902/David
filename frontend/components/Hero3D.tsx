"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useState, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// Rotating Abstract Architectural Hotel Tower Model
function AbstractHotelTower() {
  const towerRef = useRef<THREE.Group>(null);

  // Rotate slowly
  useFrame((state) => {
    if (towerRef.current) {
      towerRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={towerRef} position={[0, -1.5, 0]}>
      {/* Central Spire */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.02, 0.2, 5, 5]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Main Glass/Gold Tier 1 */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.2, 8]} />
        <meshStandardMaterial color="#111625" metalness={0.5} roughness={0.2} transparent opacity={0.5} wireframe />
      </mesh>
      
      {/* Gold Ring around Tier 1 */}
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.04, 8, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Tier 2 */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1.2, 8]} />
        <meshStandardMaterial color="#111625" metalness={0.6} roughness={0.2} transparent opacity={0.4} wireframe />
      </mesh>
      
      {/* Gold Ring around Tier 2 */}
      <mesh position={[0, 1.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.04, 8, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Tier 3 (Penthouse Peak) */}
      <mesh position={[0, 3.1, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 8]} />
        <meshStandardMaterial color="#111625" metalness={0.7} roughness={0.2} transparent opacity={0.3} wireframe />
      </mesh>
      
      {/* Gold Ring around Tier 3 */}
      <mesh position={[0, 3.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.45, 0.04, 8, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Base Columns */}
      {Array.from({ length: 6 }).map((_, idx) => {
        const angle = (idx / 6) * Math.PI * 2;
        const radius = 1.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={idx} position={[x, 0.4, z]}>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
            <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
          </mesh>
        );
      })}
    </group>
  );
}

// Glowing golden floating particles
function FloatingEmbers() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8; // X
      pos[i * 3 + 1] = Math.random() * 6 - 2;   // Y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8; // Z
      spd[i] = 0.1 + Math.random() * 0.3; // speed
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
      const time = state.clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        let y = posAttr.getY(i);
        y += speeds[i] * 0.015;
        if (y > 4) y = -2;
        posAttr.setY(i, y);

        let x = posAttr.getX(i);
        x += Math.sin(time + i) * 0.002;
        posAttr.setX(i, x);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#d4af37"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// Camera control reacting to cursor position for smooth parallax
function CameraRig() {
  useFrame((state) => {
    const targetX = state.pointer.x * 1.5;
    const targetY = state.pointer.y * 0.8 + 2;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY + 1.2, 0.05);
    state.camera.lookAt(0, 0.5, 0);
  });
  return null;
}

export default function Hero3D() {
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

  if (loading) {
    return <div className="absolute inset-0 bg-navy-deep animate-pulse" />;
  }

  return (
    <div 
      className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 overflow-hidden"
      // Realistic luxury hotel lobby background showing chairs, pool, and elegant guests
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1920')" }}
    >
      {/* Dark overlay with slight blur to make text readable and pop the 3D model */}
      <div className="absolute inset-0 bg-navy-deep/60 backdrop-blur-[2px] z-10" />

      {/* Floating ambient gold highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[180px] rounded-full pointer-events-none z-10" />

      {webglSupported && (
        <div className="absolute inset-0 w-full h-full z-20">
          <Canvas camera={{ position: [0, 2.5, 5.5], fov: 50 }} dpr={[1, 2]} gl={{ alpha: true }}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" />
            <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#d4af37" />
            <pointLight position={[0, 1.5, 0]} intensity={1.2} color="#d4af37" distance={8} />

            <AbstractHotelTower />
            <FloatingEmbers />
            <CameraRig />
          </Canvas>
        </div>
      )}

      {/* Parallax Helper Tag */}
      <div className="absolute bottom-16 right-12 z-20 hidden md:block pointer-events-none">
        <div className="flex items-center gap-3 text-white/40 text-[10px] tracking-widest font-semibold uppercase">
          <span>CURSOR REACTIVE PARALLAX</span>
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
        </div>
      </div>
    </div>
  );
}
