"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const logos = [
  "OpenAI",
  "Anthropic",
  "Google",
  "Microsoft",
  "NVIDIA",
  "AWS",
  "Meta",
];

export default function TrustSection() {
  return (
    <section className="relative w-full py-12 border-t border-b border-white/[0.04] bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <span className="text-xs font-medium tracking-[0.15em] uppercase text-[#B8B8B8]/40 whitespace-nowrap">
            Trusted by forward-thinking teams
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo) => (
              <span
                key={logo}
                className="text-sm font-medium tracking-widest uppercase text-[#B8B8B8]/30 hover:text-[#B8B8B8]/60 transition-colors duration-300"
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
