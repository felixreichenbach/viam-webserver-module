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
  <div class="flex min-h-[720px] border-2 border-green-500">
    <div
      class="grid grid-cols-2 min-w-[400px] border-2 border-red-500 max-w-[720px]"
    >
      <div class="flex flex-col border-2 border-amber-300">
        <Vision
          partID={Object.keys(data.dialConfig)[0]}
          name={data.visionName}
          cameraName={data.cameraName}
        />
      </div>
      <div class="flex flex-col justify-between items-center">
        <h1 class="text-3xl font-bold">Contour Check</h1>
        <button class="ml-4 bg-blue-200 text-white w-16 h-16">Menu</button>
      </div>
      <div class="my-4"></div>
      <!--      <Vision
        partID={Object.keys(data.dialConfig)[0]}
        name={data.visionName}
        cameraName={data.cameraName}
      /> -->
      {@render children()}
    </div>

    <SvelteQueryDevtools />
  </div>
</ViamProvider>
