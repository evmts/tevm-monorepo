<script>
// Props
export const storage = []

// State
let displayFormat = 'hex' // 'hex' or 'decimal'

// Toggle display format
function toggleFormat() {
	displayFormat = displayFormat === 'hex' ? 'decimal' : 'hex'
}

// Format value based on current display format
function formatValue(value, type) {
	if (!value) return ''

	// If it's already in the correct format or not a number, return as is
	if (
		(displayFormat === 'hex' && value.toString().startsWith('0x')) ||
		(displayFormat === 'decimal' && !value.toString().startsWith('0x')) ||
		type !== 'uint256'
	) {
		return value
	}

	try {
		// Convert between formats
		if (displayFormat === 'hex') {
			// To hex
			return `0x${BigInt(value).toString(16)}`
		}
		// To decimal
		return value.startsWith('0x') ? BigInt(value).toString() : value
	} catch (e) {
		// If conversion fails, return original
		console.error('Value conversion error:', e)
		return value
	}
}
</script>

<div class="storage-view">
  <div class="storage-controls">
    <button 
      class="format-button"
      on:click={toggleFormat}
      aria-label="Toggle between hexadecimal and decimal display"
    >
      {displayFormat === 'hex' ? 'HEX' : 'DEC'}
    </button>
  </div>
  
  <div class="storage-table-container">
    {#if storage.length === 0}
      <div class="empty-state">
        <p>No storage data available</p>
      </div>
    {:else}
      <table class="storage-table">
        <thead>
          <tr>
            <th>Slot</th>
            <th>Key</th>
            <th>Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {#each storage as item}
            <tr class={item.changed ? 'changed-row' : ''}>
              <td class="slot-cell">{formatValue(item.slot, 'bytes32')}</td>
              <td class="key-cell">{item.key}</td>
              <td class="type-cell">{item.type}</td>
              <td class="value-cell">
                <span class="value">{formatValue(item.value, item.type)}</span>
                {#if item.changed}
                  <span class="change-indicator" title="Value changed">↻</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .storage-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .storage-controls {
    padding: var(--space-1);
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .format-button {
    font-size: 11px;
    padding: 2px 6px;
    background-color: var(--highlight-line);
    color: var(--text-secondary);
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
  }
  
  .format-button:hover {
    background-color: var(--accent);
    color: white;
  }
  
  .storage-table-container {
    flex: 1;
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
  
  .storage-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
    font-family: var(--font-code);
  }
  
  .storage-table th {
    text-align: left;
    padding: 8px;
    color: var(--text-secondary);
    font-weight: var(--font-weight-bold);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    position: sticky;
    top: 0;
    background-color: var(--bg-panel);
    z-index: 1;
  }
  
  .storage-table td {
    padding: 6px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    vertical-align: middle;
  }
  
  .storage-table tr:hover {
    background-color: var(--highlight-line);
  }
  
  .slot-cell {
    font-family: var(--font-code);
    color: var(--text-secondary);
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .key-cell {
    color: var(--text-primary);
    font-weight: var(--font-weight-bold);
  }
  
  .type-cell {
    color: var(--accent);
    font-size: 11px;
  }
  
  .value-cell {
    text-align: right;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
  }
  
  .changed-row .value-cell {
    color: var(--warn);
    animation: highlight 1s ease-out;
  }
  
  .change-indicator {
    color: var(--warn);
    font-weight: bold;
  }
  
  @keyframes highlight {
    0% { background-color: rgba(248, 113, 113, 0.2); }
    100% { background-color: transparent; }
  }
</style>