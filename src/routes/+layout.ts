export const prerender = false;

import type { DialConf } from "@viamrobotics/sdk";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  let port: string;
  if (typeof window !== "undefined") {
    port = window.location.port;
  } else {
    // Provide a fallback or handle the case where `window` is not available
    port = "33333"; // Default port or any other fallback logic
  }
  const res = await fetch(`http://localhost:${33333}/data.json`);
  const data = await res.json();
  const dialConfig: Record<string, DialConf> = data["dialConfig"] as Record<
    string,
    DialConf
  >;

  const cameraName = data.webConfig["cameraName"] as string;
  const visionName = data.webConfig["visionName"] as string;
  return { dialConfig, cameraName, visionName };
};
