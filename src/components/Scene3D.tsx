"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import {
  Points,
  Group,
  Mesh,
  ShaderMaterial,
  MeshBasicMaterial,
  AdditiveBlending,
  DoubleSide,
  ACESFilmicToneMapping,
  Color,
  Vector2,
} from "three";

// ---------------------------------------------------------------------------
// Scroll-responsive camera
// ---------------------------------------------------------------------------

function ScrollCamera() {
  const { camera } = useThree();
  const scrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const scrollFactor = scrollY.current * 0.0003;

    // Subtle breathing movement + scroll-based rotation
    camera.position.x = Math.sin(t * 0.15) * 0.3;
    camera.position.y = Math.cos(t * 0.1) * 0.2 - scrollFactor * 2;
    camera.rotation.x = -scrollFactor * 0.5;
    camera.rotation.y = Math.sin(t * 0.08) * 0.02;
  });

  return null;
}

// ---------------------------------------------------------------------------
// Cinema particles with size/color variation
// ---------------------------------------------------------------------------

function CinemaParticles({ count = 800 }) {
  const mesh = useRef<Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread particles in a wide volume
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Color variation between deep red and warm white
      const t = Math.random();
      if (t < 0.6) {
        // Red tones
        col[i * 3] = 0.8 + Math.random() * 0.2;
        col[i * 3 + 1] = 0.05 + Math.random() * 0.1;
        col[i * 3 + 2] = 0.1 + Math.random() * 0.15;
      } else {
        // Warm white / gold tones
        col[i * 3] = 0.9 + Math.random() * 0.1;
        col[i * 3 + 1] = 0.85 + Math.random() * 0.15;
        col[i * 3 + 2] = 0.7 + Math.random() * 0.2;
      }

      // Varying sizes
      siz[i] = Math.random() * 0.04 + 0.005;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.008;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.004;

    // Animate individual particles floating up
    const posArr = mesh.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.0005;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Floating cinema screen with volumetric light cones
// ---------------------------------------------------------------------------

function CinemaScreen() {
  const screenRef = useRef<Group>(null);
  const lightConeRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!screenRef.current) return;
    const t = state.clock.elapsedTime;
    screenRef.current.rotation.y = Math.sin(t * 0.2) * 0.08;
    screenRef.current.position.y = Math.sin(t * 0.4) * 0.15 + 0.5;

    if (lightConeRef.current) {
      const mat = lightConeRef.current.material as MeshBasicMaterial;
      mat.opacity = 0.06 + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <group ref={screenRef} position={[0, 0.5, -8]}>
      {/* Screen frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.4, 3.2, 0.15]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Screen surface - emissive */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[5, 2.8]} />
        <meshStandardMaterial
          color="#111111"
          emissive="#e31837"
          emissiveIntensity={0.08}
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>

      {/* Volumetric light cone from projector */}
      <mesh
        ref={lightConeRef}
        position={[0, 0, 6]}
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[3.5, 12, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffe4c4"
          transparent
          opacity={0.06}
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Secondary light cone (tighter) */}
      <mesh position={[0, 0, 6]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.0, 12, 32, 1, true]} />
        <meshBasicMaterial
          color="#e31837"
          transparent
          opacity={0.03}
          side={DoubleSide}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Projector light source */}
      <pointLight
        position={[0, 0, 10]}
        intensity={2}
        color="#ffe4c4"
        distance={20}
        decay={2}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 3D Movie Poster Card
// ---------------------------------------------------------------------------

function PosterCard({
  position,
  rotation,
  color,
  delay,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  delay: number;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime + delay;
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.5) * 0.15;
    groupRef.current.rotation.y =
      rotation[1] + Math.sin(t * 0.3) * 0.05;
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={position} rotation={rotation}>
        {/* Card body with depth */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.8, 0.05]} />
          <meshStandardMaterial
            color={color}
            metalness={0.4}
            roughness={0.3}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Glossy front surface */}
        <mesh position={[0, 0, 0.026]}>
          <planeGeometry args={[1.1, 1.7]} />
          <meshPhysicalMaterial
            color="#1a0a0a"
            metalness={0.1}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            reflectivity={1}
          />
        </mesh>

        {/* Emissive accent strip at bottom */}
        <mesh position={[0, -0.75, 0.027]}>
          <planeGeometry args={[1.1, 0.15]} />
          <meshStandardMaterial
            color="#e31837"
            emissive="#e31837"
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Subtle rim light per card */}
        <pointLight
          position={[0, 0, 0.5]}
          intensity={0.3}
          color={color}
          distance={3}
          decay={2}
        />
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Animated nebula / gradient mesh background
// ---------------------------------------------------------------------------

function NebulaBackground() {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const shader = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new Color("#1a0000") },
        uColor2: { value: new Color("#e31837") },
        uColor3: { value: new Color("#0a0a1a") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        // Simplex-ish noise
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289v2(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                  + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                  dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * 0.05;

          float n1 = snoise(uv * 2.0 + t);
          float n2 = snoise(uv * 4.0 - t * 0.7);
          float n3 = snoise(uv * 1.5 + vec2(t * 0.3, -t * 0.2));

          float blend = (n1 + n2 * 0.5 + n3 * 0.3) * 0.5 + 0.5;

          vec3 color = mix(uColor1, uColor3, uv.y);
          color = mix(color, uColor2, blend * 0.15);

          // Add subtle vignette
          float vign = 1.0 - length((uv - 0.5) * 1.5);
          color *= vign * 0.8 + 0.2;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -15]}>
      <planeGeometry args={[60, 40]} />
      <shaderMaterial
        ref={materialRef}
        attach="material"
        uniforms={shader.uniforms}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Floating film reel rings
// ---------------------------------------------------------------------------

function FilmReelRing({
  position,
  size,
  speed,
}: {
  position: [number, number, number];
  size: number;
  speed: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = t * speed;
    meshRef.current.rotation.z = t * speed * 0.7;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[size, 0.015, 16, 64]} />
      <meshStandardMaterial
        color="#e31837"
        emissive="#e31837"
        emissiveIntensity={0.8}
        transparent
        opacity={0.4}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Ambient light orbs
// ---------------------------------------------------------------------------

function LightOrbs() {
  const groupRef = useRef<Group>(null);

  const orbs = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          -5 - Math.random() * 10,
        ] as [number, number, number],
        size: 0.1 + Math.random() * 0.2,
        speed: 0.2 + Math.random() * 0.3,
        offset: i * 1.5,
      })),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const orb = orbs[i];
      const t = state.clock.elapsedTime + orb.offset;
      child.position.x = orb.position[0] + Math.sin(t * orb.speed) * 1.5;
      child.position.y = orb.position[1] + Math.cos(t * orb.speed * 0.8) * 1;
    });
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial
            color={i % 2 === 0 ? "#e31837" : "#ff6b4a"}
            transparent
            opacity={0.15}
            blending={AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Post-processing effects
// ---------------------------------------------------------------------------

function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.2}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new Vector2(0.0008, 0.0008)}
      />
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={0.9}
      />
    </EffectComposer>
  );
}

// ---------------------------------------------------------------------------
// Main Scene3D component
// ---------------------------------------------------------------------------

export default function Scene3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
      >
        {/* Camera controller */}
        <ScrollCamera />

        {/* Lighting */}
        <ambientLight intensity={0.15} color="#1a0a0a" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.4}
          color="#ffe4c4"
        />
        <pointLight
          position={[-6, 3, 2]}
          intensity={1.5}
          color="#e31837"
          distance={15}
          decay={2}
        />
        <pointLight
          position={[6, -3, 2]}
          intensity={0.8}
          color="#ff4444"
          distance={12}
          decay={2}
        />
        <pointLight
          position={[0, 5, -3]}
          intensity={0.5}
          color="#ffffff"
          distance={10}
          decay={2}
        />

        {/* Background nebula */}
        <NebulaBackground />

        {/* Cinema screen with projector light */}
        <CinemaScreen />

        {/* Movie poster cards */}
        <PosterCard
          position={[-4.5, 1, -4]}
          rotation={[0, 0.3, 0]}
          color="#2a0a0a"
          delay={0}
        />
        <PosterCard
          position={[-3, -1.5, -5]}
          rotation={[0, 0.2, 0.05]}
          color="#1a0a1a"
          delay={1.2}
        />
        <PosterCard
          position={[4.5, 0.5, -4]}
          rotation={[0, -0.3, 0]}
          color="#1a0000"
          delay={2.4}
        />
        <PosterCard
          position={[3.5, -1.8, -5.5]}
          rotation={[0, -0.2, -0.05]}
          color="#0a0a1a"
          delay={3.6}
        />
        <PosterCard
          position={[0, 2.5, -6]}
          rotation={[0.05, 0, 0]}
          color="#2a0505"
          delay={4.8}
        />

        {/* Film reel rings */}
        <FilmReelRing position={[-5, 2, -7]} size={1.2} speed={0.15} />
        <FilmReelRing position={[5.5, -2, -9]} size={1.8} speed={0.1} />
        <FilmReelRing position={[0, -3, -6]} size={0.8} speed={0.25} />

        {/* Particles */}
        <CinemaParticles count={800} />

        {/* Ambient light orbs */}
        <LightOrbs />

        {/* Post-processing */}
        <Effects />
      </Canvas>
    </div>
  );
}
