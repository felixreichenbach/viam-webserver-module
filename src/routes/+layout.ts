export const ssr = false;

import type { DialConf } from "@viamrobotics/sdk";
import type { LayoutLoad } from "./$types";
import { getCookie } from "typescript-cookie";

export const load: LayoutLoad = function () {
  const dc: DialConf = {
    host: getCookie("host") ?? "",
    credentials: {
      authEntity: getCookie("api-key-id") ?? "",
      type: "api-key",
      payload: getCookie("api-key") ?? "",
    },
  };

  const partid = getCookie("part-id") ?? "";
  const dialConfig: Record<string, DialConf> = { [partid]: dc };

  const cameraName = "camera" as string;
  const visionName = "vision" as string;
  return { dialConfig, cameraName, visionName };
};
