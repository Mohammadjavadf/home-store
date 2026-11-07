import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface FridgeModelProps {
  autoRotate?: boolean;
}

export default function FridgeModel({ autoRotate = true }: FridgeModelProps) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={1.1}>
      {/* بدنه اصلی */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 2.6, 1.1]} />
        <meshStandardMaterial
          color="#E8E3DC"
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* در بالا (فریزر) */}
      <mesh position={[0, 0.75, 0.56]} castShadow>
        <boxGeometry args={[1.52, 0.95, 0.04]} />
        <meshStandardMaterial
          color="#D6CFC5"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* در پایین (یخچال) */}
      <mesh position={[0, -0.45, 0.56]} castShadow>
        <boxGeometry args={[1.52, 1.55, 0.04]} />
        <meshStandardMaterial
          color="#D6CFC5"
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>

      {/* خط جداکننده */}
      <mesh position={[0, 0.22, 0.57]}>
        <boxGeometry args={[1.52, 0.015, 0.02]} />
        <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* دستگیره بالا */}
      <mesh position={[0.6, 0.75, 0.62]} castShadow>
        <boxGeometry args={[0.05, 0.55, 0.06]} />
        <meshStandardMaterial
          color="#B87333"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* دستگیره پایین */}
      <mesh position={[0.6, -0.45, 0.62]} castShadow>
        <boxGeometry args={[0.05, 0.85, 0.06]} />
        <meshStandardMaterial
          color="#B87333"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* صفحه نمایش کوچک */}
      <mesh position={[-0.45, 0.85, 0.585]}>
        <boxGeometry args={[0.28, 0.16, 0.01]} />
        <meshStandardMaterial
          color="#1C1917"
          metalness={0.3}
          roughness={0.2}
          emissive="#B87333"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* پایه‌ها */}
      {[
        [-0.65, -1.32, 0.4],
        [0.65, -1.32, 0.4],
        [-0.65, -1.32, -0.4],
        [0.65, -1.32, -0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
          <meshStandardMaterial color="#1C1917" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}