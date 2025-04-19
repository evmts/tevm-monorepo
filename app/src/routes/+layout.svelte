<script lang="ts">
import { QueryClient } from '@tanstack/svelte-query';
import '../styles.css';

// Using $props() rune for component props
let { } = $props();

// Create a query client for TanStack Query
let queryClient = $state(new QueryClient());

// Initialize any global state or effects
$effect(() => {
  console.log('Layout component initialized');
});
</script>

{@render $$slots.default?.()}