"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Agents", href: "#agents" },
  { label: "Technology", href: "#technology" },
  { label: "Resources", href: "#resources" },
  { label: "Company", href: "#company" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 backdrop-blur-md bg-[#050505]/70 border-b border-white/[0.04]"
    >
      <a href="#" className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="36" height="36" rx="8" stroke="#9EFF00" strokeWidth="2" />
          <path d="M12 28L20 12L28 28" stroke="#9EFF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 24H26" stroke="#9EFF00" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-medium tracking-[0.15em] uppercase">AMASEP</span>
      </a>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[13px] font-medium text-[#B8B8B8]/70 hover:text-white transition-colors duration-300 relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#9EFF00] transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <a href="#" className="text-[13px] font-medium text-[#B8B8B8]/70 hover:text-white transition-colors duration-300">
          Book a demo
        </a>
        <a
          href="#"
          className="text-[13px] font-medium text-[#050505] bg-white hover:bg-[#9EFF00] transition-colors duration-300 px-5 py-2.5 rounded-full"
        >
          Get started
        </a>
      </div>

      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0A0A0A] border-b border-white/[0.04] p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-[#B8B8B8]/70 hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
