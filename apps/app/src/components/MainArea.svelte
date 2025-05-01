<script>
import { onMount } from 'svelte'
import ConsolePane from './ConsolePane.svelte'
import EditorPane from './EditorPane.svelte'

// Props
export const sidebarWidth = 250
export const inspectorOpen = true
export const inspectorWidth = 300
export let code = '' // Contract code
export const currentLine = -1 // Current execution line
export const logs = [] // Console logs

// State
let containerElement
let editorHeight = 70 // Percentage
let isResizing = false

// Event handlers
function startResize(event) {
	isResizing = true
	event.preventDefault()

	const startY = event.clientY
	const containerHeight = containerElement.clientHeight
	const startPercent = editorHeight

	function handleMouseMove(e) {
		const deltaY = e.clientY - startY
		const deltaPercent = (deltaY / containerHeight) * 100
		const newPercent = Math.max(20, Math.min(80, startPercent + deltaPercent))

		editorHeight = newPercent
	}

	function handleMouseUp() {
		isResizing = false
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
	}

	window.addEventListener('mousemove', handleMouseMove)
	window.addEventListener('mouseup', handleMouseUp)
}

function handleEditorReady(event) {
	// Can do initialization if needed
}

function handleCodeChange(event) {
	code = event.detail.code
}

// Lifecycle
onMount(() => {
	// Any initialization needed
})
</script>

<main 
  class="main-area {isResizing ? 'resizing' : ''}" 
  style="margin-left: {sidebarWidth}px; margin-right: {inspectorOpen ? inspectorWidth : 0}px;"
  bind:this={containerElement}
>
  <div class="editor-container" style="height: {editorHeight}%;">
    <EditorPane
      {code}
      {currentLine}
      on:ready={handleEditorReady}
      on:change={handleCodeChange}
    />
  </div>
  
  <div 
    class="resize-handle" 
    on:mousedown={startResize}
    aria-label="Resize editor and console"
    role="separator"
    aria-orientation="horizontal"
  >
    <div class="handle-indicator"></div>
  </div>
  
  <div class="console-container" style="height: calc(100% - {editorHeight}%);">
    <ConsolePane {logs} />
  </div>
</main>

<style>
  .main-area {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    height: calc(100vh - var(--header-height));
    background-color: var(--bg-main);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: margin 0.3s ease;
  }
  
  .main-area.resizing {
    user-select: none;
  }
  
  .editor-container, .console-container {
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .resize-handle {
    width: 100%;
    height: 8px;
    background-color: var(--bg-main);
    cursor: row-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
  }
  
  .resize-handle:hover {
    background-color: var(--highlight-line);
  }
  
  .handle-indicator {
    width: 60px;
    height: 4px;
    border-radius: 2px;
    background-color: var(--highlight-line);
  }
  
  .resize-handle:hover .handle-indicator {
    background-color: var(--accent);
  }
  
  @media (max-width: 900px) {
    .main-area {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }
  }
  
  @media (max-width: 600px) {
    .main-area {
      position: static;
      height: auto;
      min-height: calc(100vh - var(--header-height));
    }
    
    .editor-container {
      height: 400px !important;
    }
    
    .console-container {
      height: 300px !important;
    }
  }
</style>