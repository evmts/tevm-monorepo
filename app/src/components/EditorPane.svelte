<script>
import { createEventDispatcher, onMount } from 'svelte'
import MonacoEditor from './MonacoEditor.svelte'

// Props
export let code = ''
export const currentLine = -1
export let breakpoints = []

// Editor
let editor
let monaco
let lineDecorations = []
let breakpointDecorations = []

const dispatch = createEventDispatcher()

// Handle editor ready event
function handleEditorReady(event) {
	editor = event.detail.editor
	monaco = event.detail.monaco

	// Update decorations if needed
	highlightCurrentLine()
	updateBreakpoints()

	// Pass the ready event up
	dispatch('ready', event.detail)
}

// Handle editor text changes
function handleEditorChange(event) {
	code = event.detail.value
	dispatch('change', { code })
}

// Toggle breakpoint at line
function toggleBreakpoint(line) {
	const index = breakpoints.indexOf(line)

	if (index !== -1) {
		// Remove existing breakpoint
		breakpoints = breakpoints.filter((bp) => bp !== line)
	} else {
		// Add new breakpoint
		breakpoints = [...breakpoints, line]
	}

	updateBreakpoints()
	dispatch('breakpointsChange', { breakpoints })
}

// Highlight current execution line
function highlightCurrentLine() {
	if (!editor || !monaco || currentLine < 0) return

	// Clear previous line decorations
	if (lineDecorations.length) {
		editor.deltaDecorations(lineDecorations, [])
	}

	// Add new decoration
	lineDecorations = editor.deltaDecorations(
		[],
		[
			{
				range: new monaco.Range(currentLine + 1, 1, currentLine + 1, 1),
				options: {
					isWholeLine: true,
					className: 'current-execution-line',
					glyphMarginClassName: 'execution-indicator',
					overviewRuler: {
						color: 'var(--accent)',
						position: monaco.editor.OverviewRulerLane.Center,
					},
				},
			},
		],
	)

	// Scroll the line into view
	editor.revealLineInCenter(currentLine + 1)
}

// Update breakpoint decorations
function updateBreakpoints() {
	if (!editor || !monaco) return

	// Clear previous breakpoint decorations
	if (breakpointDecorations.length) {
		editor.deltaDecorations(breakpointDecorations, [])
	}

	// Add new decorations
	const decorations = breakpoints.map((line) => ({
		range: new monaco.Range(line + 1, 1, line + 1, 1),
		options: {
			isWholeLine: false,
			glyphMarginClassName: 'breakpoint-indicator',
			overviewRuler: {
				color: 'var(--warn)',
				position: monaco.editor.OverviewRulerLane.Left,
			},
		},
	}))

	breakpointDecorations = editor.deltaDecorations([], decorations)
}

// React to current line changes
$: if (editor && monaco && currentLine !== undefined) {
	highlightCurrentLine()
}

// React to breakpoints changes
$: if (editor && monaco && breakpoints) {
	updateBreakpoints()
}

// Lifecycle
onMount(() => {
	// Initial setup if needed
})
</script>

<div class="editor-pane">
  <div class="editor-header">
    <div class="file-info">
      <span class="file-name">Counter.sol</span>
    </div>
    <div class="editor-actions">
      <button class="icon-button" title="Add Watch Expression" aria-label="Add watch expression">
        <span class="icon">👁️</span>
      </button>
    </div>
  </div>
  
  <div class="editor-content">
    <MonacoEditor
      language="solidity"
      value={code}
      height="100%"
      on:ready={handleEditorReady}
      on:change={handleEditorChange}
      on:lineClick={event => toggleBreakpoint(event.detail.lineNumber - 1)}
    />
  </div>
  
  <div class="inline-hints">
    {#if currentLine >= 0}
      <div 
        class="gas-badge animate-pop"
        style="top: {(currentLine * 19) + 45}px"
      >
        Gas: 5000
      </div>
      
      <div 
        class="opcode-badge animate-pop"
        style="top: {(currentLine * 19) + 45}px"
      >
        SSTORE
      </div>
    {/if}
  </div>
</div>

<style>
  .editor-pane {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--bg-main);
    position: relative;
  }
  
  .editor-header {
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-2);
    background-color: var(--bg-panel);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .file-name {
    font-weight: var(--font-weight-bold);
    font-size: 14px;
  }
  
  .editor-actions {
    display: flex;
    gap: var(--space-1);
  }
  
  .editor-content {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .inline-hints {
    position: absolute;
    top: 0;
    right: 40px;
    width: 100px;
    height: 100%;
    pointer-events: none;
    z-index: 5;
  }
  
  .gas-badge, .opcode-badge {
    position: absolute;
    right: 0;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-family: var(--font-code);
    color: white;
    pointer-events: none;
  }
  
  .gas-badge {
    background-color: var(--accent);
    transform: translateY(-24px);
  }
  
  .opcode-badge {
    background-color: var(--warn);
    transform: translateY(-2px);
  }
  
  :global(.current-execution-line) {
    background-color: rgba(124, 58, 237, 0.1) !important;
    border-left: 2px solid var(--accent) !important;
  }
  
  :global(.execution-indicator) {
    background-color: var(--accent) !important;
    border-radius: 0 !important;
    width: 4px !important;
    margin-left: 2px !important;
  }
  
  :global(.breakpoint-indicator) {
    background-color: var(--warn) !important;
    border-radius: 50% !important;
    width: 8px !important;
    height: 8px !important;
    margin-top: 6px !important;
  }
</style>