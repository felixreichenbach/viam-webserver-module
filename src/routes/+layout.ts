export const prerender = false;
export const ssr = false;

import type { DialConf } from "@viamrobotics/sdk";
import type { LayoutLoad } from "./$types";
import { getCookie } from "typescript-cookie";

export const load: LayoutLoad = async ({ fetch }) => {
  const dc: DialConf = {
    host: getCookie("host") ?? "",
    credentials: {
      authEntity: getCookie("api-key-id") ?? "",
      type: "api-key",
      payload: getCookie("api-key") ?? "",
    },
    signalingAddress: "https://app.viam.com:443",
  };
  const partid = getCookie("part-id") ?? "";
  const dialConfig: Record<string, DialConf> = { [partid]: dc };

  const port = window.location.port;
  const res = await fetch(`http://localhost:${port}/config.json`);
  const cfg = await res.json();
  const cameraName = cfg.attributes.camera as string;
  const visionName = cfg.attributes.vision as string;
  const thresholds = cfg.attributes.thresholds as Record<string, number>;

  return { dialConfig, cameraName, visionName, thresholds };
};
