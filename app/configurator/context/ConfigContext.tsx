"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ConfigSchema, ConfigType } from "../lib/schema";
import { setNestedValue } from "../lib/utils";

type ConfigContextType = {
  config: ConfigType;
  handleChange: (path: string[], value: any) => void;
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ConfigType>(ConfigSchema.parse({}));
  useEffect(() => {
    if (config.server.increment_port) {
      setConfig((prev) => ({
        ...prev,
        server: {
          ...prev.server,
          tcp_port: prev.server.port + 1,
          udp_port: prev.server.port + 2,
          file_port: prev.server.port + 3,
        },
      }));
    }
  }, [config.server.increment_port, config.server.port]);
  const handleChange = (path: string[], value: any) => {
    setConfig((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      setNestedValue(copy, path, value);
      return copy;
    });
  };
  return <ConfigContext.Provider value={{ config, handleChange }}>{children}</ConfigContext.Provider>;
};

export const useConfigContext = () => {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfigContext must be inside ConfigProvider");
  return ctx;
};