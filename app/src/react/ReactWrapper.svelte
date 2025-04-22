<script lang="ts">
    import { onDestroy } from 'svelte';
    import { createRoot, type Root } from 'react-dom/client';
    import type { ReactElement } from 'react';
  
    let container = $state<HTMLDivElement>();
    let root = $state<Root>();
  
    let { element } = $props<{
        element: ReactElement;
    }>();
  
    $effect(() => {
        if (container) {
            createRoot(container)
            .render(element);
        }
    });
  
    onDestroy(() => {
      if (root) {
        root.unmount();
      }
    });
  </script>
  
  <div bind:this={container}></div>