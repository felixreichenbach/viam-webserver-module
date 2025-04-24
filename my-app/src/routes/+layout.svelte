<script lang="ts">
  import "../app.css";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { ViamProvider } from "$lib";
  import type { Snippet } from "svelte";
  import Camera from "./components/camera.svelte";
  import type { DialConf } from "@viamrobotics/sdk";

  interface Props {
    children: Snippet;
    data: Record<string, DialConf>;
  }

  let { data, children }: Props = $props();
</script>

<ViamProvider dialConfigs={data}>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl font-bold">HPE Sealant Check</h1>
    <div class="my-4"></div>
    <Camera partID={Object.keys(data)[0]} name="camera" />
    {@render children()}
  </div>

  <SvelteQueryDevtools />
</ViamProvider>
