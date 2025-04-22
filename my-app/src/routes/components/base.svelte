<script lang="ts">
import { createResourceClient, createResourceQuery } from '$lib';
import { createResourceMutation } from '$lib/hooks/create-resource-mutation.svelte';
import { BaseClient } from '@viamrobotics/sdk';

interface Props {
  partID: string;
  name: string;
}

let { partID, name }: Props = $props();

const client = createResourceClient(
  BaseClient,
  () => partID,
  () => name
);

const isMoving = createResourceQuery(client, 'isMoving', {
  refetchInterval: 1000,
});
const moveStraight = createResourceMutation(client, 'moveStraight');
</script>

Is moving: {isMoving.current.data ?? false}

<button onclick={() => moveStraight.current.mutate([100, 10])}>Move</button>
