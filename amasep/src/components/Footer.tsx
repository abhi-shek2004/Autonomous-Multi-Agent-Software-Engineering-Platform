"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer id="company" className="relative w-full py-32 px-6 md:px-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-[#050505]" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light tracking-tight text-white mb-6">
            The future of engineering
            <br />
            is <span className="text-[#9EFF00] italic">autonomous.</span>
          </h2>
          <p className="max-w-xl mx-auto text-base md:text-lg text-[#B8B8B8]/60 leading-relaxed mb-10">
            Join the companies building tomorrow with intelligence that never stops.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#platform"
              className="group flex items-center gap-2 px-8 py-4 text-sm font-medium text-[#050505] bg-[#9EFF00] hover:bg-[#b3ff4d] transition-all duration-300 rounded-full"
            >
              Launch AMASEP
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="group flex items-center gap-2 px-8 py-4 text-sm font-medium text-white border border-white/20 hover:border-[#9EFF00]/40 hover:text-[#9EFF00] transition-all duration-300 rounded-full"
            >
              <Play className="w-4 h-4" />
              Book a Demo
            </a>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="36" height="36" rx="8" stroke="#9EFF00" strokeWidth="2" />
              <path d="M12 28L20 12L28 28" stroke="#9EFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 24H26" stroke="#9EFF00" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium tracking-[0.15em] uppercase">AMASEP</span>
          </div>
          <p className="text-xs text-[#B8B8B8]/30">
            &copy; 2026 AMASEP. Autonomous Multi-Agent Software Engineering Platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
