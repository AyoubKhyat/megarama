"use client";

import { useRef, useState, useMemo, useCallback, Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import {
  Mesh,
  MeshStandardMaterial,
  MathUtils,
  FrontSide,
  ACESFilmicToneMapping,
} from "three";

class Canvas3DErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D render error:", error, info);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CinemaHall3DProps {
  selectedSeats: string[];
  onSeatToggle: (seatId: string) => void;
  takenSeats: string[];
}

interface SeatProps {
  seatId: string;
  position: [number, number, number];
  isSelected: boolean;
  isTaken: boolean;
  onToggle: (seatId: string) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEAT_ROWS = [
  { row: "A", seats: 8 },
  { row: "B", seats: 10 },
  { row: "C", seats: 12 },
  { row: "D", seats: 12 },
  { row: "E", seats: 14 },
  { row: "F", seats: 14 },
  { row: "G", seats: 12 },
  { row: "H", seats: 10 },
];

const SEAT_SPACING = 0.65;
const ROW_SPACING = 0.8;
const FLOOR_SLOPE = 0.12; // height increase per row

// ---------------------------------------------------------------------------
// Seat Component
// ---------------------------------------------------------------------------

function Seat({ seatId, position, isSelected, isTaken, onToggle }: SeatProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => {
    if (isTaken) return "#1a1a1a";
    if (isSelected) return "#e31837";
    return "#3a3a3a";
  }, [isTaken, isSelected]);

  const emissiveColor = useMemo(() => {
    if (isSelected) return "#e31837";
    if (hovered && !isTaken) return "#555555";
    return "#000000";
  }, [isSelected, hovered, isTaken]);

  const emissiveIntensity = useMemo(() => {
    if (isSelected) return 0.8;
    if (hovered && !isTaken) return 0.3;
    return 0;
  }, [isSelected, hovered, isTaken]);

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as MeshStandardMaterial;
    mat.emissiveIntensity = MathUtils.lerp(
      mat.emissiveIntensity,
      emissiveIntensity,
      0.1
    );
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (!isTaken) {
        onToggle(seatId);
      }
    },
    [isTaken, onToggle, seatId]
  );

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = isTaken ? "not-allowed" : "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      castShadow
    >
      {/* Seat back */}
      <boxGeometry args={[0.45, 0.5, 0.35]} />
      <meshStandardMaterial
        color={color}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Cinema Screen
// ---------------------------------------------------------------------------

function CinemaScreen() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as MeshStandardMaterial;
    mat.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 2.2, -6]} rotation={[0, 0, 0]}>
      <planeGeometry args={[10, 4.5, 32, 1]} />
      <meshStandardMaterial
        color="#111122"
        emissive="#4488ff"
        emissiveIntensity={0.4}
        side={FrontSide}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Volumetric Light from Screen
// ---------------------------------------------------------------------------

function ScreenLight() {
  return (
    <group position={[0, 2, -5.5]}>
      <spotLight
        position={[0, 0, 0]}
        target-position={[0, -2, 6]}
        angle={Math.PI / 3}
        penumbra={0.8}
        intensity={2}
        color="#4488ff"
        distance={15}
        castShadow={false}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Room Geometry
// ---------------------------------------------------------------------------

function Room() {
  return (
    <group>
      {/* Floor - sloped */}
      <mesh rotation={[-Math.PI / 2 + 0.08, 0, 0]} position={[0, -0.6, 1]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 1]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#050505" roughness={1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 3, 7]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#080808" roughness={0.9} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7, 3, 1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Right wall */}
      <mesh position={[7, 3, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[14, 7]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Wall Sconces (warm point lights)
// ---------------------------------------------------------------------------

function WallSconces() {
  const positions: [number, number, number][] = [
    [-6.8, 3, -3],
    [-6.8, 3, 0],
    [-6.8, 3, 3],
    [-6.8, 3, 5],
    [6.8, 3, -3],
    [6.8, 3, 0],
    [6.8, 3, 3],
    [6.8, 3, 5],
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <pointLight
          key={i}
          position={pos}
          color="#ff9944"
          intensity={0.4}
          distance={4}
          decay={2}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Ambient Light Strips on Walls
// ---------------------------------------------------------------------------

function AmbientStrips() {
  return (
    <group>
      {/* Left wall strip */}
      <mesh position={[-6.9, 1.5, 1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 0.05]} />
        <meshStandardMaterial
          color="#ff8833"
          emissive="#ff8833"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Right wall strip */}
      <mesh position={[6.9, 1.5, 1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 0.05]} />
        <meshStandardMaterial
          color="#ff8833"
          emissive="#ff8833"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Seats Grid
// ---------------------------------------------------------------------------

interface SeatsGridProps {
  selectedSeats: string[];
  takenSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

function SeatsGrid({ selectedSeats, takenSeats, onSeatToggle }: SeatsGridProps) {
  const seats = useMemo(() => {
    const result: {
      seatId: string;
      position: [number, number, number];
    }[] = [];

    SEAT_ROWS.forEach((row, rowIndex) => {
      const rowZ = -3 + rowIndex * ROW_SPACING;
      const rowY = -0.3 + rowIndex * FLOOR_SLOPE;
      const totalWidth = (row.seats - 1) * SEAT_SPACING;
      const startX = -totalWidth / 2;

      for (let i = 0; i < row.seats; i++) {
        const seatId = `${row.row}${i + 1}`;
        const x = startX + i * SEAT_SPACING;
        result.push({
          seatId,
          position: [x, rowY, rowZ],
        });
      }
    });

    return result;
  }, []);

  return (
    <group>
      {seats.map(({ seatId, position }) => (
        <Seat
          key={seatId}
          seatId={seatId}
          position={position}
          isSelected={selectedSeats.includes(seatId)}
          isTaken={takenSeats.includes(seatId)}
          onToggle={onSeatToggle}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene Content
// ---------------------------------------------------------------------------

interface SceneContentProps {
  selectedSeats: string[];
  takenSeats: string[];
  onSeatToggle: (seatId: string) => void;
}

function SceneContent({ selectedSeats, takenSeats, onSeatToggle }: SceneContentProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.05} color="#ffffff" />
      <ScreenLight />
      <WallSconces />

      {/* Fog for depth */}
      <fog attach="fog" args={["#000000", 8, 25]} />

      {/* Room */}
      <Room />
      <AmbientStrips />

      {/* Screen */}
      <Float speed={0.5} rotationIntensity={0} floatIntensity={0.05}>
        <CinemaScreen />
      </Float>

      {/* Seats */}
      <SeatsGrid
        selectedSeats={selectedSeats}
        takenSeats={takenSeats}
        onSeatToggle={onSeatToggle}
      />

      {/* Camera Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.1}
        minPolarAngle={0.2}
        maxAzimuthAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 3}
        minDistance={4}
        maxDistance={16}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CinemaHall3D({
  selectedSeats,
  onSeatToggle,
  takenSeats,
}: CinemaHall3DProps) {
  const [cameraKey, setCameraKey] = useState(0);

  const resetView = useCallback(() => {
    setCameraKey((prev) => prev + 1);
  }, []);

  return (
    <div className="relative w-full rounded-2xl border border-white/10 overflow-hidden bg-black">
      {/* 3D Canvas */}
      <div className="w-full h-[500px] md:h-[600px]">
        <Canvas3DErrorBoundary
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-black">
              <svg className="w-12 h-12 text-mega-red/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-white/40 text-sm tracking-wider">3D view unavailable</p>
              <p className="text-white/20 text-xs">Your browser may not support WebGL</p>
            </div>
          }
        >
          <Canvas
            key={cameraKey}
            camera={{
              position: [0, 5, 10],
              fov: 50,
              near: 0.1,
              far: 100,
            }}
            shadows
            gl={{ antialias: true, alpha: false }}
            onCreated={({ gl }) => {
              gl.setClearColor("#000000");
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.2;
            }}
          >
            <SceneContent
              selectedSeats={selectedSeats}
              takenSeats={takenSeats}
              onSeatToggle={onSeatToggle}
            />
          </Canvas>
        </Canvas3DErrorBoundary>
      </div>

      {/* Reset View Button */}
      <button
        onClick={resetView}
        className="absolute top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-xs text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 tracking-wider uppercase"
      >
        Reset View
      </button>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#3a3a3a]" />
          <span className="text-[10px] text-white/50">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#e31837] shadow-[0_0_6px_rgba(227,24,55,0.6)]" />
          <span className="text-[10px] text-white/50">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#1a1a1a]" />
          <span className="text-[10px] text-white/50">Taken</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-lg border border-white/10">
        <p className="text-[10px] text-white/40 tracking-wider">
          Drag to rotate &bull; Scroll to zoom &bull; Click seats to select
        </p>
      </div>
    </div>
  );
}
