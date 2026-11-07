import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import type { Group } from 'three';

function FloatingBoxes() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {[
        { pos: [0, 0, 0] as [number, number, number], size: 1.2, color: '#B87333' },
        { pos: [1.8, 0.8, -0.5] as [number, number, number], size: 0.7, color: '#D4A373' },
        { pos: [-1.6, -0.6, 0.3] as [number, number, number], size: 0.5, color: '#2D6A4F' },
        { pos: [1.2, -1.2, 1] as [number, number, number], size: 0.4, color: '#8B5A2B' },
        { pos: [-1.8, 1.1, -0.8] as [number, number, number], size: 0.6, color: '#40916C' },
      ].map((box, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={box.pos} castShadow>
            <boxGeometry args={[box.size, box.size, box.size]} />
            <meshStandardMaterial
              color={box.color}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function NotFoundScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <pointLight position={[-5, -3, 3]} intensity={0.6} color="#B87333" />
        <pointLight position={[5, 3, -3]} intensity={0.4} color="#2D6A4F" />

        <FloatingBoxes />

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.3}
          scale={10}
          blur={2.5}
          far={5}
        />
      </Canvas>
    </div>
  );
}