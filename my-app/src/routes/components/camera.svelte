<script lang="ts">
import { createResourceClient, createResourceQuery } from '$lib';
import { CameraClient } from '@viamrobotics/sdk';

interface Props {
  partID: string;
  name: string;
}

let { partID, name }: Props = $props();

const cameraClient = createResourceClient(
  CameraClient,
  () => partID,
  () => name
);

const queryOptions = $state({
  refetchInterval: 1000,
});
const query = createResourceQuery(cameraClient, 'getImage', () => queryOptions);

const src = $derived(
  query.current.data
    ? URL.createObjectURL(new Blob([query.current.data], { type: 'image/png' }))
    : undefined
);
</script>

{#if query.current.error}
  {query.current.error.message}
{:else}
  <img
    {src}
    alt=""
    width="200"
  />
{/if}
