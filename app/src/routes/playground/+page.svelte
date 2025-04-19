<script lang="ts">
    import FileTree from '../../components/playground/FileTree.svelte';
    import CodeEditor from '../../components/playground/CodeEditor.svelte';
    
    import { code as jsCode } from '$lib/code/js_code';
    import { code as tsCode } from '$lib/code/ts_code';
    import { code as solidityCode } from '$lib/code/solidity_code';
    import { code as jsonCode } from '$lib/code/json_code';
    import { code as htmlCode } from '$lib/code/html_code';

    type FileType = 'js' | 'ts' | 'sol' | 'json' | 'html';

    interface FileItem {
        name: string;
        type: FileType;
        path: string;
        isFolder?: boolean;
        children?: FileItem[];
        expanded?: boolean;
    }

    let files = $state<FileItem[]>([
        {
            name: 'tevm-project',
            type: 'ts',
            path: 'tevm-project',
            isFolder: true,
            expanded: true,
            children: [
                {
                    name: 'src',
                    type: 'ts',
                    path: 'tevm-project/src',
                    isFolder: true,
                    expanded: true,
                    children: [
                        {
                            name: 'main.ts',
                            type: 'ts',
                            path: 'tevm-project/src/main.ts'
                        },
                        {
                            name: 'example.js',
                            type: 'js',
                            path: 'tevm-project/src/example.js'
                        },
                        {
                            name: 'Counter.sol',
                            type: 'sol',
                            path: 'tevm-project/src/Counter.sol'
                        }
                    ]
                },
                {
                    name: 'config',
                    type: 'json',
                    path: 'tevm-project/config',
                    isFolder: true,
                    expanded: false,
                    children: [
                        {
                            name: 'tevm.config.json',
                            type: 'json',
                            path: 'tevm-project/config/tevm.config.json'
                        }
                    ]
                },
                {
                    name: 'public',
                    type: 'html',
                    path: 'tevm-project/public',
                    isFolder: true,
                    expanded: false,
                    children: [
                        {
                            name: 'index.html',
                            type: 'html',
                            path: 'tevm-project/public/index.html'
                        }
                    ]
                }
            ]
        }
    ]);

    let activeFile = $state<string | null>('tevm-project/src/main.ts');
    let editorCode = $state<string>(tsCode);
    let editorLanguage = $state<string>('typescript');

    function handleFileClick(event: { path: string; type: string }) {
        const { path, type } = event;
        activeFile = path;

        // Set the appropriate code based on the file path
        if (path.endsWith('main.ts')) {
            editorCode = tsCode;
            editorLanguage = 'typescript';
        } else if (path.endsWith('example.js')) {
            editorCode = jsCode;
            editorLanguage = 'javascript';
        } else if (path.endsWith('Counter.sol')) {
            editorCode = solidityCode;
            editorLanguage = 'sol';
        } else if (path.endsWith('tevm.config.json')) {
            editorCode = jsonCode;
            editorLanguage = 'json';
        } else if (path.endsWith('index.html')) {
            editorCode = htmlCode;
            editorLanguage = 'html';
        }
    }

    // Initialization effect
    $effect(() => {
        // This runs once when the component is mounted
        if (activeFile === 'tevm-project/src/main.ts') {
            editorCode = tsCode;
            editorLanguage = 'typescript';
        }
    });
</script>

<div class="playground-container">
    <div class="file-explorer">
        <div class="file-explorer-header">
            <span>EXPLORER</span>
        </div>
        <FileTree 
            files={files} 
            activeFile={activeFile} 
            fileClick={handleFileClick}
        />
    </div>
    
    <div class="editor-pane">
        <div class="editor-tabs">
            {#if activeFile}
                <div class="tab active">
                    {activeFile.split('/').pop()}
                </div>
            {/if}
        </div>
        
        <div class="editor-content">
            <CodeEditor code={editorCode} language={editorLanguage} />
        </div>
    </div>
</div>

<style>
    .playground-container {
        display: flex;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: #1e1e1e;
        color: #d4d4d4;
    }

    .file-explorer {
        width: 250px;
        height: 100%;
        border-right: 1px solid #444;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .file-explorer-header {
        padding: 8px 12px;
        font-size: 0.85rem;
        font-weight: bold;
        color: #acacac;
        background-color: #252526;
        border-bottom: 1px solid #444;
        user-select: none;
    }

    .editor-pane {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .editor-tabs {
        height: 32px;
        background-color: #252526;
        display: flex;
        overflow-x: auto;
        border-bottom: 1px solid #444;
    }

    .tab {
        padding: 8px 16px;
        font-size: 0.85rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        border-right: 1px solid #444;
        user-select: none;
    }

    .tab.active {
        background-color: #1e1e1e;
        border-top: 1px solid #1f9cf0;
    }

    .editor-content {
        flex: 1;
        overflow: hidden;
    }
</style>