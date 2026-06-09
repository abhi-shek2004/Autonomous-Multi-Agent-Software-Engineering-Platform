"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";

const agents = [
  { name: "Product Manager", role: "Requirements & vision" },
  { name: "Architect", role: "System design" },
  { name: "Backend", role: "API & logic" },
  { name: "Frontend", role: "UI/UX" },
  { name: "Reviewer", role: "Quality assurance" },
  { name: "Security", role: "Vulnerability scan" },
  { name: "Test", role: "Automated testing" },
  { name: "Debugger", role: "Error fix" },
  { name: "DevOps", role: "CI/CD deploy" },
  { name: "Documentation", role: "Docs & knowledge" },
  { name: "Orchestrator", role: "Coordination" },
];

function Nucleus() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.25;
      innerRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={innerRef}>
        <torusKnotGeometry args={[1.2, 0.4, 128, 32]} />
        <meshBasicMaterial color="#9EFF00" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial color="#9EFF00" wireframe transparent opacity={0.04} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#9EFF00" wireframe transparent opacity={0.03} />
      </mesh>
    </group>
  );
}

function OrbitingAgents() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 6;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const isAccent = Math.random() > 0.75;
      col[i * 3] = isAccent ? 0.62 : 0.05;
      col[i * 3 + 1] = isAccent ? 1.0 : 0.05;
      col[i * 3 + 2] = isAccent ? 0.0 : 0.08;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Nucleus />
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} sizeAttenuation />
      </points>
      {agents.map((_, i) => {
        const angle = (i / agents.length) * Math.PI * 2;
        const radius = 5 + Math.sin(i * 0.7) * 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(i * 0.5) * 2.5;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshBasicMaterial color="#9EFF00" transparent opacity={0.6} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color="#9EFF00" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export default function AgentCivilization() {
  return (
    <section id="agents" className="relative w-full min-h-screen py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#9EFF00]/20 bg-[#9EFF00]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#9EFF00]" />
            <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-[#9EFF00]">
              Eleven Agents. One Mission.
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6">
            The Agent Civilization
          </h2>
          <p className="max-w-xl text-base md:text-lg text-[#B8B8B8]/60 leading-relaxed">
            Each agent brings unique expertise. Together, they form a self-healing 
            engineering ecosystem that never sleeps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="h-[400px] md:h-[500px]">
            <Canvas
              camera={{ position: [0, 0, 12], fov: 60 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <color attach="background" args={["#050505"]} />
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.5} color="#9EFF00" />
              <OrbitingAgents />
            </Canvas>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ scale: 1.02 }}
                className="group p-4 rounded-xl border border-white/[0.04] bg-[#0A0A0A] hover:border-[#9EFF00]/20 hover:bg-[#121212] transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#9EFF00]/10 flex items-center justify-center group-hover:bg-[#9EFF00]/20 transition-colors">
                    <span className="text-xs font-bold text-[#9EFF00]">
                      {agent.name[0]}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-[#9EFF00] transition-colors">
                    {agent.name}
                  </span>
                </div>
                <p className="text-xs text-[#B8B8B8]/40 pl-11">{agent.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
