import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const H = 3.25

function CameraController({ floor, focus, controls }) {
  const { camera } = useThree()
  const desiredPosition = useRef(new THREE.Vector3(64, 48, 78))
  const desiredTarget = useRef(new THREE.Vector3(0, 39, 0))

  useFrame(() => {
    const y = 1.6 + (floor - 1) * H
    desiredPosition.current.set(...(focus ? [38, y + 7, 43] : [64, 48, 78]))
    desiredTarget.current.set(...(focus ? [0, y, 0] : [0, 39, 0]))
    camera.position.lerp(desiredPosition.current, 0.045)
    if (controls.current) {
      controls.current.target.lerp(desiredTarget.current, 0.06)
      controls.current.update()
    }
  })
  return null
}

function Floor({ n, selected, onSelect }) {
  const y = 1.6 + (n - 1) * H
  const s = 1 - (n - 1) * 0.004
  return (
    <group position={[0, y, 0]} scale={[s, 1, s]}>
      <mesh castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onSelect(n) }}>
        <boxGeometry args={[28, 3, 19]} />
        <meshPhysicalMaterial
          color={selected ? '#54dcff' : '#4d8ca4'}
          roughness={0.13}
          metalness={0.12}
          transparent
          opacity={selected ? 0.96 : 0.78}
          transmission={selected ? 0.08 : 0.18}
          clearcoat={0.65}
        />
      </mesh>
      <mesh position={[0, -1.53, 0]} castShadow>
        <boxGeometry args={[28.55, 0.16, 19.55]} />
        <meshStandardMaterial color="#d9e3e7" metalness={0.78} roughness={0.22} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[-12.5 + i * 2.5, 0, 9.56]}>
          <boxGeometry args={[0.065, 2.95, 0.12]} />
          <meshStandardMaterial color="#e9f0f2" metalness={0.8} roughness={0.18} />
        </mesh>
      ))}
    </group>
  )
}

function Tower({ floor, onSelect }) {
  return (
    <group>
      {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
        <Floor key={n} n={n} selected={n === floor} onSelect={onSelect} />
      ))}
      <mesh position={[0, 39, 0]} castShadow>
        <boxGeometry args={[6.5, 78, 6.5]} />
        <meshStandardMaterial color="#5a666d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 83.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[7.2, 9, 4]} />
        <meshStandardMaterial color="#cbd8dc" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 4, 0]} castShadow>
        <boxGeometry args={[36, 8, 27]} />
        <meshPhysicalMaterial color="#5b9bb0" roughness={0.16} metalness={0.1} transparent opacity={0.8} transmission={0.12} />
      </mesh>
    </group>
  )
}

function Plaza() {
  const trees = [[-36,-26],[36,-26],[-36,29],[36,29],[-24,39],[24,39]]
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#1c2b33" roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.035, 30]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[42, 11]} />
        <meshPhysicalMaterial color="#237d98" roughness={0.08} />
      </mesh>
      {trees.map(([x,z], i) => (
        <group key={i} position={[x,0,z]}>
          <mesh position={[0,2.25,0]} castShadow>
            <cylinderGeometry args={[0.34,0.44,4.5,12]} />
            <meshStandardMaterial color="#5a3b2c" />
          </mesh>
          <mesh position={[0,5.7,0]} castShadow>
            <sphereGeometry args={[2.55,18,18]} />
            <meshStandardMaterial color="#2f6749" roughness={0.86} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function ExteriorScene({ floor, setFloor, focus }) {
  const controls = useRef()
  return (
    <>
      <color attach="background" args={['#071019']} />
      <fog attach="fog" args={['#071019',105,230]} />
      <hemisphereLight intensity={0.72} groundColor="#16242c" />
      <directionalLight castShadow position={[55,105,-65]} intensity={2.5} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-35,30,45]} intensity={0.8} color="#79dfff" />
      <Tower floor={floor} onSelect={setFloor} />
      <Plaza />
      <ContactShadows position={[0,0.03,0]} opacity={0.55} scale={120} blur={2.6} far={80} />
      <OrbitControls ref={controls} makeDefault target={[0,39,0]} minDistance={42} maxDistance={185} minPolarAngle={0.52} maxPolarAngle={1.48} enablePan={false} />
      <CameraController floor={floor} focus={focus} controls={controls} />
    </>
  )
}

function MarbleFloor() {
  return (
    <mesh rotation={[-Math.PI/2,0,0]} receiveShadow>
      <planeGeometry args={[36,24]} />
      <meshPhysicalMaterial color="#e8e4dd" roughness={0.22} metalness={0.02} clearcoat={0.35} />
    </mesh>
  )
}

function InteriorArchitecture() {
  return (
    <group>
      <MarbleFloor />
      <mesh position={[0,3,-12]} castShadow receiveShadow>
        <boxGeometry args={[36,6,0.25]} />
        <meshStandardMaterial color="#f1eee8" roughness={0.7} />
      </mesh>
      <mesh position={[-18,3,0]} castShadow receiveShadow>
        <boxGeometry args={[0.25,6,24]} />
        <meshStandardMaterial color="#f1eee8" roughness={0.7} />
      </mesh>
      <mesh position={[0,3,12]} castShadow>
        <boxGeometry args={[36,6,0.08]} />
        <meshPhysicalMaterial color="#8fc6d7" roughness={0.05} transparent opacity={0.28} transmission={0.35} />
      </mesh>
      <mesh position={[18,3,0]} castShadow>
        <boxGeometry args={[0.08,6,24]} />
        <meshPhysicalMaterial color="#8fc6d7" roughness={0.05} transparent opacity={0.28} transmission={0.35} />
      </mesh>
      <mesh position={[0,6,0]} receiveShadow>
        <boxGeometry args={[36,0.2,24]} />
        <meshStandardMaterial color="#ece9e3" roughness={0.75} />
      </mesh>
    </group>
  )
}

function Furniture() {
  const chairs = useMemo(() => [[-11,-4],[-8,-4],[-5,-4],[-11,-1],[-8,-1],[-5,-1]],[])
  return (
    <group>
      <mesh position={[4,0.55,4]} castShadow>
        <boxGeometry args={[10,0.7,3]} />
        <meshStandardMaterial color="#65727a" roughness={0.9} />
      </mesh>
      <mesh position={[4,1.45,2.75]} castShadow>
        <boxGeometry args={[10,1.8,0.5]} />
        <meshStandardMaterial color="#65727a" roughness={0.9} />
      </mesh>
      <mesh position={[4,0.05,6]} receiveShadow>
        <boxGeometry args={[12,0.05,8]} />
        <meshStandardMaterial color="#8f6659" roughness={0.95} />
      </mesh>
      <mesh position={[4,0.42,8]} castShadow>
        <cylinderGeometry args={[2.1,2.1,0.5,48]} />
        <meshPhysicalMaterial color="#eee9df" roughness={0.2} clearcoat={0.35} />
      </mesh>
      <mesh position={[-8,1,-2.5]} castShadow>
        <boxGeometry args={[8,0.35,3.6]} />
        <meshStandardMaterial color="#8b5c3c" roughness={0.42} />
      </mesh>
      {chairs.map(([x,z],i)=>(
        <group key={i} position={[x,0,z]}>
          <mesh position={[0,0.6,0]} castShadow><boxGeometry args={[1.25,0.28,1.25]}/><meshStandardMaterial color="#b5aaa0" roughness={0.85}/></mesh>
          <mesh position={[0,1.3,-0.5]} castShadow><boxGeometry args={[1.25,1.2,0.2]}/><meshStandardMaterial color="#8b5c3c" roughness={0.5}/></mesh>
        </group>
      ))}
      <mesh position={[-9,0.65,6]} castShadow>
        <boxGeometry args={[7.3,1.05,2.6]} />
        <meshStandardMaterial color="#5d6265" roughness={0.35} />
      </mesh>
      <mesh position={[-9,1.25,6]} castShadow>
        <boxGeometry args={[7.7,0.13,3]} />
        <meshPhysicalMaterial color="#eee9df" roughness={0.2} clearcoat={0.35} />
      </mesh>
      <mesh position={[-8,2.4,-11.78]} castShadow>
        <boxGeometry args={[5.7,2.8,0.1]} />
        <meshStandardMaterial color="#11161a" metalness={0.35} roughness={0.2} />
      </mesh>
    </group>
  )
}

function InteriorLights() {
  const lights = []
  for (let x=-14;x<=14;x+=7) {
    for (let z=-9;z<=9;z+=6) {
      lights.push([x,z])
    }
  }
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight intensity={0.55} groundColor="#786858" />
      {lights.map(([x,z],i)=>(
        <pointLight key={i} position={[x,5.4,z]} intensity={0.45} distance={8} color="#ffd9a8" />
      ))}
      <directionalLight position={[10,12,12]} intensity={1.2} castShadow />
    </>
  )
}

function WalkController() {
  const { camera, gl } = useThree()
  const keys = useRef({})
  const yaw = useRef(Math.PI)
  const pitch = useRef(0)
  const looking = useRef(false)
  const last = useRef({x:0,y:0})

  useEffect(() => {
    camera.position.set(0,1.7,9)
    camera.rotation.order = 'YXZ'
    camera.rotation.set(0,Math.PI,0)

    const down = (e) => { keys.current[e.key.toLowerCase()] = true }
    const up = (e) => { keys.current[e.key.toLowerCase()] = false }
    const el = gl.domElement

    const pd = (e) => {
      looking.current = true
      last.current = {x:e.clientX,y:e.clientY}
      el.setPointerCapture?.(e.pointerId)
    }
    const pm = (e) => {
      if (!looking.current) return
      const dx=e.clientX-last.current.x
      const dy=e.clientY-last.current.y
      yaw.current -= dx*0.004
      pitch.current = Math.max(-1.1,Math.min(1.1,pitch.current-dy*0.003))
      last.current = {x:e.clientX,y:e.clientY}
    }
    const pu = () => { looking.current=false }

    window.addEventListener('keydown',down)
    window.addEventListener('keyup',up)
    el.addEventListener('pointerdown',pd)
    el.addEventListener('pointermove',pm)
    el.addEventListener('pointerup',pu)
    return () => {
      window.removeEventListener('keydown',down)
      window.removeEventListener('keyup',up)
      el.removeEventListener('pointerdown',pd)
      el.removeEventListener('pointermove',pm)
      el.removeEventListener('pointerup',pu)
    }
  },[camera,gl])

  useFrame((_,delta)=>{
    camera.rotation.y = yaw.current
    camera.rotation.x = pitch.current
    const forward = new THREE.Vector3(0,0,-1).applyEuler(new THREE.Euler(0,yaw.current,0))
    const right = new THREE.Vector3(1,0,0).applyEuler(new THREE.Euler(0,yaw.current,0))
    const speed = 5.5*delta
    if(keys.current['w']||keys.current['arrowup']) camera.position.addScaledVector(forward,speed)
    if(keys.current['s']||keys.current['arrowdown']) camera.position.addScaledVector(forward,-speed)
    if(keys.current['a']||keys.current['arrowleft']) camera.position.addScaledVector(right,-speed)
    if(keys.current['d']||keys.current['arrowright']) camera.position.addScaledVector(right,speed)
    camera.position.x=Math.max(-17.2,Math.min(17.2,camera.position.x))
    camera.position.z=Math.max(-11.2,Math.min(11.2,camera.position.z))
    camera.position.y=1.7
  })
  return null
}

function InteriorScene() {
  return (
    <>
      <color attach="background" args={['#dbe6ec']} />
      <InteriorLights />
      <InteriorArchitecture />
      <Furniture />
      <WalkController />
    </>
  )
}

export default function App() {
  const [floor,setFloor]=useState(12)
  const [focus,setFocus]=useState(false)
  const [inside,setInside]=useState(false)
  const choose=(n)=>{setFloor(n);setFocus(true)}

  return (
    <main className="app">
      <Canvas
        shadows
        dpr={[1,1.6]}
        camera={{position:[64,48,78],fov:inside?66:43,near:0.1,far:500}}
        gl={{antialias:true,powerPreference:'high-performance'}}
      >
        {inside ? <InteriorScene/> : <ExteriorScene floor={floor} setFloor={choose} focus={focus}/>}
      </Canvas>

      <header className="topbar">
        <div>
          <div className="brand">APEX ONE</div>
          <div className="subtitle">{inside ? `INSIDE FLOOR ${floor}` : 'STEP 3 · ENTER FLOOR'}</div>
        </div>
        <button onClick={()=>inside?setInside(false):(setFloor(12),setFocus(false))}>
          {inside ? 'Exit floor' : 'Reset view'}
        </button>
      </header>

      {!inside && (
        <>
          <aside className="info-card">
            <span>Selected floor</span>
            <strong>Floor {floor}</strong>
            <p>Select a floor, focus the camera, then enter the interior.</p>
            <button className="focus-button" onClick={()=>setFocus(true)}>Focus Floor</button>
            <button className="enter-button" onClick={()=>setInside(true)}>Enter Floor {floor}</button>
            {focus && <button className="back-button" onClick={()=>setFocus(false)}>Full Tower</button>}
          </aside>

          <nav className="floor-strip">
            {Array.from({length:24},(_,i)=>i+1).map(n=>(
              <button key={n} className={floor===n?'active':''} onClick={()=>choose(n)}>{n}</button>
            ))}
          </nav>
        </>
      )}

      {inside && (
        <div className="walk-hint">
          <b>Walk:</b> W A S D or arrow keys · <b>Look:</b> drag the screen
        </div>
      )}
    </main>
  )
}
