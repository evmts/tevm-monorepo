<script lang="ts">
    type FileType = 'js' | 'ts' | 'sol' | 'json' | 'html';

    interface FileItem {
        name: string;
        type: FileType;
        path: string;
        isFolder?: boolean;
        children?: FileItem[];
        expanded?: boolean;
    }

    let { files = [], activeFile = null } = $props<{
        files: FileItem[];
        activeFile: string | null;
    }>();
    
    // Using the Svelte event dispatcher
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher<{ fileClick: { path: string; type: FileType } }>();

    function toggleFolder(file: FileItem) {
        file.expanded = !file.expanded;
        // Create a new files array to ensure reactivity
        files = [...files];
    }

    function handleFileClick(file: FileItem) {
        if (file.isFolder) {
            toggleFolder(file);
        } else {
            activeFile = file.path;
            dispatch('fileClick', { path: file.path, type: file.type });
        }
    }

    function getFileIcon(type: FileType): string {
        switch (type) {
            case 'js':
                return '📄';
            case 'ts':
                return '📄';
            case 'sol':
                return '📄';
            case 'json':
                return '📄';
            case 'html':
                return '📄';
            default:
                return '📄';
        }
    }

    function getFolderIcon(expanded: boolean): string {
        return expanded ? '📂' : '📁';
    }
</script>

<div class="file-tree">
    {#each files as file}
        <div class="file-item">
            <div 
                class="file-label {activeFile === file.path ? 'active' : ''}" 
                on:click={() => handleFileClick(file)}
            >
                <span class="icon">
                    {file.isFolder ? getFolderIcon(file.expanded || false) : getFileIcon(file.type)}
                </span>
                <span class="name">{file.name}</span>
            </div>
            
            {#if file.isFolder && file.expanded && file.children}
                <div class="children">
                    {#each file.children as child}
                        <div 
                            class="file-item child-item {activeFile === child.path ? 'active' : ''}"
                            on:click|stopPropagation={() => handleFileClick(child)}
                        >
                            <span class="icon">
                                {child.isFolder ? getFolderIcon(child.expanded || false) : getFileIcon(child.type)}
                            </span>
                            <span class="name">{child.name}</span>
                        </div>
                        
                        {#if child.isFolder && child.expanded && child.children}
                            <div class="children">
                                {#each child.children as grandchild}
                                    <div 
                                        class="file-item grandchild-item {activeFile === grandchild.path ? 'active' : ''}"
                                        on:click|stopPropagation={() => handleFileClick(grandchild)}
                                    >
                                        <span class="icon">
                                            {grandchild.isFolder ? getFolderIcon(grandchild.expanded || false) : getFileIcon(grandchild.type)}
                                        </span>
                                        <span class="name">{grandchild.name}</span>
                                    </div>
                                {/each}
                            </div>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>
    {/each}
</div>

<style>
    .file-tree {
        background-color: #1e1e1e;
        color: #d4d4d4;
        height: 100%;
        overflow-y: auto;
        user-select: none;
        padding: 0.5rem;
    }

    .file-item {
        cursor: pointer;
        margin: 2px 0;
    }

    .file-label {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 4px;
    }

    .file-label:hover {
        background-color: #2a2d2e;
    }

    .file-label.active {
        background-color: #094771;
    }

    .icon {
        margin-right: 6px;
    }

    .name {
        font-size: 0.9rem;
    }

    .children {
        margin-left: 1.2rem;
    }

    .child-item, .grandchild-item {
        display: flex;
        align-items: center;
        padding: 4px;
        border-radius: 4px;
    }

    .child-item:hover, .grandchild-item:hover {
        background-color: #2a2d2e;
    }

    .child-item.active, .grandchild-item.active {
        background-color: #094771;
    }
</style>