<script lang="ts">
    import * as monaco from 'monaco-editor';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

    let { code = '', language = 'javascript', readOnly = false } = $props();
    
    let editorElement = $state<HTMLDivElement | null>(null);
    let editor = $state<monaco.editor.IStandaloneCodeEditor | null>(null);
    let codeValue = $state(code);
    
    // Watch for external code changes
    $effect(() => {
        codeValue = code;
        updateEditor();
    });
    
    // Watch for language changes
    $effect(() => {
        updateEditor();
    });

    // Setup Monaco environment
    function setupMonacoEnvironment() {
        // @ts-ignore - Monaco environment type is not properly defined
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

    // Update editor when code or language changes
    function updateEditor() {
        if (!editor) return;
        
        const model = editor.getModel();
        if (model) {
            monaco.editor.setModelLanguage(model, language);
            if (model.getValue() !== codeValue) {
                model.setValue(codeValue);
            }
        }
    }

    // Register Solidity language
    function registerSolidityLanguage() {
        monaco.languages.register({ id: 'sol' });
        monaco.languages.setMonarchTokensProvider('sol', {
            defaultToken: '',
            tokenPostfix: '.sol',

            keywords: [
                'contract', 'library', 'interface', 'function', 'constructor',
                'modifier', 'using', 'private', 'public', 'external', 'internal',
                'pure', 'view', 'payable', 'returns', 'memory', 'storage', 'calldata',
                'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return',
                'pragma', 'solidity', 'import', 'from', 'as', 'emit', 'event',
                'indexed', 'struct', 'mapping', 'address', 'uint', 'int', 'bool',
                'string', 'bytes', 'require', 'revert', 'assert', 'new'
            ],

            operators: [
                '=', '>', '<', '!', '~', '?', ':',
                '==', '<=', '>=', '!=', '&&', '||', '++', '--',
                '+', '-', '*', '/', '&', '|', '^', '%', '<<',
                '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
                '^=', '%=', '<<=', '>>=', '>>>='
            ],

            symbols: /[=><!~?:&|+\-*\/\^%]+/,
            escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

            tokenizer: {
                root: [
                    [/[a-z_$][\w$]*/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'identifier'
                        }
                    }],
                    [/[A-Z][\w\$]*/, 'type.identifier'],
                    { include: '@whitespace' },
                    [/[{}()\[\]]/, '@brackets'],
                    [/[<>](?!@symbols)/, '@brackets'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': ''
                        }
                    }],
                    [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation' }],
                    [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
                    [/0[xX][0-9a-fA-F]+/, 'number.hex'],
                    [/\d+/, 'number'],
                    [/[;,.]/, 'delimiter'],
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
                    [/'[^\\']'/, 'string'],
                    [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
                    [/'/, 'string.invalid']
                ],

                comment: [
                    [/[^\/*]+/, 'comment'],
                    [/\/\*/, 'comment', '@push'],
                    ["\\*/", 'comment', '@pop'],
                    [/[\/*]/, 'comment']
                ],

                string: [
                    [/[^\\"]+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
                ],

                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                ]
            }
        });
    }

    // Initialize Monaco environment and editor when the component mounts
    $effect(() => {
        if (!editorElement) return;
        
        // Setup Monaco environment
        setupMonacoEnvironment();
        monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
        registerSolidityLanguage();
        
        // Create editor
        editor = monaco.editor.create(editorElement, {
            value: codeValue,
            language: language,
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: true },
            readOnly: readOnly,
            fontSize: 14,
            lineNumbers: 'on',
            tabSize: 2,
            insertSpaces: true,
            scrollBeyondLastLine: false
        });
        
        // Listen for content changes
        editor.onDidChangeModelContent(() => {
            if (editor) {
                codeValue = editor.getValue();
            }
        });
        
        // Cleanup on unmount
        return () => {
            monaco.editor.getModels().forEach(model => model.dispose());
            editor?.dispose();
            editor = null;
        };
    });
</script>

<div class="editor-container" bind:this={editorElement}></div>

<style>
    .editor-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>