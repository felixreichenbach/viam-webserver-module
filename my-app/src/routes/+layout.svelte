<script lang="ts">
import '../app.css';
import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
import { ViamProvider } from '$lib';
import type { Snippet } from 'svelte';
import { dialConfigs } from './configs';
import Parts from './components/parts.svelte';

interface Props {
  children: Snippet;
}

let { children }: Props = $props();
</script>

<ViamProvider {dialConfigs}>
  <Parts />
  {@render children()}
  <SvelteQueryDevtools />
</ViamProvider>
