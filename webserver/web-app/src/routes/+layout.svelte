<script lang="ts">
  import "../app.css";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { ViamProvider } from "$lib";
  import type { Snippet } from "svelte";
  import type { DialConf } from "@viamrobotics/sdk";
  import { Hamburger } from "svelte-hamburgers";
  import { fly } from "svelte/transition";

  let open = $state(false);

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
    location.reload();
  }
</script>

<ViamProvider dialConfigs={data.dialConfig}>
  {console.log("data", data)}
  <div class="flex flex-row min-h-[720px]">
    <nav class="absolute top-0 right-0 m-4 w-16 h-16">
      <Hamburger
        bind:open
        type="collapse"
        title="Toggle nav links"
        ariaControls="nav"
      />

      {#if open}
        <ul id="nav" class="menu" transition:fly={{ y: -15 }}>
          <li><a href="/">Check</a></li>
          <li><a href="/calibrate">Calibrate</a></li>
          <li>
            <a href="/" role="button" onclick={handleMenuClick}>Reload</a>
          </li>
        </ul>
      {/if}
    </nav>
    <div class="flex flex-col items-center">
      {@render children()}
    </div>
    <SvelteQueryDevtools />
  </div>
</ViamProvider>
