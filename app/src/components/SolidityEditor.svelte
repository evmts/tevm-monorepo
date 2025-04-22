<script lang="ts">
import { browser } from '$app/environment'
import { createEventDispatcher, onMount } from 'svelte'
import MonacoEditor from './MonacoEditor.svelte'

export let code = ''
export const currentLine = -1

const dispatch = createEventDispatcher()

let editor
let editorContainer
let decorations = []

function handleEditorReady(event) {
	editor = event.detail.editor

	// Set initial highlight if needed
	if (currentLine >= 0) {
		highlightLine(currentLine)
	}

	dispatch('ready', event.detail)
}

function handleEditorChange(event) {
	code = event.detail.value
	dispatch('change', { code: event.detail.value })
}

function handleTextareaInput(event) {
	code = event.target.value
	dispatch('change', { code })
}

function highlightLine(line) {
	if (!editor) return

	// Clear previous decorations if any
	if (decorations.length) {
		editor.deltaDecorations(decorations, [])
	}

	// Set new decoration
	if (line >= 0) {
		try {
			decorations = editor.highlightLine(line + 1) // Monaco is 1-based
		} catch (err) {
			console.error('Failed to highlight line:', err)
		}
	}
}

// Watch for changes to currentLine prop
$: if (editor && currentLine !== undefined) {
	highlightLine(currentLine)
}
</script>

<div class="editor-container" bind:this={editorContainer}>
  {#if browser}
    <MonacoEditor 
      language="solidity"
      value={code}
      height="60vh"
      on:ready={handleEditorReady}
      on:change={handleEditorChange}
    />
  {:else}
    <!-- Fallback for SSR -->
    <div class="fallback-editor">
      <textarea
        value={code}
        on:input={handleTextareaInput}
        spellcheck="false"
      ></textarea>
      <div class="loading-message">
        Editor is loading...
      </div>
    </div>
  {/if}
</div>

<style>
  .editor-container {
    width: 100%;
    height: 60vh;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }
  
  .fallback-editor {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: #1e1e1e;
    color: #d4d4d4;
  }
  
  .fallback-editor textarea {
    flex: 1;
    width: 100%;
    height: calc(100% - 30px);
    background-color: #1e1e1e;
    color: #d4d4d4;
    border: none;
    padding: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    outline: none;
  }
  
  .loading-message {
    height: 30px;
    background-color: #007acc;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
</style>