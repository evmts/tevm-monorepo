<script>
  import { onMount } from 'svelte';
  
  // Props
  export let width = 250; // Default width
  export let minWidth = 180;
  export let maxWidth = 400;
  export let onWidthChange = (width) => {}; // Callback for width changes
  
  // State
  let activeView = 'files'; // 'files' or 'outline'
  let isResizing = false;
  let sidebarElement;
  
  // Mock data for file tree
  const fileTree = [
    { id: 'contracts', name: 'contracts', type: 'folder', expanded: true, children: [
      { id: 'contracts/Token.sol', name: 'Token.sol', type: 'file', active: true },
      { id: 'contracts/Vault.sol', name: 'Vault.sol', type: 'file' },
    ]},
    { id: 'scripts', name: 'scripts', type: 'folder', expanded: false, children: [
      { id: 'scripts/deploy.ts', name: 'deploy.ts', type: 'file' },
    ]},
    { id: 'test', name: 'test', type: 'folder', expanded: false, children: [
      { id: 'test/Token.test.ts', name: 'Token.test.ts', type: 'file' },
    ]},
    { id: 'README.md', name: 'README.md', type: 'file' },
  ];
  
  // Mock data for contract outline
  const outline = [
    { id: 'contract-Token', name: 'Token', type: 'contract', line: 5 },
    { id: 'state-balances', name: 'balances', type: 'state', line: 6 },
    { id: 'state-totalSupply', name: 'totalSupply', type: 'state', line: 7 },
    { id: 'event-Transfer', name: 'Transfer', type: 'event', line: 9 },
    { id: 'function-balanceOf', name: 'balanceOf', type: 'function', line: 11 },
    { id: 'function-transfer', name: 'transfer', type: 'function', line: 15 },
    { id: 'function-_transfer', name: 'transfer (internal)', type: 'function', line: 22 },
  ];
  
  // Event handlers
  function switchView(view) {
    activeView = view;
  }
  
  function startResize(event) {
    isResizing = true;
    
    const startX = event.clientX;
    const startWidth = width;
    
    function handleMouseMove(e) {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
      width = newWidth;
      onWidthChange(newWidth);
    }
    
    function handleMouseUp() {
      isResizing = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
  
  function toggleFolder(folder) {
    folder.expanded = !folder.expanded;
  }
  
  function selectFile(file) {
    // Reset all active states
    function resetActive(items) {
      items.forEach(item => {
        item.active = false;
        if (item.children) resetActive(item.children);
      });
    }
    
    resetActive(fileTree);
    file.active = true;
  }
  
  function jumpToLine(item) {
    console.log(`Jump to line ${item.line}: ${item.name}`);
    // Implement line navigation logic
  }
  
  // Lifecycle
  onMount(() => {
    // Any initialization if needed
  });
</script>

<aside 
  class="sidebar {isResizing ? 'resizing' : ''}" 
  style="width: {width}px;" 
  bind:this={sidebarElement}
>
  <div class="tabs">
    <button 
      class="tab-button {activeView === 'files' ? 'active' : ''}" 
      on:click={() => switchView('files')}
      title="Files"
      aria-label="Switch to file explorer"
    >
      <span class="icon">📁</span>
    </button>
    <button 
      class="tab-button {activeView === 'outline' ? 'active' : ''}" 
      on:click={() => switchView('outline')}
      title="Outline"
      aria-label="Switch to code outline"
    >
      <span class="icon">📋</span>
    </button>
  </div>
  
  <div class="sidebar-content">
    {#if activeView === 'files'}
      <div class="file-explorer">
        <div class="heading">
          <h3>Explorer</h3>
        </div>
        <div class="tree-view">
          {#each fileTree as item}
            {#if item.type === 'folder'}
              <div class="folder">
                <div 
                  class="folder-header"
                  on:click={() => toggleFolder(item)}
                >
                  <span class="icon">{item.expanded ? '📂' : '📁'}</span>
                  <span class="folder-name">{item.name}</span>
                </div>
                
                {#if item.expanded && item.children}
                  <div class="folder-children">
                    {#each item.children as child}
                      {#if child.type === 'file'}
                        <div 
                          class="file {child.active ? 'active' : ''}"
                          on:click={() => selectFile(child)}
                        >
                          <span class="icon">📄</span>
                          <span class="file-name">{child.name}</span>
                        </div>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {:else if item.type === 'file'}
              <div 
                class="file {item.active ? 'active' : ''}"
                on:click={() => selectFile(item)}  
              >
                <span class="icon">📄</span>
                <span class="file-name">{item.name}</span>
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {:else if activeView === 'outline'}
      <div class="outline-view">
        <div class="heading">
          <h3>Outline</h3>
        </div>
        <div class="outline-list">
          {#each outline as item}
            <div 
              class="outline-item" 
              on:click={() => jumpToLine(item)}
            >
              <span class="icon">
                {#if item.type === 'contract'}
                  📘
                {:else if item.type === 'function'}
                  🔧
                {:else if item.type === 'event'}
                  🔔
                {:else if item.type === 'state'}
                  💾
                {:else}
                  📄
                {/if}
              </span>
              <span class="outline-name">{item.name}</span>
              <span class="outline-line">{item.line}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <div 
    class="resize-handle"
    on:mousedown={startResize}
    aria-label="Resize sidebar"
    role="separator"
    aria-orientation="vertical"
  ></div>
</aside>

<style>
  .sidebar {
    position: fixed;
    left: 0;
    top: var(--header-height);
    height: calc(100vh - var(--header-height));
    background-color: var(--bg-panel);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 10;
  }
  
  .sidebar.resizing {
    user-select: none;
    pointer-events: none;
  }
  
  .tabs {
    display: flex;
    padding: var(--space-1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .tab-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .tab-button.active {
    color: var(--text-primary);
    background-color: var(--highlight-line);
  }
  
  .tab-button:hover {
    background-color: var(--highlight-line);
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .heading {
    padding: var(--space-1);
    margin-bottom: var(--space-1);
  }
  
  .heading h3 {
    font-size: 14px;
    font-weight: var(--font-weight-bold);
    margin: 0;
    color: var(--text-secondary);
  }
  
  .tree-view {
    display: flex;
    flex-direction: column;
  }
  
  .folder, .file {
    display: flex;
    flex-direction: column;
  }
  
  .folder-header, .file {
    display: flex;
    align-items: center;
    padding: 4px var(--space-1);
    cursor: pointer;
    border-radius: 4px;
    margin: 1px var(--space-1);
    transition: background-color 0.2s;
  }
  
  .folder-header:hover, .file:hover {
    background-color: var(--highlight-line);
  }
  
  .file.active {
    background-color: var(--highlight-line);
    color: var(--accent);
  }
  
  .folder-children {
    margin-left: var(--space-3);
  }
  
  .icon {
    margin-right: var(--space-1);
    display: flex;
    align-items: center;
  }
  
  .folder-name, .file-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .outline-list {
    display: flex;
    flex-direction: column;
  }
  
  .outline-item {
    display: flex;
    align-items: center;
    padding: 4px var(--space-1);
    cursor: pointer;
    border-radius: 4px;
    margin: 1px var(--space-1);
    transition: background-color 0.2s;
  }
  
  .outline-item:hover {
    background-color: var(--highlight-line);
  }
  
  .outline-name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .outline-line {
    color: var(--text-secondary);
    font-size: 12px;
    margin-left: var(--space-1);
  }
  
  .resize-handle {
    position: absolute;
    top: 0;
    right: -3px;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 10;
  }
  
  .resize-handle:hover {
    background-color: rgba(124, 58, 237, 0.3);
  }
  
  @media (max-width: 600px) {
    .sidebar {
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }
    
    .sidebar.open {
      transform: translateX(0);
    }
  }
</style>