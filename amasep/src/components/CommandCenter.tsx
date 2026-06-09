"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, Search, Menu, Users, Activity, Settings, Database, Folder, Shield, PieChart, LineChart } from "lucide-react";

/* ─── Dashboard 3D Map ─── */
function DashboardMap() {
  const groupRef = useRef<THREE.Group>(null);
  
  const { positions, lines } = useMemo(() => {
    const nodeCount = 40;
    const pos = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 4;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // relatively flat
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    // Create connection lines
    const lineIndices = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i*3] - pos[j*3];
        const dy = pos[i*3+1] - pos[j*3+1];
        const dz = pos[i*3+2] - pos[j*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < 2.5) {
          lineIndices.push(i, j);
        }
      }
    }
    
    return { positions: pos, lines: lineIndices };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      {/* Rings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.8, 4.82, 64]} />
        <meshBasicMaterial color="#9EFF00" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 3.02, 64]} />
        <meshBasicMaterial color="#9EFF00" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#9EFF00" transparent opacity={0.8} />
      </points>

      {/* Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="index" array={new Uint16Array(lines)} itemSize={1} />
        </bufferGeometry>
        <lineBasicMaterial color="#9EFF00" transparent opacity={0.15} />
      </lineSegments>
      
      {/* Center glowing core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#9EFF00" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

const stats = [
  { label: "Active Workflows", value: "128" },
  { label: "Success Rate", value: "98.7%" },
  { label: "Avg. Cycle Time", value: "4.2 min" },
  { label: "Agents Online", value: "11 / 11" },
  { label: "System Health", value: "Excellent" },
];

export default function CommandCenter() {
  return (
    <section id="command-center" className="relative w-full py-32 px-6 md:px-12 border-b border-white/[0.04]">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-12 items-center">
        
        {/* Left Content */}
        <div className="w-full lg:w-[35%] lg:pr-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9EFF00]" />
              <span className="text-[10px] font-medium tracking-widest uppercase text-white">
                Command Center
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white mb-6 leading-[1.1]">
              Total Visibility.<br />
              Total Control.
            </h2>
            <p className="text-[#B8B8B8] text-sm md:text-base leading-relaxed mb-8 max-w-md">
              Monitor every agent, every workflow, every deployment in real-time from a single 
              intelligence command center.
            </p>
            <a href="#dashboard" className="inline-flex items-center gap-2 text-[#9EFF00] font-medium text-sm hover:gap-3 transition-all duration-300">
              Explore dashboard <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="w-full lg:w-[65%]">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full rounded-2xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex shadow-2xl shadow-[#9EFF00]/5"
            style={{ aspectRatio: "16/9" }}
          >
            {/* Sidebar */}
            <div className="w-16 border-r border-white/5 flex flex-col items-center py-6 gap-8 bg-[#050505]/50">
              <div className="w-8 h-8 rounded border border-[#9EFF00]/30 flex items-center justify-center mb-4">
                <Menu className="w-4 h-4 text-[#9EFF00]" />
              </div>
              <Activity className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <Users className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <Database className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <Folder className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <Shield className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              <div className="mt-auto">
                <Settings className="w-5 h-5 text-white/40 hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              {/* Top Bar */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6">
                <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-md border border-white/10 text-white/40 text-sm">
                  <Search className="w-4 h-4" />
                  <span>Search across agents...</span>
                </div>
                <div className="flex items-center gap-[-8px]">
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gray-600 z-10" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gray-500 z-20 -ml-3" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-gray-400 z-30 -ml-3" />
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-[#9EFF00] z-40 -ml-3 flex items-center justify-center">
                    <span className="text-[10px] text-black font-bold">+2</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Body */}
              <div className="flex-1 flex p-6 gap-6">
                {/* Left Area (Stats & Map) */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-white text-lg font-medium mb-6">Mission Overview</h3>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {stats.map((s, i) => (
                      <div key={i} className="flex flex-col border-r border-white/5 last:border-0 pr-4">
                        <span className="text-[10px] text-[#B8B8B8] mb-1 uppercase tracking-wider">{s.label}</span>
                        <span className={`text-xl font-light ${s.value === "Excellent" ? "text-[#9EFF00]" : "text-white"}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* 3D Map Area */}
                  <div className="flex-1 relative rounded-xl border border-white/5 bg-[#050505]/50 overflow-hidden">
                    <Canvas camera={{ position: [0, 4, 10], fov: 45 }} dpr={[1, 1.5]}>
                      <DashboardMap />
                    </Canvas>
                  </div>
                </div>

                {/* Right Sidebar Charts */}
                <div className="w-64 flex flex-col gap-6">
                  {/* Workflow Activity Chart */}
                  <div className="flex-1 rounded-xl border border-white/5 bg-[#050505]/50 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#B8B8B8] font-medium">Workflow Activity</span>
                      <LineChart className="w-3 h-3 text-white/40" />
                    </div>
                    <div className="flex-1 flex items-end gap-[2px]">
                      {Array.from({length: 30}).map((_, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-[#9EFF00]/30 rounded-t-sm" 
                          style={{height: `${Math.random() * 80 + 20}%`}} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Agent Utilization Chart */}
                  <div className="flex-1 rounded-xl border border-white/5 bg-[#050505]/50 p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#B8B8B8] font-medium">Agent Utilization</span>
                      <PieChart className="w-3 h-3 text-white/40" />
                    </div>
                    <div className="flex-1 flex items-center justify-center relative">
                      <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#9EFF00" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="20.096" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-light text-white">92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
