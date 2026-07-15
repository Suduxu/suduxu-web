"use client";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import React, { useEffect, useState } from "react";

const labelStyle =
  "text-[11px] font-bold text-slate-500 mb-2 block uppercase tracking-wider";
const inputStyle =
  "bg-[#161b22] border-white/10 text-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 rounded-lg h-11 transition-all placeholder:text-slate-700 shadow-sm";

export function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: string;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <label className={labelStyle}>{label}</label>
      <Input
        type={type}
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className={inputStyle}
      />
    </div>
  );
}

export function OTPField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [raw, setRaw] = useState(value ?? "");

  useEffect(() => {
    setRaw(value ?? "");
  }, [value]);

  const handleChange = (input: string) => {
    const digitsOnly = input.replace(/\D/g, "");
    setRaw(digitsOnly);
    onChange(digitsOnly.slice(0, 6));
  };

  return (
    <div className="mb-6 last:mb-0">
      <label className={labelStyle}>{label}</label>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        className={inputStyle}
      />
    </div>
  );
}

export function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any;
  onChange: (value: string[]) => void;
}) {
  const [raw, setRaw] = useState<string>(
    Array.isArray(value) ? value.join(", ") : ""
  );

  useEffect(() => {
    if (Array.isArray(value)) {
      const currentFormatted = value.join(", ");
      if (currentFormatted !== raw.trim().replace(/,\s*$/, "")) {
        setRaw(currentFormatted);
      }
    }
  }, [value]);

  const handleChange = (input: string) => {
    setRaw(input);

    const cleanInput = input.trim();
    
    if (cleanInput === "") {
      onChange([]);
      return;
    }

    if (input.endsWith(",")) {
      return;
    }

    const arr = input
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (arr.length > 0) {
      onChange(arr);
    }
  };

  return (
    <div className="mb-6 last:mb-0">
      <label className={labelStyle}>{label}</label>
      <Textarea
        value={raw}
        onChange={(e) => handleChange(e.target.value)}
        className={`${inputStyle} min-h-[120px] py-4 resize-none`}
      />
    </div>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 px-5 rounded-xl bg-[#161b22] border border-white/5 hover:border-white/10 transition-all mb-3 group/switch">
      <span className="text-[13px] font-semibold text-slate-300 group-hover/switch:text-white transition-colors">
        {label}
      </span>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-indigo-500 shadow-lg data-[state=unchecked]:bg-slate-500"
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <label className={labelStyle}>{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={inputStyle}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1c2128] border-white/10 text-slate-300">
          {options.map((opt) => (
            <SelectItem
              key={opt}
              value={opt}
              className="focus:bg-[#2a303a] focus:text-white hover:bg-[#2a303a]"
            >
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilesField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: any[];
  onChange: (value: any[]) => void;
}) {
  const files = value ?? [];

  const addFile = () => {
    onChange([
      ...files,
      {
        name: "",
        path: "",
        type: "Audio",
        theme_constraints: undefined,
      },
    ]);
  };

  const updateFile = (index: number, patch: any) => {
    const next = [...files];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const updateConstraint = (index: number, key: string, v: string) => {
    const next = [...files];
    next[index] = {
      ...next[index],
      theme_constraints: {
        ...(next[index].theme_constraints ?? {
          min_width: null,
          max_width: null,
        }),
        [key]: v === "" ? null : Number(v),
      },
    };
    onChange(next);
  };

  const removeFile = (index: number) => {
    const next = [...files];
    next.splice(index, 1);
    onChange(next);
  };

  return (
    <div className="mb-6">
      <label className={labelStyle}>{label}</label>

      <div className="space-y-3">
        {files.map((file, i) => {
          const isTheme = file.type === "LuaTheme" || file.type === "XMLTheme";

          return (
            <details
              key={i}
              open
              className="group rounded-xl border border-white/10 bg-[#0f141b] transition-all"
            >
              <summary className="px-4 py-3 flex items-center justify-between cursor-pointer list-none">
                <span className="text-sm font-semibold text-slate-300">
                  {file.name || `File ${i + 1}`}
                </span>

                <span className="text-slate-500 transition-transform group-open:rotate-180">
                  ▾
                </span>
              </summary>

              <div className="px-4 pb-4 space-y-3">
                <Input
                  className={inputStyle}
                  placeholder="Name"
                  value={file.name}
                  onChange={(e) =>
                    updateFile(i, { name: e.target.value })
                  }
                />

                <Input
                  className={inputStyle}
                  placeholder="Path"
                  value={file.path}
                  onChange={(e) =>
                    updateFile(i, { path: e.target.value })
                  }
                />

                <Select
                  value={file.type}
                  onValueChange={(v) => {
                    if (v === "Audio") {
                      updateFile(i, {
                        type: v,
                        theme_constraints: undefined,
                      });
                    } else {
                      updateFile(i, { type: v });
                    }
                  }}
                >
                  <SelectTrigger className={inputStyle}>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent className="bg-[#1c2128] border-white/10 text-slate-300">
                    <SelectItem
                      value="Audio"
                      className="focus:bg-[#2a303a] focus:text-white hover:bg-[#2a303a]"
                    >
                      Audio
                    </SelectItem>
                    <SelectItem
                      value="LuaTheme"
                      className="focus:bg-[#2a303a] focus:text-white hover:bg-[#2a303a]"
                    >
                      Lua Theme
                    </SelectItem>
                    <SelectItem
                      value="XMLTheme"
                      className="focus:bg-[#2a303a] focus:text-white hover:bg-[#2a303a]"
                    >
                      XML Theme
                    </SelectItem>
                  </SelectContent>
                </Select>

                {isTheme && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      className={inputStyle}
                      type="number"
                      placeholder="Min width"
                      value={file.theme_constraints?.min_width ?? ""}
                      onChange={(e) =>
                        updateConstraint(i, "min_width", e.target.value)
                      }
                    />
                    <Input
                      className={inputStyle}
                      type="number"
                      placeholder="Max width"
                      value={file.theme_constraints?.max_width ?? ""}
                      onChange={(e) =>
                        updateConstraint(i, "max_width", e.target.value)
                      }
                    />
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    className="text-xs text-red-400 hover:text-red-300"
                    onClick={() => removeFile(i)}
                  >
                    Remove file
                  </button>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <button
        onClick={addFile}
        className="mt-4 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
      >
        + Add file
      </button>
    </div>
  );
}
