<script>
  // Props
  export let onRunClick = () => {};
  export let onStepClick = () => {};
  export let onPauseClick = () => {};
  export let onStopClick = () => {};
  export let onCommandPaletteOpen = () => {};
  
  // Reactive state
  let isRunning = false;
  let isPaused = false;
  
  // Update state based on debugger
  export function setRunningState(running) {
    isRunning = running;
  }
  
  export function setPausedState(paused) {
    isPaused = paused;
  }
</script>

<header class="header-bar">
  <div class="logo">
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L2 10L16 18L30 10L16 2Z" fill="var(--accent)" />
      <path d="M2 22L16 30L30 22L30 10L16 18L2 10L2 22Z" fill="var(--accent)" fill-opacity="0.5" />
    </svg>
    <span class="logo-text">Tevm Tools</span>
  </div>
  
  <div class="controls">
    <button 
      class="control-button" 
      title="Run" 
      aria-label="Run debug session"
      on:click={onRunClick}
      disabled={isRunning && !isPaused}
    >
      <span class="icon">▶</span>
    </button>
    
    <button 
      class="control-button" 
      title="Step" 
      aria-label="Step through code"
      on:click={onStepClick}
      disabled={!isRunning || !isPaused}
    >
      <span class="icon">⇥</span>
    </button>
    
    <button 
      class="control-button" 
      title="Pause" 
      aria-label="Pause execution"
      on:click={onPauseClick}
      disabled={!isRunning || isPaused}
    >
      <span class="icon">⏸</span>
    </button>
    
    <button 
      class="control-button" 
      title="Stop" 
      aria-label="Stop debugging"
      on:click={onStopClick}
      disabled={!isRunning}
    >
      <span class="icon">■</span>
    </button>
  </div>
  
  <div class="actions">
    <button 
      class="icon-button action-button" 
      title="Search (Cmd+K)" 
      aria-label="Open command palette"
      on:click={onCommandPaletteOpen}
    >
      <span class="icon">🔍</span>
    </button>
    
    <button class="icon-button action-button" title="Toggle theme" aria-label="Toggle dark/light theme">
      <span class="icon">🌙</span>
    </button>
    
    <button class="icon-button action-button" title="Settings" aria-label="Open settings">
      <span class="icon">⚙️</span>
    </button>
  </div>
</header>

<style>
  .header-bar {
    height: var(--header-height);
    background-color: var(--bg-panel);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-2);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }
  
  .logo-text {
    font-weight: var(--font-weight-bold);
    font-size: 18px;
    color: var(--text-primary);
  }
  
  .controls {
    display: flex;
    gap: var(--space-1);
  }
  
  .control-button, .action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-primary);
    border: none;
    border-radius: 4px;
    width: 32px;
    height: 32px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.2s;
  }
  
  .control-button:hover, .action-button:hover {
    background-color: var(--highlight-line);
  }
  
  .control-button:active, .action-button:active {
    transform: scale(0.95);
  }
  
  .control-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .actions {
    display: flex;
    gap: var(--space-1);
  }
  
  .icon {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  @media (max-width: 600px) {
    .logo-text {
      display: none;
    }
    
    .control-button, .action-button {
      width: 28px;
      height: 28px;
      font-size: 14px;
    }
  }
</style>