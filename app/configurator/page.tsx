"use client";

import Link from "next/link";
import { ConfigProvider } from "./context/ConfigContext";
import LiveJSON from "./components/LiveJSON";
import ConfigGenerator from "./components/ConfigGenerator";

export default function ConfigPage() {
  return (
    <ConfigProvider>
      <div className="h-screen bg-[#0d1117] text-slate-200 font-sans selection:bg-indigo-500/30">
        <nav className="w-full border-b border-white/10 fixed z-20 bg-[#0d1117] h-14 flex items-center">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-500 rounded-md rotate-3" />
              <h1 className="text-sm font-bold tracking-tight text-white uppercase">Suduxu Config</h1>
            </Link>
          </div>
        </nav>
        
        <div className="h-14"></div>
        
        <main className="container mx-auto h-[calc(100%-3.5rem)] flex flex-col md:flex-row overflow-hidden">
          <section className="w-full md:w-3/5 h-[55vh] md:h-full border-r-0 md:border-r border-white/10">
             <ConfigGenerator viewMode={"tabs"} />
          </section>

          <section className="w-full md:w-2/5 h-[40vh] md:h-full mt-4 md:mt-0">
            <LiveJSON />
          </section>
        </main>
      </div>
    </ConfigProvider>
  );
}