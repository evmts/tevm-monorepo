<script>
  import { onMount, afterUpdate } from 'svelte';
  
  // Props
  export let logs = [];
  
  // Internal state
  let activeTab = 'all';
  let consolePaneElement;
  let consoleContentElement;
  let autoScroll = true;
  let userScrolled = false;
  
  // Filter logs based on active tab
  $: filteredLogs = filterLogs(logs, activeTab);
  
  function filterLogs(logs, tab) {
    if (tab === 'all') return logs;
    return logs.filter(log => log.level === tab);
  }
  
  // Set the active tab
  function setActiveTab(tab) {
    activeTab = tab;
  }
  
  // Clear all logs
  function clearLogs() {
    logs = [];
  }
  
  // Handle manual scrolling
  function handleScroll() {
    if (!consoleContentElement) return;
    
    const { scrollTop, scrollHeight, clientHeight } = consoleContentElement;
    const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    
    userScrolled = !atBottom;
    autoScroll = atBottom;
  }
  
  // Scroll to the bottom of the console when new logs are added
  afterUpdate(() => {
    if (autoScroll && consoleContentElement) {
      consoleContentElement.scrollTop = consoleContentElement.scrollHeight;
    }
  });
  
  // Format a timestamp (for display)
  function formatTime(timestamp) {
    if (!timestamp) return '';
    
    if (typeof timestamp === 'string') {
      return timestamp;
    }
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  
  // Icon for log level
  function getLevelIcon(level) {
    switch (level) {
      case 'info': return 'ℹ️';
      case 'warn': return '⚠️';
      case 'error': return '❌';
      case 'debug': return '🔍';
      case 'event': return '🔔';
      default: return '📝';
    }
  }
  
  // Lifecycle hooks
  onMount(() => {
    // Initialize auto-scroll
  });
</script>

<div class="console-pane" bind:this={consolePaneElement}>
  <div class="console-header">
    <div class="tabs">
      <button 
        class="tab-button {activeTab === 'all' ? 'active' : ''}" 
        on:click={() => setActiveTab('all')}
        aria-pressed={activeTab === 'all'}
      >
        All
      </button>
      <button 
        class="tab-button {activeTab === 'info' ? 'active' : ''}" 
        on:click={() => setActiveTab('info')}
        aria-pressed={activeTab === 'info'}
      >
        Info
      </button>
      <button 
        class="tab-button {activeTab === 'debug' ? 'active' : ''}" 
        on:click={() => setActiveTab('debug')}
        aria-pressed={activeTab === 'debug'}
      >
        Debug
      </button>
      <button 
        class="tab-button {activeTab === 'warn' ? 'active' : ''}" 
        on:click={() => setActiveTab('warn')}
        aria-pressed={activeTab === 'warn'}
      >
        Warn
      </button>
      <button 
        class="tab-button {activeTab === 'error' ? 'active' : ''}" 
        on:click={() => setActiveTab('error')}
        aria-pressed={activeTab === 'error'}
      >
        Error
      </button>
      <button 
        class="tab-button {activeTab === 'event' ? 'active' : ''}" 
        on:click={() => setActiveTab('event')}
        aria-pressed={activeTab === 'event'}
      >
        Events
      </button>
    </div>
    
    <div class="console-actions">
      <button 
        class="icon-button" 
        title="Clear console" 
        aria-label="Clear console logs"
        on:click={clearLogs}
      >
        <span class="icon">🗑️</span>
      </button>
      
      <button 
        class="icon-button" 
        title={autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"}
        aria-label={autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"}
        on:click={() => autoScroll = !autoScroll}
        class:active={autoScroll}
      >
        <span class="icon">{autoScroll ? '📜' : '🔒'}</span>
      </button>
    </div>
  </div>
  
  <div 
    class="console-content" 
    bind:this={consoleContentElement}
    on:scroll={handleScroll}
  >
    {#if filteredLogs.length === 0}
      <div class="empty-state">
        <p>No {activeTab === 'all' ? '' : activeTab} logs to display</p>
      </div>
    {:else}
      {#each filteredLogs as log, index (index)}
        <div class="log-entry log-{log.level} animate-slide-up">
          <span class="log-icon">{getLevelIcon(log.level)}</span>
          <span class="log-timestamp">{formatTime(log.timestamp)}</span>
          <span class="log-level">{log.level}</span>
          <span class="log-message">{log.message}</span>
        </div>
      {/each}
    {/if}
  </div>
  
  <div class="timeline-scrubber">
    <div class="timeline-track">
      <div class="timeline-marker" style="left: 50%;"></div>
    </div>
  </div>
</div>

<style>
  .console-pane {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-panel);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  
  .console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .tabs {
    display: flex;
    gap: 2px;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
  }
  
  .tabs::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
  
  .tab-button {
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    white-space: nowrap;
  }
  
  .tab-button.active {
    color: var(--text-primary);
    background-color: var(--highlight-line);
  }
  
  .tab-button:hover {
    background-color: var(--highlight-line);
  }
  
  .console-actions {
    display: flex;
    gap: var(--space-1);
  }
  
  .icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-secondary);
    border: none;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .icon-button:hover {
    background-color: var(--highlight-line);
    color: var(--text-primary);
  }
  
  .icon-button.active {
    color: var(--accent);
  }
  
  .console-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-1);
    font-family: var(--font-code);
    font-size: 12px;
    line-height: 1.4;
  }
  
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--text-secondary);
    font-style: italic;
  }
  
  .log-entry {
    display: flex;
    align-items: flex-start;
    padding: 3px var(--space-1);
    margin-bottom: 2px;
    border-radius: 3px;
  }
  
  .log-entry:hover {
    background-color: var(--highlight-line);
  }
  
  .log-icon {
    margin-right: 4px;
    font-size: 14px;
  }
  
  .log-timestamp {
    color: var(--text-secondary);
    margin-right: var(--space-1);
    font-size: 11px;
    flex-shrink: 0;
    min-width: 70px;
  }
  
  .log-level {
    text-transform: uppercase;
    font-size: 10px;
    padding: 0px 4px;
    border-radius: 2px;
    margin-right: var(--space-1);
    flex-shrink: 0;
    min-width: 40px;
    text-align: center;
  }
  
  .log-info .log-level {
    background-color: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }
  
  .log-debug .log-level {
    background-color: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
  }
  
  .log-warn .log-level {
    background-color: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  }
  
  .log-error .log-level {
    background-color: rgba(239, 68, 68, 0.2);
    color: #f87171;
  }
  
  .log-event .log-level {
    background-color: rgba(139, 92, 246, 0.2);
    color: #a78bfa;
  }
  
  .log-message {
    flex: 1;
    word-break: break-word;
    white-space: pre-wrap;
  }
  
  .timeline-scrubber {
    height: 24px;
    display: flex;
    align-items: center;
    padding: 0 var(--space-1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .timeline-track {
    width: 100%;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    position: relative;
    cursor: pointer;
  }
  
  .timeline-marker {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--accent);
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: grab;
  }
</style>