"use client";
import { useConfigContext } from "../context/ConfigContext";
import { Button } from "./ui/button";
import { Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import CustomScrollArea from "./CustomScrollBar";

export default function LiveJSON() {
  const { config } = useConfigContext();
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = async () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const pickerWindow = window as Window & {
      showSaveFilePicker?: (options?: {
        suggestedName?: string;
        types?: Array<{
          description?: string;
          accept: Record<string, string[]>;
        }>;
      }) => Promise<FileSystemFileHandle>;
    };

    if (pickerWindow.showSaveFilePicker) {
      try {
        const handle = await pickerWindow.showSaveFilePicker({
          suggestedName: "suduxu.json",
          types: [
            {
              description: "JSON file",
              accept: {
                "application/json": [".json"],
              },
            },
          ],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
      }
    }

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "suduxu.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const highlightJson = (jsonStr: string) => {
    let colored = jsonStr
      .replace(/"([^"]+)":/g, '<span class="text-slate-300/75">"$1"</span>:')
      .replace(/:\s*"(.*?)"/g, ': <span class="text-indigo-400 font-medium">"$1"</span>')
      .replace(/([,\[]\s*)"([^"]+)"/g, '$1<span class="text-indigo-400">"$2"</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-pink-400 font-bold">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-amber-400">$1</span>');

    return <pre className="font-mono text-[12px] leading-[1.7] antialiased" dangerouslySetInnerHTML={{ __html: colored }} />;
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col h-full border border-white/10 rounded-2xl bg-[#161b22]/20 overflow-hidden shadow-2xl">
        
        <div className="flex flex-col gap-3 px-4 sm:px-6 pb-4 pt-4 sm:pt-5 bg-[#1c2128]/50 border-b border-white/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Preview</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-full justify-center px-4 text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all sm:w-auto"
            >
              {copied ? (
                <Check size={12} className="mr-2 text-emerald-500" />
              ) : (
                <Copy size={12} className="mr-2" />
              )}
              {copied ? "Copied" : "Copy JSON"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-full justify-center px-4 text-[10px] uppercase font-bold tracking-widest text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all sm:w-auto"
            >
              <Download size={12} className="mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="flex-grow overflow-hidden relative">
          <CustomScrollArea className="h-full">
            <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
              {highlightJson(jsonString)}
            </div>
          </CustomScrollArea>
        </div>
      </div>
    </div>
  );
}