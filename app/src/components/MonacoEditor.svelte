<script>
import { browser } from '$app/environment'
import { createEventDispatcher, onDestroy, onMount } from 'svelte'

// Props
export const language = 'javascript'
export const value = ''
export const height = '400px'
export const theme = 'vs-dark'
export const readOnly = false
export const automaticLayout = true

// Internal state
const dispatch = createEventDispatcher()
let container
let editor
let monaco
let editorLoaded = false

// Setup editor when component mounts
onMount(async () => {
	if (!browser) return

	try {
		// Load Monaco from CDN
		await loadMonaco()
		await setupEditor()

		// Add click event handler for glyph margin
		if (editor) {
			editor.onMouseDown((event) => {
				if (event.target.type === 2) {
					// Glyph margin click
					dispatch('lineClick', {
						lineNumber: event.target.position.lineNumber,
						column: event.target.position.column,
					})
				}
			})
		}
	} catch (error) {
		console.error('Failed to initialize Monaco editor:', error)
	}

	return () => {
		if (editor) {
			editor.dispose()
		}
	}
})

// Load Monaco editor from CDN
async function loadMonaco() {
	if (window.monaco) {
		monaco = window.monaco
		return
	}

	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js'
		script.onload = () => {
			window.require.config({
				paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' },
			})

			window.require(['vs/editor/editor.main'], () => {
				monaco = window.monaco
				setupSolidityLanguage()
				resolve()
			})
		}
		script.onerror = reject
		document.head.appendChild(script)
	})
}

// Setup Solidity language support
function setupSolidityLanguage() {
	if (!monaco) return

	if (!monaco.languages.getLanguages().some((lang) => lang.id === 'solidity')) {
		monaco.languages.register({ id: 'solidity' })

		monaco.languages.setMonarchTokensProvider('solidity', {
			tokenizer: {
				root: [
					[/pragma\s+solidity/, 'keyword'],
					[
						/\b(contract|interface|library|function|modifier|event|struct|enum|mapping|address|bool|string|uint|int|bytes|public|private|external|internal|view|pure|payable|memory|storage|calldata|returns|return|import|using|for|while|if|else|do|continue|break|delete|new|try|catch|emit|revert|throw|assembly|type|constructor|fallback|receive)\b/,
						'keyword',
					],
					[/\b(true|false|null|this)\b/, 'keyword'],
					[/\/\/.*/, 'comment'],
					[/\/\*/, 'comment', '@comment'],
					[/[a-zA-Z_]\w*/, 'identifier'],
					[/".*?"/, 'string'],
					[/'.*?'/, 'string'],
					[/[0-9]+/, 'number'],
					[/[=><!+\-*\/&|^%]+/, 'operator'],
				],
				comment: [
					[/[^/*]+/, 'comment'],
					[/\*\//, 'comment', '@pop'],
					[/[/*]/, 'comment'],
				],
			},
		})

		// Define a custom theme with our color variables
		monaco.editor.defineTheme('tevm-dark', {
			base: 'vs-dark',
			inherit: true,
			rules: [
				{ token: 'keyword', foreground: '7C3AED' },
				{ token: 'comment', foreground: 'A0A0B0' },
				{ token: 'string', foreground: '14B8A6' },
				{ token: 'number', foreground: 'F59E0B' },
				{ token: 'operator', foreground: 'E0E0E8' },
			],
			colors: {
				'editor.background': '#1E1E2E',
				'editor.foreground': '#E0E0E8',
				'editor.lineHighlightBackground': '#3A3A52',
				'editorCursor.foreground': '#E0E0E8',
				'editor.selectionBackground': '#3A3A5280',
				'editor.selectionHighlightBackground': '#3A3A5240',
				'editorGutter.background': '#2A2A3F',
				'editorLineNumber.foreground': '#A0A0B0',
				'editorLineNumber.activeForeground': '#E0E0E8',
				'editorGutter.modifiedBackground': '#916BEA',
				'editorGutter.addedBackground': '#14B8A6',
				'editorGutter.deletedBackground': '#F87171',
				'editorIndentGuide.background': '#3A3A52',
				'editorIndentGuide.activeBackground': '#A0A0B0',
			},
		})
	}
}

// Initialize editor
async function setupEditor() {
	if (!container || !monaco) return

	editor = monaco.editor.create(container, {
		value,
		language,
		theme: 'tevm-dark',
		minimap: { enabled: true },
		scrollBeyondLastLine: false,
		fontFamily: 'var(--font-code)',
		fontSize: 14,
		lineNumbers: 'on',
		glyphMargin: true,
		folding: true,
		renderLineHighlight: 'all',
		automaticLayout,
		readOnly,
		cursorBlinking: 'smooth',
		cursorSmoothCaretAnimation: true,
		cursorStyle: 'line',
		bracketPairColorization: {
			enabled: true,
		},
		guides: {
			indentation: true,
			bracketPairs: true,
		},
		renderWhitespace: 'selection',
		formatOnPaste: true,
		formatOnType: true,
		suggest: {
			showWords: true,
			snippetsPreventQuickSuggestions: false,
		},
	})

	// Listen for content changes
	editor.onDidChangeModelContent(() => {
		const newValue = editor.getValue()
		if (value !== newValue) {
			dispatch('change', { value: newValue })
		}
	})

	// Notify that the editor is ready
	editorLoaded = true
	dispatch('ready', { editor, monaco })
}

// Update editor content when the value prop changes
$: if (editor && value !== editor.getValue()) {
	editor.setValue(value)
}

// Update read-only state if it changes
$: if (editor && editor.getOption(monaco?.editor.EditorOption.readOnly) !== readOnly) {
	editor.updateOptions({ readOnly })
}

// Public methods
export function highlightLine(lineNumber) {
	if (!editor || !monaco) return []

	const decorations = editor.deltaDecorations(
		[],
		[
			{
				range: new monaco.Range(lineNumber, 1, lineNumber, 1),
				options: {
					isWholeLine: true,
					className: 'highlighted-line',
					glyphMarginClassName: 'line-decoration',
				},
			},
		],
	)

	editor.revealLineInCenter(lineNumber)
	return decorations
}

export function addDecoration(range, options) {
	if (!editor || !monaco) return []
	return editor.deltaDecorations(
		[],
		[
			{
				range: range,
				options: options,
			},
		],
	)
}

export function removeDecorations(decorationIds) {
	if (!editor) return
	editor.deltaDecorations(decorationIds, [])
}

export function focus() {
	if (editor) {
		editor.focus()
	}
}

// Cleanup
onDestroy(() => {
	if (editor) {
		editor.dispose()
	}
})
</script>

<div class="monaco-editor-wrapper">
  <div class="monaco-editor-container" bind:this={container} style="height: {height};"></div>
  {#if !editorLoaded && browser}
    <div class="editor-loading">
      <div class="spinner"></div>
      <span>Loading editor...</span>
    </div>
  {/if}
</div>

<style>
  .monaco-editor-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .monaco-editor-container {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .editor-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-main);
    color: var(--text-secondary);
    font-size: 14px;
    z-index: 10;
  }
  
  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(124, 58, 237, 0.3);
    border-radius: 50%;
    border-top-color: var(--accent);
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-2);
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  :global(.highlighted-line) {
    background-color: rgba(124, 58, 237, 0.1) !important;
    border-left: 2px solid var(--accent) !important;
  }
  
  :global(.line-decoration) {
    margin-left: 5px;
    width: 8px !important;
    background-color: var(--accent);
    border-radius: 50%;
  }
</style>