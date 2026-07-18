import z from "zod";

export const ConfigSchema = z.object({
  server: z
    .object({
      address: z.string().default("0.0.0.0"),
      port: z.number().default(9000),
      connection_strategy: z.enum(["Whitelist", "Blacklist"]).default("Whitelist"),
      list: z.array(z.string()).default(["192.168.1.100"]),
      rate_limit: z
        .object({
          enabled: z.boolean().default(true),
          max_tcp_requests_per_minute: z.number().default(120),
        })
        .default({
          enabled: true,
          max_tcp_requests_per_minute: 120,
        }),
      tcp_port: z.number().default(8081),
      udp_port: z.number().default(8082),
      file_port: z.number().default(8083),
    })
    .default({
      address: "0.0.0.0",
      port: 9000,
      connection_strategy: "Whitelist",
      list: [""],
      rate_limit: {
        enabled: true,
        max_tcp_requests_per_minute: 120,
      },
      tcp_port: 8081,
      udp_port: 8082,
      file_port: 8083,
    }),
  logging: z
    .object({
      debug_level: z.enum(["Debug", "Info", "Warn", "Error"]).default("Debug"),
      log_file: z.string().default("suduxu.log"),
      max_log_size: z.number().default(1048576),
      log_to_console: z.boolean().default(true),
    })
    .default({
      debug_level: "Debug",
      log_file: "suduxu.log",
      max_log_size: 1048576,
      log_to_console: true,
    }),
  security: z
    .object({
      enabled: z.boolean().default(true),
      password: z.number().int().min(100000).max(999999).nullable().default(null),
    })
    .default({
      enabled: true,
      password: 258000,
    }),
  file_sharing: z.object({
    enabled: z.boolean().default(true),
    shared_directory: z.string().nullable().default("./files"),
     files: z.array(
        z.object({
          name: z.string(),
          path: z.string(),
          type: z.enum(["Audio", "LuaTheme", "XMLTheme"]),
          theme_constraints: z.object({
            min_width: z.number().nullable().default(null),
            max_width: z.number().nullable().default(null),
          }).nullable().default(null),
        })
      ).default([]),
    initially_loaded: z.array(z.string()).nullable().default([]),
  })
  .default({
    enabled: true,
    shared_directory: "./shared_files",
    files: [],
    initially_loaded: [],
  }),
  devices: z
    .object({
      initially_send_sensor_data: z.boolean().default(true),
      max_devices: z.number().default(8),
      allowed_device_types: z
        .array(z.enum(["Android", "iOS", "Windows", "Linux", "macOS", "Other"]))
        .default(["Android", "iOS", "Windows", "Linux", "macOS", "Other"]),
      initial_sensor_transmission_rate: z.number().int().min(10).max(200).default(60),
    })
    .default({
      initially_send_sensor_data: true,
      max_devices: 8,
      allowed_device_types: ["Android", "iOS", "Windows", "Linux", "macOS", "Other"],
      initial_sensor_transmission_rate: 60,
    }),
  screen_capture: z
    .object({
      enabled: z.boolean().default(true),
      capture_on_server: z.boolean().default(true),
      capture_directory: z.string().nullable().default("./captures"),
    })
    .default({
      enabled: true,
      capture_on_server: true,
      capture_directory: "./captures",
    }),
  sensors: z
    .object({
      accelerometer: z.boolean().default(true),
      gyroscope: z.boolean().default(true),
      magnetometer: z.boolean().default(true),
      temperature: z.boolean().default(false),
      humidity: z.boolean().default(false),
      pressure: z.boolean().default(false),
      light: z.boolean().default(false),
    })
    .default({
      accelerometer: true,
      gyroscope: true,
      magnetometer: true,
      temperature: false,
      humidity: false,
      pressure: false,
      light: false,
    }),
  developer: z
    .object({
      prefer_cli: z.boolean().default(true),
      allow_mocked_sensors: z.boolean().default(false),
      allow_mocked_buttons: z.boolean().default(false),
    })
    .default({
      prefer_cli: true,
      allow_mocked_sensors: false,
      allow_mocked_buttons: false,
    }),
  health_check: z
    .object({
      server: z
        .object({
          enabled: z.boolean().default(true),
          interval_ms: z.number().default(30000),
          timeout_ms: z.number().default(5000),
        })
        .default({
          enabled: true,
          interval_ms: 30000,
          timeout_ms: 5000,
        }),
      clients: z
        .object({
          enabled: z.boolean().default(true),
          interval_ms: z.number().default(60000),
          timeout_ms: z.number().default(10000),
        })
        .default({
          enabled: true,
          interval_ms: 60000,
          timeout_ms: 10000,
        }),
    })
    .default({
      server: {
        enabled: true,
        interval_ms: 30000,
        timeout_ms: 5000,
      },
      clients: {
        enabled: true,
        interval_ms: 60000,
        timeout_ms: 10000,
      },
    }),
});