import type { DialConf } from "@viamrobotics/sdk";

const parseConfigs = () => {
  const rawRobots = import.meta.env.VITE_CONFIGS;

  if (!rawRobots) {
    console.warn(
      "Cannot find configs. Please read the README.md for more info"
    );
  }

  return JSON.parse(rawRobots ?? "{}");
};

export const dialConfigs: Record<string, DialConf> = parseConfigs();
