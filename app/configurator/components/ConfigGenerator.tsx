"use client";
import { useConfigContext } from "../context/ConfigContext";
import CategorySection from "./CategorySection";
import { InputField, SelectField, SwitchField, TextareaField, OTPField, FilesField } from "./FormFields";
import { ConfigSchema } from "../lib/schema";
import * as z from "zod";
import { useState } from "react";
import CustomScrollArea from "./CustomScrollBar";

type Config = z.infer<typeof ConfigSchema>;
type ConfigKey = keyof Config;

const getSchemaByPath = (schema: z.ZodTypeAny, path: string[]): any => {
  let currentSchema: any = schema;
  for (const key of path) {
    if (currentSchema instanceof z.ZodObject) {
      currentSchema = currentSchema.shape[key];
      if (currentSchema instanceof z.ZodDefault) currentSchema = currentSchema.unwrap();
      if (!currentSchema) return null;
    } else return null;
  }
  return currentSchema;
};

const getEnumOptions = (schema: z.ZodTypeAny): string[] | null => {
  let innerSchema: any = schema;
  while (innerSchema instanceof z.ZodDefault) innerSchema = innerSchema.unwrap();
  if (innerSchema instanceof z.ZodArray) innerSchema = innerSchema.element;
  if (innerSchema instanceof z.ZodEnum) return Array.from(innerSchema.options) as string[];
  return null;
};

const defaultConfig = ConfigSchema.parse({});

const getTitleCase = (key: string, currentConfig: Config): string => {
  if (key === "list") {
    const strategy = currentConfig?.server?.connection_strategy;
    return `${strategy === "Whitelist" ? "Whitelist" : "Blacklist"}`;
  }
  return key
    .split(/[_ ]/)
    .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ")
    .replace("Ms", " (ms)")
    .replace("Tcp", " TCP")
    .replace("Udp", " UDP")
    .replace("Ip", " IP");
};

const getConfigValue = (config: Config, path: string[]) =>
  path.reduce((obj: any, key: string) => (obj && obj[key] !== undefined ? obj[key] : undefined), config);

const renderField = (
  parentPath: string[],
  key: string,
  defaultValue: unknown,
  config: Config,
  handleChange: (path: string[], value: unknown) => void,
) => {
  const currentPath = [...parentPath, key];
  const label = getTitleCase(key, config);
  const value = getConfigValue(config, currentPath);
  const fieldSchema = getSchemaByPath(ConfigSchema, currentPath);

  const parentKey = parentPath.join(".");

  // Server Rate Limit (Nested Object)
  if (parentKey === "server.rate_limit" && key !== "enabled" && !config.server.rate_limit.enabled) {
    return null;
  }

  // Health Check Sections
  if (parentKey === "health_check.server" && key !== "enabled" && !config.health_check.server.enabled) {
    return null;
  }
  if (parentKey === "health_check.clients" && key !== "enabled" && !config.health_check.clients.enabled) {
    return null;
  }

  // Security Section
  if (parentKey === "security" && key !== "enabled" && !config.security.enabled) {
    return null;
  }

  // Shared server port hides protocol-specific overrides.
  if (parentKey === "server" && ["tcp_port", "udp_port", "file_port"].includes(key) && config.server.port != null) {
    return null;
  }

  // File Sharing Section
  if (parentKey === "file_sharing" && key !== "enabled" && !config.file_sharing.enabled) {
    return null;
  }

  if (parentKey === "server" && key === "file_port" && !config.file_sharing.enabled) {
    return null;
  }
  
  // Screen Capture Section
  if (parentKey === "screen_capture" && key !== "enabled" && !config.screen_capture.enabled) {
    return null;
  }

  if (parentPath.join(".") === "file_sharing" && key === "files") {
    return (
      <FilesField
        key={currentPath.join(".")}
        label={label}
        value={Array.isArray(value) ? value : []}
        onChange={(v) => handleChange(currentPath, v)}
      />
    );
  }


  if (parentPath.join(".") === "security" && key === "password") {
    return (
      <OTPField
        key={currentPath.join(".")}
        label={label}
        value={value ?? "000000"}
        onChange={(v) => handleChange(currentPath, v)}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <SwitchField
        key={currentPath.join(".")}
        label={label}
        checked={value}
        onChange={(v) => handleChange(currentPath, v)}
      />
    );
  }

  if (Array.isArray(value)) {
    return (
      <TextareaField
        key={currentPath.join(".")}
        label={label}
        value={value}
        onChange={(v) => handleChange(currentPath, v)}
      />
    );
  }

  if (fieldSchema) {
    const enumOptions = getEnumOptions(fieldSchema);
    if (enumOptions) {
      return (
        <SelectField
          key={currentPath.join(".")}
          label={label}
          value={value}
          options={enumOptions}
          onChange={(v) => handleChange(currentPath, v)}
        />
      );
    }
  }

  if (typeof value === "string" || typeof value === "number") {
    const isSensorTransmissionRate =
      currentPath.join(".") === "devices.initial_sensor_transmission_rate";

    return (
      <InputField
        key={currentPath.join(".")}
        label={label}
        type={typeof value === "number" ? "number" : "text"}
        value={value}
        min={isSensorTransmissionRate ? 10 : undefined}
        max={isSensorTransmissionRate ? 200 : undefined}
        onChange={(v) =>
          handleChange(currentPath, typeof value === "number" ? Number(v) : v)
        }
      />
    );
  }

  return null;
};

const renderObject = (path: string[], obj: any, config: Config, handleChange: (path: string[], value: unknown) => void) => {
  return Object.keys(obj).map((key: string) => {
    const value = obj[key];
    const currentPath = [...path, key];

    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(path.join(".") === "file_sharing" && key === "files")
    ) {

      const title = getTitleCase(key, config);
      return (
        <div key={currentPath.join(".")} className="py-4 border-b border-white/5 last:border-0">
          <h3 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.15em] mb-4">
            {title}
          </h3>
          <div className="space-y-3">
            {renderObject(currentPath, value, config, handleChange)}
          </div>
        </div>
      );
    }

    return renderField(path, key, value, config, handleChange);
  });
};

export default function ConfigGenerator({ viewMode }: { viewMode: "tabs" | "scroll" }) {
  const { config, handleChange } = useConfigContext();
  const categories = Object.keys(defaultConfig) as ConfigKey[];
  const [activeTab, setActiveTab] = useState<ConfigKey>(categories[0]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (viewMode === "tabs") {
    return (
      <div className="flex h-full">
        <aside className="w-56 border-r border-white/5 p-6 flex flex-col gap-1.5 bg-[#0d1117]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 px-3">
            Categories
          </p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`text-left px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                activeTab === cat
                  ? "bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {getTitleCase(cat, config)}
            </button>
          ))}
        </aside>
        <div className="flex-grow">
          <CustomScrollArea>
            <div className="p-10 max-w-3xl">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {getTitleCase(activeTab, config)}
                </h2>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
              </div>
              {renderObject([activeTab], defaultConfig[activeTab], config, handleChange)}
            </div>
          </CustomScrollArea>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-grow relative">
        <CustomScrollArea>
          <div className="p-10 max-w-3xl mx-auto space-y-6 pb-32">
            {categories.map((cat) => (
              <div key={cat} id={`section-${cat}`} className="scroll-mt-20">
                <CategorySection title={getTitleCase(cat, config)}>
                  {renderObject([cat], defaultConfig[cat], config, handleChange)}
                </CategorySection>
              </div>
            ))}
          </div>
        </CustomScrollArea>
      </div>
      <aside className="w-56 border-l border-white/5 p-6 hidden lg:flex flex-col gap-1.5 bg-[#0d1117]">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          On this page
        </p>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => scrollToSection(`section-${cat}`)}
            className="text-left px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors border-l border-white/10 hover:border-indigo-500/50 pl-4"
          >
            {getTitleCase(cat, config)}
          </button>
        ))}
      </aside>
    </div>
  );
}
