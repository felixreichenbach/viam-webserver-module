<script lang="ts">
  import "../app.css";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
  import { ViamProvider } from "$lib";
  import type { Snippet } from "svelte";
  import Parts from "./components/parts.svelte";
  import type { DialConf } from "@viamrobotics/sdk";

  interface Props {
    children: Snippet;
    data: Record<string, DialConf>;
  }

  let { data, children }: Props = $props();
  data["255bbeb9-6231-49a1-b265-41ae796bacdc"]["host"] =
    "mac-felix-main.9e2zv86qpa.viam.cloud";
</script>

<ViamProvider dialConfigs={data}>
  <Parts />
  {@render children()}
  <SvelteQueryDevtools />
</ViamProvider>
