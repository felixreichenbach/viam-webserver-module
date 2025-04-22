<script lang="ts">
import type { Snippet } from 'svelte';
import type { DialConf } from '@viamrobotics/sdk';
import { provideRobotClientsContext } from '$lib/hooks/robot-clients.svelte';
import { provideResourceNamesContext } from '$lib/hooks/resource-names.svelte';
import { provideMachineStatusContext } from '$lib/hooks/machine-status.svelte';

interface Props {
  dialConfigs: Record<string, DialConf>;
  children: Snippet;
  machineStatusRefetchInterval?: number | undefined;
}

let {
  dialConfigs,
  machineStatusRefetchInterval = 1000,
  children,
}: Props = $props();

provideRobotClientsContext(() => dialConfigs);
provideMachineStatusContext(() => machineStatusRefetchInterval);
provideResourceNamesContext();
</script>

{@render children()}
