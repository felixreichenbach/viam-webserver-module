<script lang="ts">
  import "../app.css";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { ViamProvider } from "$lib";
  import type { Snippet } from "svelte";
  import type { DialConf } from "@viamrobotics/sdk";
  import Vision from "./components/vision.svelte";

  interface Props {
    children: Snippet;
    data: {
      dialConfig: Record<string, DialConf>;
      cameraName: string;
      visionName: string;
    };
  }

  let { data, children }: Props = $props();
</script>

<ViamProvider dialConfigs={data.dialConfig}>
  {console.log("data", data)}
  <div
    class="flex h-screen w-[1280px] flex-col gap-6 border-1 border-green-200 mx-auto"
  >
    <h1 class="text-2xl font-bold mt-12">Sealant Check</h1>
    <Vision
      partID={Object.keys(data.dialConfig)[0]}
      name={data.visionName}
      cameraName={data.cameraName}
    />
    {@render children()}
  </div>

  <SvelteQueryDevtools />
</ViamProvider>
