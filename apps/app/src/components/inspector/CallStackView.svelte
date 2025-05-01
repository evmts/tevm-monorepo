<script>
// Props
export const stack = []

// Event handlers
function jumpToSource(frame) {
	// Jump to the source code for this frame
	console.log(`Jump to ${frame.sourceFile}:${frame.line}`)
	// In a real implementation, this would communicate with the EditorPane
}
</script>

<div class="callstack-view">
  {#if stack.length === 0}
    <div class="empty-state">
      <p>Call stack is empty</p>
    </div>
  {:else}
    <div class="stack-frames">
      {#each stack as frame, index}
        <div 
          class="stack-frame {index === 0 ? 'active-frame' : ''}" 
          on:click={() => jumpToSource(frame)}
          role="button"
          tabindex="0"
          aria-label="Jump to {frame.name} at line {frame.line}"
        >
          <div class="frame-header">
            <span class="frame-index">{stack.length - index}</span>
            <span class="frame-name">{frame.name}</span>
            <span class="frame-location">
              {frame.sourceFile}:{frame.line}
            </span>
          </div>
          
          <div class="frame-details">
            <div class="frame-detail">
              <span class="detail-label">Gas:</span>
              <span class="detail-value">{frame.gas}</span>
            </div>
            
            <div class="frame-detail">
              <span class="detail-label">Address:</span>
              <span class="detail-value">{frame.address}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .callstack-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: var(--space-1);
  }
  
  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: var(--text-secondary);
    font-style: italic;
    font-size: 12px;
  }
  
  .stack-frames {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .stack-frame {
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.2s, border-color 0.2s;
  }
  
  .stack-frame:hover {
    background-color: var(--highlight-line);
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .stack-frame:focus {
    outline: 2px solid var(--focus-ring);
    outline-offset: 2px;
  }
  
  .active-frame {
    border-left: 3px solid var(--accent);
  }
  
  .frame-header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  
  .frame-index {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    font-size: 11px;
    color: var(--text-secondary);
    margin-right: 8px;
  }
  
  .active-frame .frame-index {
    background-color: var(--accent);
    color: white;
  }
  
  .frame-name {
    color: var(--text-primary);
    font-weight: var(--font-weight-bold);
    font-size: 13px;
    flex: 1;
  }
  
  .frame-location {
    color: var(--text-secondary);
    font-size: 11px;
    font-family: var(--font-code);
  }
  
  .frame-details {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-left: 32px;
    font-size: 11px;
  }
  
  .frame-detail {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .detail-label {
    color: var(--text-secondary);
  }
  
  .detail-value {
    color: var(--accent);
    font-family: var(--font-code);
  }
</style>