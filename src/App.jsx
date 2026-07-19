import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, ContactShadows, Float } from '@react-three/drei'
import { Suspense, useMemo, useState } from 'react'
import * as THREE from 'three'

function Tower({ selectedFloor, onSelectFloor }) {
  const floors = useMemo(() => Array.from({ length: 24 }, (_, i) => i + 1), [])
  return (
    <group position={[0, -39, 0]}>
      {floors.map((floor) => {
        const y = floor * 3.25
        const taper = 1 - floor * 0.0045
        const selected = selectedFloor === floor

        return (
          <group key={floor} position={[0, y, 0]} scale={[taper, 1, taper]}>
            <mesh
              onClick={(event) => {
                event.stopPropagation()
                onSelectFloor(floor)
              }}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[28, 3, 19]} />
              <meshPhysicalMaterial
                color={selected ? '#54dcff' : '#4b8fa8'}
                roughness={0.12}
                metalness={0.18}
                transmission={selected ? 0.12 : 0.35}
                transparent
                opacity={selected ? 0.95 : 0.76}
                clearcoat={0.7}
                clearcoatRoughness={0.08}
              />
            </mesh>

            <mesh position={[0, -1.53, 0]}>
              <boxGeometry args={[28.5, 0.16, 19.5]} />
              <meshStandardMaterial color="#d7e2e6" metalness={0.75} roughness={0.24} />
            </mesh>

            {Array.from({ length: 11 }, (_, index) => (
              <mesh key={index} position={[-12.5 + index * 2.5, 0, 9.57]}>
                <boxGeometry args={[0.06, 2.95, 0.12]} />
                <meshStandardMaterial color="#e6eef1" metalness={0.8} roughness={0.18} />
              </mesh>
            ))}
          </group>
        )
      })}

      <mesh position={[0, 40, 0]} castShadow>
        <boxGeometry args={[6.5, 78, 6.5]} />
        <meshStandardMaterial color="#59656c" roughness={0.72} />
      </mesh>

      <mesh position={[0, 84.5, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[7.2, 9, 4]} />
        <meshStandardMaterial color="#c9d7dc" metalness={0.82} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Plaza() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[150, 150]} />
        <meshStandardMaterial color="#1c2b33" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.08, 26]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[38, 10]} />
        <meshPhysicalMaterial
          color="#2789a3"
          roughness={0.08}
          metalness={0.05}
          transmission={0.1}
        />
      </mesh>

      {[
        [-34, -22],
        [34, -22],
        [-34, 24],
        [34, 24],
        [-22, 34],
        [22, 34],
      ].map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 4.4, 12]} />
            <meshStandardMaterial color="#5b3d2d" roughness={0.9} />
          </mesh>
          <mesh position={[0, 5.6, 0]} castShadow>
            <sphereGeometry args={[2.5, 20, 20]} />
            <meshStandardMaterial color="#2d6547" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Scene({ selectedFloor, setSelectedFloor }) {
  return (
    <>
      <color attach="background" args={['#071019']} />
      <fog attach="fog" args={['#071019', 90, 230]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[60, 110, -70]}
        intensity={2.4}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <Float speed={0.6} rotationIntensity={0.02} floatIntensity={0.15}>
        <Tower selectedFloor={selectedFloor} onSelectFloor={setSelectedFloor} />
      </Float>

      <Plaza />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={115} blur={2.8} far={70} />

      <OrbitControls
        makeDefault
        target={[0, 38, 0]}
        minDistance={55}
        maxDistance={180}
        minPolarAngle={0.55}
        maxPolarAngle={1.48}
        enablePan={false}
      />
    </>
  )
}

export default function App() {
  const [selectedFloor, setSelectedFloor] = useState(12)

  return (
    <main className="app">
      <Canvas
        shadows
        camera={{ position: [70, 55, 90], fov: 42, near: 0.1, far: 500 }}
        dpr={[1, 2]}
      >
        <Scene selectedFloor={selectedFloor} setSelectedFloor={setSelectedFloor} />
      </Canvas>

      <header className="topbar">
        <div>
          <div className="brand">APEX ONE</div>
          <div className="subtitle">STEP 1 · MODERN EXTERIOR</div>
        </div>
        <button onClick={() => setSelectedFloor(12)}>Reset floor</button>
      </header>

      <aside className="info-card">
        <span>Selected floor</span>
        <strong>Floor {selectedFloor}</strong>
        <p>Tap any floor on the tower. Drag to rotate and pinch to zoom.</p>
      </aside>

      <nav className="floor-strip">
        {Array.from({ length: 24 }, (_, i) => i + 1).map((floor) => (
          <button
            key={floor}
            className={selectedFloor === floor ? 'active' : ''}
            onClick={() => setSelectedFloor(floor)}
          >
            {floor}
          </button>
        ))}
      </nav>
    </main>
  )
}
