<script lang="ts">
import { createRobotMutation, createRobotQuery, useRobotClient } from '$lib';

let { partID } = $props();

const client = useRobotClient(() => partID);
const version = createRobotQuery(client, 'getVersion');
const stopAll = createRobotMutation(client, 'stopAll');
</script>

{#if version.current.error}
  Error fetching version: {version.current.error.message}
{:else if version.current.data}
  <p>Platform: {version.current.data.platform}</p>
  <p>API version: {version.current.data.apiVersion}</p>
  <p>Version: {version.current.data.version}</p>
{/if}

<button onclick={() => stopAll.current.mutate([])}> Stop All </button>
