"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CategorySection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-[#1c2128] hover:bg-[#21262d] transition-colors border-b border-white/5"
      >
        <span className="text-sm font-bold text-slate-200">{title}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="p-5 space-y-2 bg-[#0d1117]">
          {children}
        </div>
      )}
    </div>
  );
}