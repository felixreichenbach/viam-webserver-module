export const prerender = false;

import type { DialConf } from "@viamrobotics/sdk";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch }) => {
  // TODO: Port ist static which is not ideal
  const res = await fetch(`http://localhost:33332/data.json`);
  const data = await res.json();
  const dialConfig: Record<string, DialConf> = data["dialConfig"] as Record<
    string,
    DialConf
  >;
  return dialConfig;
};
