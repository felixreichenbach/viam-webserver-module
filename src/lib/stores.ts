import { writable, type Writable } from "svelte/store";

export const appMode: Writable<boolean> = writable(false);
