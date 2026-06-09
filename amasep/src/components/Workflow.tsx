"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw, Shield, AlertCircle } from "lucide-react";

const steps = [
  { id: "requirements", label: "Requirements", description: "AI analyzes business needs" },
  { id: "prd", label: "PRD", description: "Generates product specs" },
  { id: "architecture", label: "Architecture", description: "Designs system blueprint" },
  { id: "code", label: "Code Generation", description: "Writes production code" },
  { id: "review", label: "Review", description: "Quality & security audit" },
  { id: "testing", label: "Testing", description: "Automated test suite" },
  { id: "deploy", label: "Deployment", description: "Ships to production" },
];

export default function Workflow() {
  const [activeStep, setActiveStep] = useState(4);
  const [healing, setHealing] = useState(false);
  const [healed, setHealed] = useState(false);

  const handleStepClick = (index: number) => {
    if (index === 4 && !healed) {
      setHealing(true);
      setTimeout(() => {
        setHealing(false);
        setHealed(true);
      }, 2500);
    }
    setActiveStep(index);
  };

  return (
    <section id="platform" className="relative w-full py-32 px-6 md:px-12">
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
              Self-Healing Workflow
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6">
            Autonomous.
            <br />
            Adaptive.
            <br />
            Self-Healing.
          </h2>
          <p className="max-w-xl text-base md:text-lg text-[#B8B8B8]/60 leading-relaxed">
            From requirements to production, AMASEP detects issues, adapts in real-time,
            and continuously improves until excellence is achieved.
          </p>
        </motion.div>

        <div className="relative">
          {/* Energy flow background line */}
          <div className="hidden md:block absolute top-[60px] left-0 right-0 h-px z-0">
            <motion.div
              className="h-full bg-gradient-to-r from-[#9EFF00]/0 via-[#9EFF00]/30 to-[#9EFF00]/0"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-stretch justify-between gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => handleStepClick(index)}
                className={`flex-1 relative p-5 rounded-xl border transition-all duration-500 cursor-pointer min-h-[160px] flex flex-col justify-between ${
                  index <= activeStep && !healing
                    ? "border-[#9EFF00]/30 bg-[#9EFF00]/5"
                    : "border-white/[0.04] bg-[#0A0A0A] hover:border-white/10"
                } ${healing && index === 4 ? "border-[#FF4D4D]/50 bg-[#FF4D4D]/5" : ""} ${
                  healed && index === 4 ? "border-[#00E676]/30 bg-[#00E676]/5" : ""
                }`}
              >
                <div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                      index < activeStep || (healed && index === 4)
                        ? "bg-[#00E676]/20"
                        : index === activeStep && healing
                        ? "bg-[#FF4D4D]/20 animate-pulse"
                        : index === activeStep
                        ? "bg-[#9EFF00]/20"
                        : "bg-white/5"
                    }`}
                  >
                    {index < activeStep || (healed && index === 4) ? (
                      <Check className="w-5 h-5 text-[#00E676]" />
                    ) : index === activeStep && healing ? (
                      <RefreshCw className="w-5 h-5 text-[#FF4D4D] animate-spin" />
                    ) : index === activeStep && healed ? (
                      <Shield className="w-5 h-5 text-[#00E676]" />
                    ) : index === activeStep ? (
                      <Shield className="w-5 h-5 text-[#9EFF00]" />
                    ) : (
                      <span className="text-xs text-white/30">{index + 1}</span>
                    )}
                  </div>
                  <h3 className={`text-sm font-semibold mb-1 ${index <= activeStep ? "text-white" : "text-white/30"}`}>
                    {step.label}
                  </h3>
                  <p className="text-xs text-[#B8B8B8]/40 leading-relaxed">{step.description}</p>
                </div>

                {/* Connection arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-[60px] w-4 h-px bg-white/10 items-center">
                    <div className="w-1 h-1 rounded-full bg-white/20 absolute right-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Self-healing indicator */}
          {healing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-6 rounded-xl border border-[#FF4D4D]/20 bg-[#FF4D4D]/5"
            >
              <div className="flex items-center gap-3 mb-2">
                <RefreshCw className="w-5 h-5 text-[#FF4D4D] animate-spin" />
                <span className="text-sm font-semibold text-[#FF4D4D]">
                  Autonomous Recovery Active
                </span>
              </div>
              <p className="text-xs text-[#B8B8B8]/40">
                Review detected an issue. Debugger agent activated. Pipeline rerouting and self-healing in progress...
              </p>
              <div className="mt-3 h-1 bg-[#FF4D4D]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#FF4D4D] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}

          {healed && !healing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-xl border border-[#00E676]/20 bg-[#00E676]/5"
            >
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-5 h-5 text-[#00E676]" />
                <span className="text-sm font-semibold text-[#00E676]">
                  Self-Healing Complete
                </span>
              </div>
              <p className="text-xs text-[#B8B8B8]/40">
                Issue resolved autonomously. Pipeline continuing to Testing phase.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
