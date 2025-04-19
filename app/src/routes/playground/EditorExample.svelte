<script lang="ts">
    import * as monaco from 'monaco-editor';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

    import { code as jsCode } from '$lib/code/js_code';
    import { code as tsCode } from '$lib/code/ts_code';
    import { code as solidityCode } from '$lib/code/solidity_code';
    import { code as jsonCode } from '$lib/code/json_code';
    import { code as htmlCode } from '$lib/code/html_code';

    let editorElement = $state<HTMLDivElement | null>(null);
    let editor = $state<monaco.editor.IStandaloneCodeEditor | null>(null);
    let model = $state<monaco.editor.ITextModel | null>(null);
    let currentLanguage = $state('javascript');

    function loadCode(code: string, language: string) {
        if (!editor) return;
        
        // Dispose previous model if it exists
        model?.dispose();
        
        // Create new model
        model = monaco.editor.createModel(code, language);
        editor.setModel(model);
        currentLanguage = language;
    }

    function setupMonacoEnvironment() {
        self.MonacoEnvironment = {
            getWorker: function (_: any, label: string) {
                if (label === 'json') {
                    return new jsonWorker();
                }
                if (label === 'css' || label === 'scss' || label === 'less') {
                    return new cssWorker();
                }
                if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    return new htmlWorker();
                }
                if (label === 'typescript' || label === 'javascript') {
                    return new tsWorker();
                }
                return new editorWorker();
            }
        };
    }

    // Initialize editor when element is available
    $effect(() => {
        if (!editorElement) return;
        
        // Setup environment
        setupMonacoEnvironment();
        monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
        
        // Create editor
        editor = monaco.editor.create(editorElement, {
            automaticLayout: true,
            theme: 'vs-dark',
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            language: currentLanguage
        });
        
        // Load initial code
        loadCode(jsCode, 'javascript');
        
        // Cleanup on unmount
        return () => {
            monaco.editor.getModels().forEach(model => model.dispose());
            editor?.dispose();
            editor = null;
        };
    });
</script>

<div class="flex h-screen w-full flex-col">
    <div class="flex gap-x-1 p-1">
        <button class="w-fit border-2 p-1" onclick={() => loadCode(jsCode, 'javascript')}
            >JavaScript</button
        >
        <button class="w-fit border-2 p-1" onclick={() => loadCode(tsCode, 'typescript')}
            >TypeScript</button
        >
        <button class="w-fit border-2 p-1" onclick={() => loadCode(solidityCode, 'sol')}>Solidity</button>
        <button class="w-fit border-2 p-1" onclick={() => loadCode(jsonCode, 'json')}>JSON</button>
        <button class="w-fit border-2 p-1" onclick={() => loadCode(htmlCode, 'html')}>HTML</button>
    </div>
    <div class="flex-grow" bind:this={editorElement} />
</div>