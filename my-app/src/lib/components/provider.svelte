<script lang="ts">
import type { Snippet } from 'svelte';
import { QueryClientProvider, QueryClient } from '@tanstack/svelte-query';
import type { DialConf } from '@viamrobotics/sdk';
import InternalProvider from './internal-provider.svelte';

interface Props {
  dialConfigs: Record<string, DialConf>;
  client?: QueryClient;
  machineStatusRefetchInterval?: number;
  children: Snippet;
}

let {
  dialConfigs,
  client = new QueryClient(),
  machineStatusRefetchInterval,
  children,
}: Props = $props();
</script>

<QueryClientProvider {client}>
  <InternalProvider
    {dialConfigs}
    {machineStatusRefetchInterval}
  >
    {@render children()}
  </InternalProvider>
</QueryClientProvider>
