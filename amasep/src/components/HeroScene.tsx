"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/* ─── Ribbon Geometry & Shader ─── */
const MAX_RIBBONS = 120;
const SEGMENTS = 150;

function generateRibbonGeometry() {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(MAX_RIBBONS * SEGMENTS * 6);
  const uvs = new Float32Array(MAX_RIBBONS * SEGMENTS * 4);
  const indices: number[] = [];
  let idx = 0;
  for (let r = 0; r < MAX_RIBBONS; r++) {
    const yBase = (r / MAX_RIBBONS - 0.5) * 50;
    const zBase = (Math.sin(r * 0.7) * 0.5 + Math.cos(r * 0.3) * 0.5) * 3;
    const ribbonWidth = 0.15 + Math.random() * 0.2;
    for (let s = 0; s < SEGMENTS; s++) {
      const x = (s / SEGMENTS - 0.5) * 80;
      positions[idx * 6 + 0] = x;
      positions[idx * 6 + 1] = yBase;
      positions[idx * 6 + 2] = zBase - ribbonWidth;
      positions[idx * 6 + 3] = x;
      positions[idx * 6 + 4] = yBase;
      positions[idx * 6 + 5] = zBase + ribbonWidth;
      uvs[idx * 4 + 0] = s / SEGMENTS;
      uvs[idx * 4 + 1] = 0;
      uvs[idx * 4 + 2] = s / SEGMENTS;
      uvs[idx * 4 + 3] = 1;
      if (s < SEGMENTS - 1) {
        indices.push(idx, idx + 1, idx + 2);
        indices.push(idx + 1, idx + 3, idx + 2);
      }
      idx++;
    }
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  return geo;
}

const ribbonVertexShader = `
  uniform float uTime;
  uniform float uMouseX;
  uniform float uMouseY;
  uniform float uScrollY;
  varying vec2 vUv;
  varying float vDepth;
  varying float vRibbonIndex;
  
  void main() {
    vUv = uv;
    vRibbonIndex = floor(float(gl_VertexID) / 300.0);
    vec3 pos = position;
    float t = uTime * 0.12;
    float ribbonPhase = vRibbonIndex * 0.15;
    float wave = sin(pos.x * 0.25 + t * 1.5 + ribbonPhase) * 3.0;
    wave += sin(pos.x * 0.18 + t * 0.8 + ribbonPhase * 2.0) * 2.5;
    wave += sin(pos.x * 0.08 + t * 0.3) * 1.5;
    pos.z += wave;
    pos.y += sin(pos.x * 0.1 + t * 0.5 + ribbonPhase) * 0.5;
    float mouseInfluenceX = (uMouseX - 0.5) * 4.0;
    float mouseInfluenceY = (uMouseY - 0.5) * 2.0;
    pos.z += mouseInfluenceX * sin(pos.x * 0.015 + t * 0.2) * 0.5;
    pos.y += mouseInfluenceY * cos(pos.x * 0.01) * 0.3;
    float scrollInfluence = uScrollY * 0.002;
    pos.z += scrollInfluence * sin(pos.x * 0.01 + ribbonPhase);
    vDepth = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ribbonFragmentShader = `
  uniform float uTime;
  uniform float uScrollY;
  varying vec2 vUv;
  varying float vDepth;
  varying float vRibbonIndex;
  
  void main() {
    vec3 baseColor = vec3(0.025, 0.025, 0.03);
    vec3 midColor = vec3(0.06, 0.06, 0.07);
    vec3 highlightColor = vec3(0.12, 0.12, 0.15);
    vec3 accentColor = vec3(0.62, 1.0, 0.0);
    float scanLine = sin(vUv.x * 100.0 + uTime * 0.3) * 0.5 + 0.5;
    float ribHighlight = pow(scanLine, 8.0) * 0.1;
    float edgeGlow = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    float wavePattern = sin(vUv.x * 40.0 + uTime * 0.4 + vRibbonIndex) * 0.5 + 0.5;
    vec3 color = mix(baseColor, midColor, wavePattern * 0.3);
    color = mix(color, highlightColor, ribHighlight);
    color = mix(color, accentColor * 0.06, edgeGlow * wavePattern * 0.5);
    float depthFade = smoothstep(-8.0, 8.0, vDepth);
    color *= 0.5 + depthFade * 0.5;
    float specular = pow(max(0.0, sin(vUv.x * 60.0 + uTime * 0.2)), 20.0) * 0.08;
    color += vec3(specular);
    float fog = smoothstep(40.0, 80.0, abs(vUv.x - 0.5) * 80.0);
    color *= 1.0 - fog * 0.7;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/* ─── 3D Scene Components ─── */
function Ribbons({ mouse, scrollY }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollY: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => generateRibbonGeometry(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouseX: { value: 0.5 },
      uMouseY: { value: 0.5 },
      uScrollY: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uMouseX.value = mouse.current.x;
      materialRef.current.uniforms.uMouseY.value = mouse.current.y;
      materialRef.current.uniforms.uScrollY.value = scrollY.current;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={ribbonVertexShader}
        fragmentShader={ribbonFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      const isAccent = Math.random() > 0.85;
      col[i * 3] = isAccent ? 0.62 : 0.05;
      col[i * 3 + 1] = isAccent ? 1.0 : 0.05;
      col[i * 3 + 2] = isAccent ? 0.0 : 0.08;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function Scene({ mouse, scrollY }: { mouse: React.MutableRefObject<{ x: number; y: number }>; scrollY: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Ribbons mouse={mouse} scrollY={scrollY} />
      <FloatingParticles />
      <EffectComposer>
        <Bloom intensity={0.15} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
      </EffectComposer>
    </>
  );
}

/* ─── Main Hero Component ─── */
export default function HeroScene() {
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const scrollY = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = e.clientY / window.innerHeight;
    };
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* WebGL Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 25], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#050505"]} />
          <fog attach="fog" args={["#050505", 30, 80]} />
          <Scene mouse={mouse} scrollY={scrollY} />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#9EFF00]/20 bg-[#9EFF00]/5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#9EFF00] animate-pulse" />
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#9EFF00]">
            Autonomous Multi-Agent Engineering Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
          className="max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.05] tracking-tight"
        >
          <span className="block text-white">Software is no longer written.</span>
          <span className="block mt-2 text-white/80 italic font-extralight">
            It is negotiated
          </span>
          <span className="block mt-2 text-[#9EFF00] italic font-extralight">
            by intelligence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.7 }}
          className="max-w-2xl mt-8 text-base md:text-lg text-[#B8B8B8]/80 leading-relaxed"
        >
          AMASEP orchestrates specialized AI agents that analyze requirements, design systems, 
          generate code, review quality, test applications, secure infrastructure, debug failures, 
          and deploy production-ready software autonomously.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <a
            href="#platform"
            className="group flex items-center gap-2 px-8 py-4 text-sm font-medium text-[#050505] bg-[#9EFF00] hover:bg-[#b3ff4d] transition-all duration-300 rounded-full"
          >
            Launch Platform
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#agents"
            className="group flex items-center gap-2 px-8 py-4 text-sm font-medium text-white border border-white/20 hover:border-[#9EFF00]/40 hover:text-[#9EFF00] transition-all duration-300 rounded-full"
          >
            <Play className="w-4 h-4" />
            Explore Ecosystem
          </a>
        </motion.div>
      </div>

      {/* Gradient overlay for trust section transition */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
    </section>
  );
}
