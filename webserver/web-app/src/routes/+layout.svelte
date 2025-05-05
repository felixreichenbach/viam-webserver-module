<script lang="ts">
  import "../app.css";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { ViamProvider } from "$lib";
  import type { Snippet } from "svelte";
  import type { DialConf } from "@viamrobotics/sdk";

  interface Props {
    children: Snippet;
    data: {
      dialConfig: Record<string, DialConf>;
      cameraName: string;
      visionName: string;
    };
  }

  let { data, children }: Props = $props();

  function handleMenuClick() {
    console.log("Menu button clicked");
    // Add your menu handling logic here
  }
</script>

<ViamProvider dialConfigs={data.dialConfig}>
  {console.log("data", data)}
  <div class="flex flex-row min-h-[720px]">
    <button
      class="absolute top-0 right-0 m-4 bg-blue-200 text-white w-16 h-16"
      onclick={handleMenuClick}>Menu</button
    >
    <div class="flex flex-col items-center">
      {@render children()}
    </div>
    <SvelteQueryDevtools />
  </div>
</ViamProvider>
