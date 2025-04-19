<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { browser } from '$app/environment';

  export let language = 'javascript';
  export let value = '';
  export let height = '400px';

  const dispatch = createEventDispatcher();
  let editor;
  let container;
  let monaco;
  let editorLoaded = false;

  onMount(async () => {
    if (!browser) return;

    try {
      // Load Monaco directly from CDN to avoid build issues
      await loadMonaco();
      await setupEditor();
    } catch (error) {
      console.error('Failed to initialize Monaco editor:', error);
    }

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  });

  async function loadMonaco() {
    if (window.monaco) {
      monaco = window.monaco;
      return;
    }

    // Use a script tag to load Monaco from CDN
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
      script.onload = () => {
        window.require.config({
          paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }
        });
        
        window.require(['vs/editor/editor.main'], () => {
          monaco = window.monaco;
          setupSolidityLanguage();
          resolve();
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function setupSolidityLanguage() {
    if (!monaco) return;
    
    if (!monaco.languages.getLanguages().some(lang => lang.id === 'solidity')) {
      monaco.languages.register({ id: 'solidity' });
      
      monaco.languages.setMonarchTokensProvider('solidity', {
        tokenizer: {
          root: [
            [/pragma\s+solidity/, 'keyword'],
            [/\b(contract|interface|library|function|modifier|event|struct|enum|mapping|address|bool|string|uint|int|bytes|public|private|external|internal|view|pure|payable|memory|storage|calldata|returns|return|import|using|for|while|if|else|do|continue|break|delete|new|try|catch|emit|revert|throw|assembly|type|constructor|fallback|receive)\b/, 'keyword'],
            [/\b(true|false|null|this)\b/, 'keyword'],
            [/\/\/.*/, 'comment'],
            [/\/\*/, 'comment', '@comment'],
            [/[a-zA-Z_]\w*/, 'identifier'],
            [/".*?"/, 'string'],
            [/[0-9]+/, 'number'],
            [/[=><!+\-*\/&|^%]+/, 'operator'],
          ],
          comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment']
          ]
        }
      });
    }
  }

  async function setupEditor() {
    if (!container || !monaco) return;

    editor = monaco.editor.create(container, {
      value,
      language,
      theme: 'vs-dark',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      renderLineHighlight: 'all',
      automaticLayout: true,
      readOnly: false
    });

    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      dispatch('change', { value: newValue });
    });

    editorLoaded = true;
    dispatch('ready', { editor, monaco });
  }

  // Update the editor value if the prop changes
  $: if (editor && value !== editor.getValue()) {
    editor.setValue(value);
  }

  export function highlightLine(lineNumber) {
    if (!editor || !monaco) return;
    
    const decorations = editor.deltaDecorations([], [
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
          glyphMarginClassName: 'line-decoration'
        }
      }
    ]);
    
    editor.revealLineInCenter(lineNumber);
    return decorations;
  }
</script>

<div class="monaco-editor-container" bind:this={container} style="height: {height};"></div>

<style>
  .monaco-editor-container {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
  }

  :global(.highlighted-line) {
    background-color: rgba(173, 214, 255, 0.3);
    border-left: 3px solid #007acc;
  }
  
  :global(.line-decoration) {
    margin-left: 5px;
    width: 8px !important;
    background-color: #007acc;
    border-radius: 50%;
  }
</style>