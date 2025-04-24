<script lang="ts">
import { useConnectionStatus, useResourceNames } from '$lib';
import { dialConfigs } from '../configs';
import Base from './base.svelte';
import Camera from './camera.svelte';
import Stream from './stream.svelte';
import Version from './version.svelte';

const partIDs = Object.keys(dialConfigs);

let partID = $state(partIDs[0] ?? '');

const status = useConnectionStatus(() => partID);
const resources = useResourceNames(() => partID);
const cameras = useResourceNames(() => partID, 'camera');
const bases = useResourceNames(() => partID, 'base');

let streaming = true;
</script>

<section class="p-4">
  <div class="flex items-center gap-2">
    {#each partIDs as id, index (id)}
      <button
        class="border p-2"
        class:bg-blue-100={partID === id}
        onclick={() => (partID = id)}
      >
        part {index + 1}
      </button>
    {/each}

    {status.current}
  </div>

  <Version {partID} />

  <h2 class="py-2">Resources</h2>
  {#if resources.error}
    Error fetching: {resources.error.message}
  {:else if resources.fetching}
    <ul class="text-xs">Fetching...</ul>
  {:else}
    <ul class="text-xs">
      {#each resources.current as resource (resource.name)}
        <li>{resource.name}</li>
      {/each}
    </ul>
  {/if}

  {#each bases.current as { name } (name)}
    <Base
      {name}
      {partID}
    />
  {/each}

  {#each cameras.current as { name } (name)}
    {#if streaming}
      <Stream
        {name}
        {partID}
      />
    {:else}
      <Camera
        {name}
        {partID}
      />
    {/if}
  {/each}
</section>
