<script>
// Props
export const variables = []

// State
let expandedItems = new Set()
const searchQuery = ''

// Toggle expansion of an item with children
function toggleExpand(variable) {
	if (!variable.children) return

	if (expandedItems.has(variable.name)) {
		expandedItems.delete(variable.name)
	} else {
		expandedItems.add(variable.name)
	}

	expandedItems = new Set(expandedItems) // Create a new Set to trigger reactivity
}

// Filter variables based on search query
$: filteredVariables = searchQuery
	? variables.filter(
			(v) =>
				v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				v.value.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
				v.type.toLowerCase().includes(searchQuery.toLowerCase()),
		)
	: variables

// Get badge class based on variable scope
function getScopeBadgeClass(scope) {
	switch (scope) {
		case 'local':
			return 'badge-blue'
		case 'state':
			return 'badge-purple'
		case 'global':
			return 'badge-orange'
		default:
			return 'badge-gray'
	}
}

// Determine if a variable has children
function hasChildren(variable) {
	return variable.children && variable.children.length > 0
}
</script>

<div class="variables-view">
  <div class="search-bar">
    <input 
      type="text" 
      placeholder="Search variables..." 
      bind:value={searchQuery} 
      aria-label="Search variables"
    />
  </div>
  
  <div class="variables-list">
    {#if filteredVariables.length === 0}
      <div class="empty-state">
        <p>No variables match your search</p>
      </div>
    {:else}
      {#each filteredVariables as variable}
        <div class="variable-item">
          <div 
            class="variable-header {hasChildren(variable) ? 'expandable' : ''}" 
            on:click={() => toggleExpand(variable)}
            aria-expanded={expandedItems.has(variable.name)}
          >
            {#if hasChildren(variable)}
              <span class="expand-icon">{expandedItems.has(variable.name) ? '▼' : '▶'}</span>
            {:else}
              <span class="spacer"></span>
            {/if}
            
            <span class="variable-name">{variable.name}</span>
            <span class="variable-type">{variable.type}</span>
            <span class="variable-value">{variable.value}</span>
            
            {#if variable.scope}
              <span class="variable-scope-badge {getScopeBadgeClass(variable.scope)}">
                {variable.scope}
              </span>
            {/if}
          </div>
          
          {#if hasChildren(variable) && expandedItems.has(variable.name)}
            <div class="variable-children">
              {#each variable.children as child}
                <div class="variable-item child">
                  <div class="variable-header">
                    <span class="spacer"></span>
                    <span class="variable-name">{child.name}</span>
                    <span class="variable-type">{child.type}</span>
                    <span class="variable-value">{child.value}</span>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .variables-view {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .search-bar {
    padding: var(--space-1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  input {
    width: 100%;
    padding: 6px 8px;
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
  }
  
  input:focus {
    outline: none;
    border-color: var(--accent);
  }
  
  .variables-list {
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
  
  .variable-item {
    margin-bottom: 2px;
  }
  
  .variable-header {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-family: var(--font-code);
    cursor: default;
  }
  
  .variable-header.expandable {
    cursor: pointer;
  }
  
  .variable-header:hover {
    background-color: var(--highlight-line);
  }
  
  .expand-icon, .spacer {
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--text-secondary);
  }
  
  .variable-name {
    flex: 1;
    color: var(--text-primary);
    font-weight: var(--font-weight-bold);
    margin-right: var(--space-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .variable-type {
    color: var(--accent);
    margin-right: var(--space-1);
    font-size: 11px;
    flex: 0 0 auto;
  }
  
  .variable-value {
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
    text-align: right;
    margin-right: var(--space-1);
  }
  
  .variable-scope-badge {
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 3px;
    text-transform: uppercase;
    flex-shrink: 0;
  }
  
  .badge-blue {
    background-color: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }
  
  .badge-purple {
    background-color: rgba(139, 92, 246, 0.2);
    color: #a78bfa;
  }
  
  .badge-orange {
    background-color: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
  }
  
  .badge-gray {
    background-color: rgba(107, 114, 128, 0.2);
    color: #9ca3af;
  }
  
  .variable-children {
    margin-left: var(--space-2);
    border-left: 1px dashed rgba(255, 255, 255, 0.1);
    animation: fade-in 0.2s ease-out;
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>