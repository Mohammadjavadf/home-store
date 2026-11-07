import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import FridgeModel from './FridgeModel';

export default function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 1.5, 4], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* نورپردازی محیطی */}
          <ambientLight intensity={0.9} />

          {/* نور اصلی از بالا-راست */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
          />

          {/* نور مسی از سمت چپ برای جلوه گرم */}
          <directionalLight
            position={[-5, 4, -3]}
            intensity={0.6}
            color="#D4A373"
          />

          {/* نور نقطه‌ای از جلو */}
          <pointLight position={[0, 3, 4]} intensity={1.0} color="#B87333" />

          {/* نور نقطه‌ای از پایین برای پر کردن سایه‌ها */}
          <pointLight position={[0, -2, 2]} intensity={0.4} color="#FAF8F5" />

          {/* مدل شناور */}
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
            <FridgeModel autoRotate />
          </Float>

          {/* سایه زیر مدل */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={8}
            blur={2.5}
            far={4}
            color="#1C1917"
          />

          {/* کنترل با ماوس */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2}
            rotateSpeed={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}