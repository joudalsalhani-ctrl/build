import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei'
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
        <meshPhysicalMaterial color={selected ? '#54dcff' : '#4d8ca4'} roughness={0.13} metalness={0.12} transparent opacity={selected ? 0.96 : 0.78} transmission={selected ? 0.08 : 0.18} clearcoat={0.65} />
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
      {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => <Floor key={n} n={n} selected={n === floor} onSelect={onSelect} />)}
      <mesh position={[0, 39, 0]} castShadow><boxGeometry args={[6.5, 78, 6.5]} /><meshStandardMaterial color="#5a666d" roughness={0.7} /></mesh>
      <mesh position={[0, 83.5, 0]} rotation={[0, Math.PI / 4, 0]} castShadow><coneGeometry args={[7.2, 9, 4]} /><meshStandardMaterial color="#cbd8dc" metalness={0.8} roughness={0.2} /></mesh>
      <mesh position={[0, 4, 0]} castShadow><boxGeometry args={[36, 8, 27]} /><meshPhysicalMaterial color="#5b9bb0" roughness={0.16} metalness={0.1} transparent opacity={0.8} transmission={0.12} /></mesh>
    </group>
  )
}

function Plaza() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[160, 160]} /><meshStandardMaterial color="#1c2b33" roughness={0.92} /></mesh>
      <mesh position={[0, 0.035, 30]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[42, 11]} /><meshPhysicalMaterial color="#237d98" roughness={0.08} /></mesh>
    </group>
  )
}

function ExteriorScene({ floor, setFloor, focus }) {
  const controls = useRef()
  return (
    <>
      <color attach="background" args={['#071019']} />
      <fog attach="fog" args={['#071019', 105, 230]} />
      <hemisphereLight intensity={0.72} groundColor="#16242c" />
      <directionalLight castShadow position={[55, 105, -65]} intensity={2.5} shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-35, 30, 45]} intensity={0.8} color="#79dfff" />
      <Tower floor={floor} onSelect={setFloor} />
      <Plaza />
      <ContactShadows position={[0, 0.03, 0]} opacity={0.55} scale={120} blur={2.6} far={80} />
      <OrbitControls ref={controls} makeDefault target={[0, 39, 0]} minDistance={42} maxDistance={185} minPolarAngle={0.52} maxPolarAngle={1.48} enablePan={false} />
      <CameraController floor={floor} focus={focus} controls={controls} />
    </>
  )
}

function MarbleSlab() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 24]} />
        <meshPhysicalMaterial color="#ece8e1" roughness={0.18} metalness={0.02} clearcoat={0.45} />
      </mesh>
      {Array.from({length:8},(_,i)=>(
        <mesh key={'x'+i} position={[-15.75+i*4.5,0.006,0]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[0.035,24]} />
          <meshBasicMaterial color="#9c958d" transparent opacity={0.5} />
        </mesh>
      ))}
      {Array.from({length:6},(_,i)=>(
        <mesh key={'z'+i} position={[0,0.007,-10+i*4]} rotation={[-Math.PI/2,0,0]}>
          <planeGeometry args={[36,0.035]} />
          <meshBasicMaterial color="#9c958d" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function GlassMeetingRoom() {
  return (
    <group position={[10,0,-5]}>
      <mesh position={[0,1.5,-3]}><boxGeometry args={[10,3,0.08]}/><meshPhysicalMaterial color="#b8dbe6" transparent opacity={0.22} transmission={0.5} roughness={0.05}/></mesh>
      <mesh position={[-5,1.5,0]}><boxGeometry args={[0.08,3,6]}/><meshPhysicalMaterial color="#b8dbe6" transparent opacity={0.22} transmission={0.5} roughness={0.05}/></mesh>
      <mesh position={[5,1.5,0]}><boxGeometry args={[0.08,3,6]}/><meshPhysicalMaterial color="#b8dbe6" transparent opacity={0.22} transmission={0.5} roughness={0.05}/></mesh>
      <mesh position={[0,1.5,3]}><boxGeometry args={[10,3,0.08]}/><meshPhysicalMaterial color="#b8dbe6" transparent opacity={0.22} transmission={0.5} roughness={0.05}/></mesh>
      <mesh position={[0,0.95,0]} castShadow><boxGeometry args={[5.5,0.26,2.4]}/><meshStandardMaterial color="#6f4a34" roughness={0.4}/></mesh>
      {[-2,-0.7,0.7,2].map((x,i)=><mesh key={i} position={[x,0.55,-1.5]} castShadow><boxGeometry args={[1.1,0.32,1.1]}/><meshStandardMaterial color="#b9b1aa" roughness={0.9}/></mesh>)}
    </group>
  )
}

function LuxuryInterior() {
  const lights = []
  for(let x=-14;x<=14;x+=4.7) for(let z=-9;z<=9;z+=4.5) lights.push([x,z])
  return (
    <group>
      <MarbleSlab />
      <mesh position={[0,3,-12]}><boxGeometry args={[36,6,0.25]}/><meshStandardMaterial color="#f2efe8" roughness={0.72}/></mesh>
      <mesh position={[-18,3,0]}><boxGeometry args={[0.25,6,24]}/><meshStandardMaterial color="#f2efe8" roughness={0.72}/></mesh>
      <mesh position={[0,3,12]}><boxGeometry args={[36,6,0.08]}/><meshPhysicalMaterial color="#95cad8" transparent opacity={0.22} transmission={0.55} roughness={0.04}/></mesh>
      <mesh position={[18,3,0]}><boxGeometry args={[0.08,6,24]}/><meshPhysicalMaterial color="#95cad8" transparent opacity={0.22} transmission={0.55} roughness={0.04}/></mesh>

      <mesh position={[0,5.75,0]} receiveShadow><boxGeometry args={[36,0.22,24]}/><meshStandardMaterial color="#efece5" roughness={0.76}/></mesh>
      <mesh position={[0,5.58,0]}><boxGeometry args={[31,0.12,19]}/><meshStandardMaterial color="#d9d3ca" roughness={0.72}/></mesh>
      <mesh position={[0,5.48,0]}><boxGeometry args={[27,0.08,15]}/><meshStandardMaterial color="#f4f0e9" roughness={0.72}/></mesh>

      {lights.map(([x,z],i)=><pointLight key={i} position={[x,5.25,z]} intensity={0.32} distance={7} color="#ffd8a6"/>)}

      <mesh position={[-8,2.3,-11.8]}><boxGeometry args={[11,4.2,0.22]}/><meshStandardMaterial color="#80573d" roughness={0.42}/></mesh>
      {Array.from({length:9},(_,i)=><mesh key={i} position={[-12+i,2.3,-11.65]}><boxGeometry args={[0.08,4.0,0.12]}/><meshStandardMaterial color="#4b3125" roughness={0.45}/></mesh>)}
      <mesh position={[-8,2.5,-11.55]}><boxGeometry args={[5.8,2.8,0.08]}/><meshStandardMaterial color="#11171b" metalness={0.25} roughness={0.2}/></mesh>

      <RoundedBox args={[11,0.75,3.2]} radius={0.25} smoothness={4} position={[4,0.62,4]} castShadow><meshStandardMaterial color="#68757d" roughness={0.9}/></RoundedBox>
      <RoundedBox args={[11,1.8,0.5]} radius={0.18} smoothness={4} position={[4,1.55,2.7]} castShadow><meshStandardMaterial color="#68757d" roughness={0.9}/></RoundedBox>
      <mesh position={[4,0.04,6]}><boxGeometry args={[12,0.06,8]}/><meshStandardMaterial color="#8f6659" roughness={0.95}/></mesh>
      <mesh position={[4,0.45,8]} castShadow><cylinderGeometry args={[2.2,2.2,0.55,64]}/><meshPhysicalMaterial color="#eee9df" roughness={0.18} clearcoat={0.45}/></mesh>

      <mesh position={[-9,0.65,6]} castShadow><boxGeometry args={[7.4,1.1,2.7]}/><meshStandardMaterial color="#5d6265" roughness={0.35}/></mesh>
      <mesh position={[-9,1.28,6]} castShadow><boxGeometry args={[7.9,0.14,3.1]}/><meshPhysicalMaterial color="#f0ebe3" roughness={0.18} clearcoat={0.4}/></mesh>
      {[-11.2,-9,-6.8].map((x,i)=><group key={i}><mesh position={[x,4.55,6]}><cylinderGeometry args={[0.5,0.75,0.7,32]}/><meshStandardMaterial color="#b18a57" metalness={0.75} roughness={0.22}/></mesh><pointLight position={[x,4.2,6]} intensity={0.45} distance={6} color="#ffc98d"/></group>)}

      <GlassMeetingRoom />
    </group>
  )
}

function WalkController({ joystick }) {
  const { camera, gl } = useThree()
  const keys = useRef({})
  const yaw = useRef(Math.PI)
  const pitch = useRef(0)
  const looking = useRef(false)
  const last = useRef({x:0,y:0})

  useEffect(() => {
    camera.position.set(0,1.7,9)
    camera.rotation.order='YXZ'
    const down=e=>keys.current[e.key.toLowerCase()]=true
    const up=e=>keys.current[e.key.toLowerCase()]=false
    const el=gl.domElement
    const pd=e=>{ if(e.clientX<window.innerWidth*.42)return; looking.current=true;last.current={x:e.clientX,y:e.clientY}}
    const pm=e=>{if(!looking.current)return;const dx=e.clientX-last.current.x,dy=e.clientY-last.current.y;yaw.current-=dx*.004;pitch.current=Math.max(-1.05,Math.min(1.05,pitch.current-dy*.003));last.current={x:e.clientX,y:e.clientY}}
    const pu=()=>looking.current=false
    window.addEventListener('keydown',down);window.addEventListener('keyup',up)
    el.addEventListener('pointerdown',pd);el.addEventListener('pointermove',pm);el.addEventListener('pointerup',pu)
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);el.removeEventListener('pointerdown',pd);el.removeEventListener('pointermove',pm);el.removeEventListener('pointerup',pu)}
  },[camera,gl])

  useFrame((_,delta)=>{
    camera.rotation.y=yaw.current;camera.rotation.x=pitch.current
    const f=new THREE.Vector3(0,0,-1).applyEuler(new THREE.Euler(0,yaw.current,0))
    const r=new THREE.Vector3(1,0,0).applyEuler(new THREE.Euler(0,yaw.current,0))
    const speed=5.2*delta
    if(keys.current['w']||keys.current['arrowup'])camera.position.addScaledVector(f,speed)
    if(keys.current['s']||keys.current['arrowdown'])camera.position.addScaledVector(f,-speed)
    if(keys.current['a']||keys.current['arrowleft'])camera.position.addScaledVector(r,-speed)
    if(keys.current['d']||keys.current['arrowright'])camera.position.addScaledVector(r,speed)
    if(joystick){
      camera.position.addScaledVector(f,-joystick.y*speed)
      camera.position.addScaledVector(r,joystick.x*speed)
    }
    camera.position.x=Math.max(-17.2,Math.min(17.2,camera.position.x))
    camera.position.z=Math.max(-11.2,Math.min(11.2,camera.position.z))
    camera.position.y=1.7
  })
  return null
}

function InteriorScene({ joystick }) {
  return (
    <>
      <color attach="background" args={['#dfe7eb']} />
      <hemisphereLight intensity={0.6} groundColor="#8a7a68" />
      <directionalLight position={[10,12,12]} intensity={1.3} castShadow />
      <LuxuryInterior />
      <WalkController joystick={joystick} />
    </>
  )
}

export default function App() {
  const [floor,setFloor]=useState(12)
  const [focus,setFocus]=useState(false)
  const [inside,setInside]=useState(false)
  const [joy,setJoy]=useState({x:0,y:0})
  const stickRef=useRef()
  const joyRef=useRef({active:false,id:null})
  const choose=n=>{setFloor(n);setFocus(true)}

  const updateJoy=(clientX,clientY)=>{
    const el=stickRef.current?.parentElement
    if(!el)return
    const rect=el.getBoundingClientRect()
    let x=clientX-(rect.left+rect.width/2),y=clientY-(rect.top+rect.height/2)
    const max=37,len=Math.hypot(x,y)
    if(len>max){x=x/len*max;y=y/len*max}
    stickRef.current.style.transform=`translate(${x}px,${y}px)`
    setJoy({x:x/max,y:y/max})
  }

  return (
    <main className="app">
      <Canvas shadows dpr={[1,1.6]} camera={{position:[64,48,78],fov:inside?66:43,near:.1,far:500}} gl={{antialias:true,powerPreference:'high-performance'}}>
        {inside?<InteriorScene joystick={joy}/>:<ExteriorScene floor={floor} setFloor={choose} focus={focus}/>}
      </Canvas>

      <header className="topbar">
        <div><div className="brand">APEX ONE</div><div className="subtitle">{inside?`STEP 4 · LUXURY FLOOR ${floor}`:'STEP 4 · MODERN WALKTHROUGH'}</div></div>
        <button onClick={()=>inside?setInside(false):(setFloor(12),setFocus(false))}>{inside?'Exit floor':'Reset view'}</button>
      </header>

      {!inside&&<>
        <aside className="info-card">
          <span>Selected floor</span><strong>Floor {floor}</strong>
          <p>Choose a floor, focus on it, then enter the upgraded luxury interior.</p>
          <button className="focus-button" onClick={()=>setFocus(true)}>Focus Floor</button>
          <button className="enter-button" onClick={()=>setInside(true)}>Enter Floor {floor}</button>
          {focus&&<button className="back-button" onClick={()=>setFocus(false)}>Full Tower</button>}
        </aside>
        <nav className="floor-strip">{Array.from({length:24},(_,i)=>i+1).map(n=><button key={n} className={floor===n?'active':''} onClick={()=>choose(n)}>{n}</button>)}</nav>
      </>}

      {inside&&<>
        <div className="walk-hint"><b>Walk:</b> joystick or W A S D · <b>Look:</b> drag the right side</div>
        <div className="joystick"
          onPointerDown={e=>{joyRef.current={active:true,id:e.pointerId};e.currentTarget.setPointerCapture(e.pointerId);updateJoy(e.clientX,e.clientY)}}
          onPointerMove={e=>{if(joyRef.current.active&&e.pointerId===joyRef.current.id)updateJoy(e.clientX,e.clientY)}}
          onPointerUp={()=>{joyRef.current.active=false;setJoy({x:0,y:0});if(stickRef.current)stickRef.current.style.transform='translate(0,0)'}}
        ><div ref={stickRef} className="stick"/></div>
      </>}
    </main>
  )
}
