<script lang="ts">
import type { ReactElement } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { onDestroy } from 'svelte'

const container = $state<HTMLDivElement>()
const root = $state<Root>()

const { element } = $props<{
	element: ReactElement
}>()

$effect(() => {
	if (container) {
		createRoot(container).render(element)
	}
})

onDestroy(() => {
	if (root) {
		root.unmount()
	}
})
</script>
  
  <div bind:this={container}></div>