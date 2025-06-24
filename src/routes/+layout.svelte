<script lang="ts">
  import "../app.css";
  import { ViamProvider } from "@viamrobotics/svelte-sdk";
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
      thresholds: Record<string, number>;
    };
  }

  let { data, children }: Props = $props();

  function reloadPage() {
    location.reload();
  }
</script>

<ViamProvider dialConfigs={data.dialConfig}>
  <div class="flex flex-row border-0 border-green max-h-[720px] max-w-[1280px]">
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
            <a href="/" role="button" onclick={reloadPage}>Reload</a>
          </li>
        </ul>
      {/if}
    </nav>
    {@render children()}
  </div>
</ViamProvider>
