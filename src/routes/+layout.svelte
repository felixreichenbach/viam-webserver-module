<script lang="ts">
  import "../app.css";
  import { ViamProvider } from "$lib";
  import type { Snippet } from "svelte";
  import type { DialConf } from "@viamrobotics/sdk";
  import { Hamburger } from "svelte-hamburgers";
  import { fly } from "svelte/transition";

  import { appMode } from "$lib/stores";
  import { AppMode } from "$lib/stores";

  function toggleAppMode() {
    appMode.update((currentValue) =>
      currentValue === AppMode.Default ? AppMode.Calibrate : AppMode.Default
    );
  }

  let open = $state(false);

  interface Props {
    children: Snippet;
    data: {
      dialConfig: Record<string, DialConf>;
      cameraName: string;
      visionName: string;
      thresholds: Record<string, number>;
    };
  }

  let { data, children }: Props = $props();

  function reloadPage() {
    location.reload();
  }
</script>

<ViamProvider dialConfigs={data.dialConfig}>
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
          <li>
            <a href="/" role="button" onclick={toggleAppMode}
              >{$appMode == AppMode.Calibrate ? "Verify" : "Calibrate"}</a
            >
          </li>
          <li>
            <a href="/" role="button" onclick={reloadPage}>Reload</a>
          </li>
        </ul>
      {/if}
    </nav>
    <div class="flex flex-col items-center">
      {@render children()}
    </div>
  </div>
</ViamProvider>
