import { useRef, useEffect, Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

// ─── Vertex Shader ─────────────────────────────────────────────────
const flowVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uMouse;

  void main() {
    vUv = uv;
    vNormal = normal;
    vec3 pos = position;
    // Subtle cloth-like wave on left side (cape)
    float wave = sin(pos.y * 2.5 + uTime * 0.8) * 0.012 * (1.0 - uv.x);
    pos.x += wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// ─── Fragment Shader ────────────────────────────────────────────────
const flowFragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float uTime;
  uniform float uGlow;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(map, vUv);

    // Remove white / near-white background using saturation
    float minCh = min(tex.r, min(tex.g, tex.b));
    float alpha = 1.0 - smoothstep(0.72, 0.96, minCh);

    // Emissive cyan tint on brightest (glowing) areas
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    float glow = smoothstep(0.55, 0.9, lum);
    vec3 cyanAccent = vec3(0.0, 0.94, 1.0);
    vec3 blueAccent  = vec3(0.0, 0.53, 1.0);
    float pulse = sin(uTime * 1.4) * 0.5 + 0.5;
    vec3 emissive = mix(cyanAccent, blueAccent, pulse) * glow * uGlow;

    // Rim glow on character edges
    vec2 center = vUv - 0.5;
    float edge = smoothstep(0.3, 0.5, length(center));
    vec3 rimColor = cyanAccent * edge * 0.3 * uGlow;

    vec3 finalColor = tex.rgb + emissive + rimColor;
    gl_FragColor = vec4(finalColor, alpha);
  }
`

// ─── Constellation / Cape particles ─────────────────────────────────
function ConstellationParticles() {
  const count = 220
  const meshRef = useRef<THREE.Points>(null)

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz  = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      // Spread in a cape-like shape (wider at bottom)
      const t = Math.random()
      const spread = 0.5 + t * 1.2
      pos[i * 3]     = (Math.random() - 0.5) * spread
      pos[i * 3 + 1] = Math.random() * 2.2 - 1.4  // -1.4 to 0.8 (cape region)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
      sz[i] = Math.random() * 3 + 1
    }
    return [pos, sz]
  }, [])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const posArray = (meshRef.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < count; i++) {
      const base = i * 3
      posArray[base]     += Math.sin(t * 0.3 + i * 0.5) * 0.0008
      posArray[base + 1] += Math.cos(t * 0.2 + i * 0.7) * 0.0006
    }
    ;(meshRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    meshRef.current.rotation.y = Math.sin(t * 0.1) * 0.05
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(0x00f0ff)}
        size={0.025}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Energy ring around Flow ─────────────────────────────────────────
function EnergyRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = clock.getElapsedTime() * speed
    ref.current.rotation.x = tilt
  })
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.004, 8, 80]} />
      <meshBasicMaterial
        color={new THREE.Color(0x00f0ff)}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─── Flow Character Plane ────────────────────────────────────────────
function FlowCharacter({ mouseNorm }: { mouseNorm: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture('./flow-hero.png')

  const uniforms = useMemo(() => ({
    map:   { value: texture },
    uTime: { value: 0 },
    uGlow: { value: 1.5 },
  }), [texture])

  // Spring physics state
  const spring = useRef({ rotY: 0, rotX: 0, velY: 0, velX: 0 })

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const s = spring.current
    const t = clock.getElapsedTime()

    // Spring toward mouse rotation
    const targetY = mouseNorm.x * 0.35
    const targetX = -mouseNorm.y * 0.15
    s.velY += (targetY - s.rotY) * 0.04
    s.velX += (targetX - s.rotX) * 0.04
    s.velY *= 0.88
    s.velX *= 0.88
    s.rotY += s.velY
    s.rotX += s.velX

    meshRef.current.rotation.y = s.rotY
    meshRef.current.rotation.x = s.rotX

    // Gentle float
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.08 - 0.1

    // Update shader time
    uniforms.uTime.value = t
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2.2, 2.9, 12, 16]} />
      <shaderMaterial
        vertexShader={flowVertexShader}
        fragmentShader={flowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ─── Ambient glow sphere behind character ────────────────────────────
function AmbientGlow() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.08 + Math.sin(t * 0.7) * 0.04
  })
  return (
    <mesh ref={ref} position={[0, 0, -0.5]}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial
        color={new THREE.Color(0x00f0ff)}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// ─── Scene (mouse tracking inside R3F) ──────────────────────────────
function Scene({ mouseNorm }: { mouseNorm: { x: number; y: number } }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0, 4.5)
  }, [camera])

  return (
    <>
      <Stars radius={100} depth={60} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <AmbientGlow />
      <ConstellationParticles />
      <EnergyRing radius={1.5} speed={0.4} tilt={0.3} />
      <EnergyRing radius={1.8} speed={-0.25} tilt={-0.5} />
      <Suspense fallback={null}>
        <FlowCharacter mouseNorm={mouseNorm} />
      </Suspense>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef    = useRef<HTMLDivElement>(null)
  const mouseNorm  = useRef({ x: 0, y: 0 })

  // Mouse tracking (normalized -1 to 1)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseNorm.current = {
        x: (e.clientX / window.innerWidth)  * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // GSAP hero text entrance
  useEffect(() => {
    if (!textRef.current) return
    const children = textRef.current.querySelectorAll('.hero-item')
    gsap.fromTo(
      children,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power3.out',
      }
    )
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full h-screen min-h-screen overflow-hidden flex items-center"
      style={{ background: 'linear-gradient(160deg, #050510 0%, #0a0520 50%, #1a0b2e 100%)' }}
    >
      {/* Three.js Canvas */}
      <div className="canvas-container">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          style={{ background: 'transparent' }}
        >
          <Scene mouseNorm={mouseNorm.current} />
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(5,5,16,0.85) 0%, rgba(5,5,16,0.3) 50%, rgba(5,5,16,0.5) 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #050510, transparent)' }}
      />

      {/* Hero text content */}
      <div
        ref={textRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-10"
      >
        <div className="max-w-xl">
          {/* Label */}
          <div className="hero-item opacity-0 mb-6">
            <span className="section-label">
              Powered by Flow
            </span>
          </div>

          {/* Main headline */}
          <h1 className="hero-item opacity-0 font-display font-bold leading-[1.08] mb-6" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
            <span className="block text-white">Your Digital</span>
            <span className="block text-gradient">Future Starts</span>
            <span className="block text-white">Here.</span>
          </h1>

          {/* Sub */}
          <p className="hero-item opacity-0 text-white/60 text-lg leading-relaxed mb-10 max-w-md">
            We build anything digital — fast, affordable, and built to solve real problems.
            From websites to blockchain, guided by Flow.
          </p>

          {/* CTAs */}
          <div className="hero-item opacity-0 flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary">
              Start a Project
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#work" className="btn-ghost">
              See Our Work
            </a>
          </div>
        </div>

        {/* Stats strip */}
        <div className="hero-item opacity-0 flex flex-wrap gap-10 mt-20">
          {[
            { num: '50+', label: 'Projects Delivered' },
            { num: '100%', label: 'Client Satisfaction' },
            { num: '7',   label: 'Digital Disciplines' },
            { num: '3×',  label: 'Faster Delivery' },
          ].map((s) => (
            <div key={s.label}>
              <div
                className="font-display font-bold text-2xl"
                style={{
                  background: 'linear-gradient(90deg,#00f0ff,#0088ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {s.num}
              </div>
              <div className="text-white/45 text-xs mt-1 tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-white/30 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, rgba(0,240,255,0.6), transparent)' }} />
      </motion.div>

      {/* Decorative orbs */}
      <div className="orb absolute top-1/4 right-1/4 w-96 h-96 pointer-events-none z-0"
           style={{ background: 'rgba(123,47,255,0.15)' }} />
      <div className="orb absolute bottom-1/3 right-1/3 w-64 h-64 pointer-events-none z-0"
           style={{ background: 'rgba(0,240,255,0.08)' }} />
    </section>
  )
}
