<script>
import { onMount } from 'svelte'

// Props
export let watches = []

// State
let newExpression = ''
let editIndex = -1
let editValue = ''

// Add a new watch expression
function addWatch() {
	if (!newExpression.trim()) return

	// In a real implementation, you would evaluate the expression and get its value
	const newWatch = {
		expression: newExpression,
		value: 'undefined', // This would be dynamically evaluated
		type: 'unknown', // This would be dynamically determined
	}

	watches = [...watches, newWatch]
	newExpression = ''
}

// Remove a watch expression
function removeWatch(index) {
	watches = watches.filter((_, i) => i !== index)

	// If we were editing this watch, cancel the edit
	if (editIndex === index) {
		cancelEdit()
	}
}

// Start editing a watch expression
function startEdit(index) {
	editIndex = index
	editValue = watches[index].expression
}

// Save the edited expression
function saveEdit() {
	if (editIndex === -1 || !editValue.trim()) return

	// Create a new array to trigger reactivity
	watches = watches.map((watch, index) => {
		if (index === editIndex) {
			return {
				...watch,
				expression: editValue,
				// In a real implementation, you would re-evaluate the expression here
			}
		}
		return watch
	})

	cancelEdit()
}

// Cancel editing
function cancelEdit() {
	editIndex = -1
	editValue = ''
}

// Handle keydown in edit input
function handleEditKeydown(event) {
	if (event.key === 'Enter') {
		event.preventDefault()
		saveEdit()
	} else if (event.key === 'Escape') {
		event.preventDefault()
		cancelEdit()
	}
}

// Handle keydown in new expression input
function handleNewExpressionKeydown(event) {
	if (event.key === 'Enter') {
		event.preventDefault()
		addWatch()
	}
}
</script>

<div class="watch-view">
  <div class="add-watch">
    <input 
      type="text" 
      placeholder="Add expression to watch..." 
      bind:value={newExpression}
      on:keydown={handleNewExpressionKeydown}
      aria-label="Add new watch expression"
    />
    <button 
      on:click={addWatch}
      disabled={!newExpression.trim()}
      aria-label="Add watch"
    >
      Add
    </button>
  </div>
  
  <div class="watch-list">
    {#if watches.length === 0}
      <div class="empty-state">
        <p>No watch expressions</p>
        <p class="empty-hint">Add an expression to watch its value</p>
      </div>
    {:else}
      {#each watches as watch, index}
        <div class="watch-item">
          {#if editIndex === index}
            <div class="watch-edit">
              <input 
                type="text" 
                bind:value={editValue}
                on:keydown={handleEditKeydown}
                aria-label="Edit watch expression"
                autoFocus
              />
              <div class="edit-actions">
                <button 
                  class="icon-button sm" 
                  on:click={saveEdit}
                  title="Save"
                  aria-label="Save changes"
                >
                  ✓
                </button>
                <button 
                  class="icon-button sm" 
                  on:click={cancelEdit}
                  title="Cancel"
                  aria-label="Cancel editing"
                >
                  ✕
                </button>
              </div>
            </div>
          {:else}
            <div class="watch-content">
              <div class="watch-expression" on:dblclick={() => startEdit(index)}>
                {watch.expression}
              </div>
              <div class="watch-result">
                <span class="watch-value">{watch.value}</span>
                <span class="watch-type">{watch.type}</span>
              </div>
              <div class="watch-actions">
                <button 
                  class="icon-button sm" 
                  on:click={() => startEdit(index)}
                  title="Edit expression"
                  aria-label="Edit expression"
                >
                  ✎
                </button>
                <button 
                  class="icon-button sm" 
                  on:click={() => removeWatch(index)}
                  title="Remove"
                  aria-label="Remove watch"
                >
                  ✕
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .watch-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .add-watch {
    padding: var(--space-1);
    display: flex;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  input {
    flex: 1;
    padding: 6px 8px;
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
    font-family: var(--font-code);
  }
  
  input:focus {
    outline: none;
    border-color: var(--accent);
  }
  
  button {
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: var(--accent-hover);
  }
  
  button:disabled {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
    cursor: not-allowed;
  }
  
  .watch-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-1);
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: var(--text-secondary);
    font-style: italic;
    font-size: 12px;
    text-align: center;
  }
  
  .empty-hint {
    font-size: 11px;
    margin-top: 4px;
  }
  
  .watch-item {
    margin-bottom: 8px;
    background-color: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .watch-content {
    padding: 8px;
  }
  
  .watch-edit {
    display: flex;
    padding: 8px;
    gap: 8px;
  }
  
  .edit-actions {
    display: flex;
    gap: 4px;
  }
  
  .watch-expression {
    color: var(--text-primary);
    font-family: var(--font-code);
    font-size: 12px;
    margin-bottom: 4px;
  }
  
  .watch-result {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .watch-value {
    color: var(--text-secondary);
    font-family: var(--font-code);
    font-size: 11px;
  }
  
  .watch-type {
    color: var(--accent);
    font-size: 10px;
    padding: 1px 4px;
    background-color: rgba(124, 58, 237, 0.1);
    border-radius: 3px;
  }
  
  .watch-actions {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 4px;
  }
  
  .icon-button.sm {
    width: 20px;
    height: 20px;
    font-size: 10px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-secondary);
  }
  
  .icon-button.sm:hover {
    background-color: var(--highlight-line);
    color: var(--text-primary);
  }
</style>