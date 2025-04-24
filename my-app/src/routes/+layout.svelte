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
  <Camera partID={Object.keys(data)[0]} name="camera" />
  {@render children()}
  <SvelteQueryDevtools />
</ViamProvider>
