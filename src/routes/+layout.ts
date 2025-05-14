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

  const res = await fetch(`http://localhost:${8888}/config.json`);
  const cfg = await res.json();
  const cameraName = cfg.attributes.camera as string;
  const visionName = cfg.attributes.vision as string;

  return { dialConfig, cameraName, visionName };
};
