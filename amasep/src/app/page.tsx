import Navbar from "@/components/Navbar";
import HeroScene from "@/components/HeroScene";
import TrustSection from "@/components/TrustSection";
import AgentCivilization from "@/components/AgentCivilization";
import Workflow from "@/components/Workflow";
import CommandCenter from "@/components/CommandCenter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505]">
      <Navbar />
      <HeroScene />
      <TrustSection />
      <AgentCivilization />
      <Workflow />
      <CommandCenter />
      <Footer />
    </div>
  );
}
