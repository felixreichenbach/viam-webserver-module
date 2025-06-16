import { writable, type Writable } from "svelte/store";

export enum AppMode {
  Default = "default",
  Calibrate = "calibrate",
}

export const appMode: Writable<AppMode> = writable(AppMode.Default);
