<script>
import { createEventDispatcher, onMount } from 'svelte'

// Props
export let open = false

// Event dispatcher
const dispatch = createEventDispatcher()

// State
let searchQuery = ''
let selectedIndex = 0
let commandsElement

// Mock commands
const allCommands = [
	{ id: 'run', name: 'Start Debugging', shortcut: 'F5', category: 'Debug' },
	{ id: 'step-over', name: 'Step Over', shortcut: 'F10', category: 'Debug' },
	{ id: 'step-into', name: 'Step Into', shortcut: 'F11', category: 'Debug' },
	{ id: 'step-out', name: 'Step Out', shortcut: 'Shift+F11', category: 'Debug' },
	{ id: 'toggle-breakpoint', name: 'Toggle Breakpoint', shortcut: 'F9', category: 'Debug' },
	{ id: 'clear-breakpoints', name: 'Clear All Breakpoints', shortcut: 'Ctrl+Shift+F9', category: 'Debug' },
	{ id: 'open-file', name: 'Open File', shortcut: 'Ctrl+O', category: 'File' },
	{ id: 'save', name: 'Save File', shortcut: 'Ctrl+S', category: 'File' },
	{ id: 'save-all', name: 'Save All Files', shortcut: 'Ctrl+Shift+S', category: 'File' },
	{ id: 'toggle-sidebar', name: 'Toggle Sidebar', shortcut: 'Ctrl+B', category: 'View' },
	{ id: 'toggle-inspector', name: 'Toggle Inspector', shortcut: 'Ctrl+Shift+I', category: 'View' },
	{ id: 'toggle-theme', name: 'Toggle Light/Dark Theme', shortcut: 'Ctrl+Shift+T', category: 'View' },
]

// Filter commands based on search query
$: filteredCommands = searchQuery
	? allCommands.filter(
			(cmd) =>
				cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				cmd.category.toLowerCase().includes(searchQuery.toLowerCase()),
		)
	: allCommands

// Reset selection when filtered commands change
$: if (filteredCommands.length > 0) {
	selectedIndex = Math.min(selectedIndex, filteredCommands.length - 1)
} else {
	selectedIndex = -1
}

// Close the palette
function close() {
	open = false
	searchQuery = ''
	selectedIndex = 0
	dispatch('close')
}

// Execute a command
function executeCommand(commandId) {
	console.log(`Execute command: ${commandId}`)
	// In a real implementation, this would dispatch the command to the appropriate handler
	dispatch('execute', { commandId })
	close()
}

// Handle keyboard navigation
function handleKeydown(event) {
	if (!open) return

	switch (event.key) {
		case 'ArrowDown':
			event.preventDefault()
			selectedIndex = (selectedIndex + 1) % filteredCommands.length
			scrollSelectedIntoView()
			break

		case 'ArrowUp':
			event.preventDefault()
			selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length
			scrollSelectedIntoView()
			break

		case 'Enter':
			event.preventDefault()
			if (selectedIndex >= 0 && selectedIndex < filteredCommands.length) {
				executeCommand(filteredCommands[selectedIndex].id)
			}
			break

		case 'Escape':
			event.preventDefault()
			close()
			break
	}
}

// Scroll the selected item into view
function scrollSelectedIntoView() {
	if (!commandsElement) return

	const selectedElement = commandsElement.querySelector(`[data-index="${selectedIndex}"]`)
	if (selectedElement) {
		selectedElement.scrollIntoView({ block: 'nearest' })
	}
}

// Focus the search input when the palette opens
$: if (open) {
	setTimeout(() => {
		const input = document.querySelector('.command-palette-search input')
		if (input) input.focus()
	}, 10)
}

// Handle clicks outside the palette to close it
function handleClickOutside(event) {
	const palette = document.querySelector('.command-palette-container')
	if (palette && !palette.contains(event.target)) {
		close()
	}
}

// Lifecycle
onMount(() => {
	document.addEventListener('keydown', handleKeydown)
	document.addEventListener('click', handleClickOutside)

	return () => {
		document.removeEventListener('keydown', handleKeydown)
		document.removeEventListener('click', handleClickOutside)
	}
})
</script>

{#if open}
  <div class="command-palette" aria-modal="true" role="dialog" aria-label="Command Palette">
    <div class="command-palette-container animate-pop">
      <div class="command-palette-search">
        <div class="search-icon">🔍</div>
        <input 
          type="text" 
          placeholder="Search commands..." 
          bind:value={searchQuery}
          aria-label="Search commands"
        />
        <div class="search-shortcut-hint">ESC to close</div>
      </div>
      
      <div class="command-palette-results" bind:this={commandsElement}>
        {#if filteredCommands.length === 0}
          <div class="no-results">
            <p>No commands found</p>
          </div>
        {:else}
          <div class="command-list">
            {#each filteredCommands as command, index}
              <button 
                class="command-item {index === selectedIndex ? 'selected' : ''}" 
                on:click={() => executeCommand(command.id)}
                on:mouseover={() => selectedIndex = index}
                on:focus={() => selectedIndex = index}
                on:keydown={(e) => e.key === 'Enter' && executeCommand(command.id)}
                data-index={index}
                type="button"
                tabindex={index === selectedIndex ? 0 : -1}
              >
                <div class="command-info">
                  <div class="command-category">{command.category}</div>
                  <div class="command-name">{command.name}</div>
                </div>
                <div class="command-shortcut">{command.shortcut}</div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .command-palette {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-overlay);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 1000;
    padding-top: 120px;
    backdrop-filter: blur(4px);
  }
  
  .command-palette-container {
    width: 600px;
    max-width: 90%;
    max-height: 70vh;
    background-color: var(--bg-panel);
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .command-palette-search {
    display: flex;
    align-items: center;
    padding: var(--space-2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .search-icon {
    margin-right: var(--space-1);
    color: var(--text-secondary);
  }
  
  .command-palette-search input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 16px;
    outline: none;
  }
  
  .search-shortcut-hint {
    color: var(--text-secondary);
    font-size: 12px;
    padding: 2px 6px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  .command-palette-results {
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .no-results {
    padding: var(--space-3);
    text-align: center;
    color: var(--text-secondary);
    font-style: italic;
  }
  
  .command-list {
    display: flex;
    flex-direction: column;
  }
  
  .command-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: var(--space-1) var(--space-2);
    cursor: pointer;
    transition: background-color 0.2s;
    border: none;
    border-left: 3px solid transparent;
    background-color: transparent;
    color: var(--text-primary);
    font-family: var(--font-ui);
    font-size: 14px;
  }
  
  .command-item:hover, .command-item.selected, .command-item:focus {
    background-color: var(--highlight-line);
    outline: none;
  }
  
  .command-item.selected {
    border-left-color: var(--accent);
  }
  
  .command-info {
    display: flex;
    flex-direction: column;
  }
  
  .command-category {
    color: var(--text-secondary);
    font-size: 11px;
    margin-bottom: 2px;
  }
  
  .command-name {
    color: var(--text-primary);
    font-size: 14px;
  }
  
  .command-shortcut {
    color: var(--text-secondary);
    font-size: 12px;
    padding: 2px 6px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    min-width: 60px;
    text-align: center;
  }
</style>