<script>
import { onMount } from 'svelte'
import CallStackView from './inspector/CallStackView.svelte'
import StorageView from './inspector/StorageView.svelte'
import VariablesView from './inspector/VariablesView.svelte'
import WatchView from './inspector/WatchView.svelte'

// Props
export let open = true
export let width = 300
export const minWidth = 250
export const maxWidth = 500
export const onWidthChange = (width) => {} // Callback for width changes

// State
let activeTab = 'variables'
let isResizing = false
let drawerElement

// Mock data for inspector
const variables = [
	{ name: 'owner', type: 'address', value: '0x7c3aed...5a80', scope: 'local' },
	{ name: 'amount', type: 'uint256', value: '1000', scope: 'local' },
	{ name: 'fromBalance', type: 'uint256', value: '5000', scope: 'local' },
	{
		name: '_balances',
		type: 'mapping(address => uint256)',
		value: '{...}',
		scope: 'state',
		children: [
			{ name: '0x7c3aed...5a80', type: 'uint256', value: '5000' },
			{ name: '0x916bea...f171', type: 'uint256', value: '3000' },
		],
	},
	{ name: '_totalSupply', type: 'uint256', value: '10000', scope: 'state' },
	{
		name: 'msg',
		type: 'object',
		value: '{...}',
		scope: 'global',
		children: [
			{ name: 'sender', type: 'address', value: '0x7c3aed...5a80' },
			{ name: 'value', type: 'uint256', value: '0' },
			{ name: 'data', type: 'bytes', value: '0x' },
		],
	},
	{
		name: 'block',
		type: 'object',
		value: '{...}',
		scope: 'global',
		children: [
			{ name: 'number', type: 'uint256', value: '123456' },
			{ name: 'timestamp', type: 'uint256', value: '1645000000' },
		],
	},
]

const storage = [
	{ slot: '0x0', key: '_totalSupply', type: 'uint256', value: '10000', changed: false },
	{ slot: '0x1', key: '_balances[0x7c3aed...5a80]', type: 'uint256', value: '5000', changed: true },
	{ slot: '0x2', key: '_balances[0x916bea...f171]', type: 'uint256', value: '3000', changed: false },
]

const callStack = [
	{ name: 'transfer', sourceFile: 'Token.sol', line: 15, gas: 5000, address: '0x7c3aed...5a80' },
	{ name: '_transfer', sourceFile: 'Token.sol', line: 22, gas: 4000, address: '0x7c3aed...5a80' },
]

const watches = [
	{ expression: 'balanceOf(msg.sender)', value: '5000', type: 'uint256' },
	{ expression: '_totalSupply', value: '10000', type: 'uint256' },
]

// Event handlers
function setActiveTab(tab) {
	activeTab = tab
}

function startResize(event) {
	isResizing = true

	const startX = event.clientX
	const startWidth = width

	function handleMouseMove(e) {
		const deltaX = startX - e.clientX
		const newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX))
		width = newWidth
		onWidthChange(newWidth)
	}

	function handleMouseUp() {
		isResizing = false
		window.removeEventListener('mousemove', handleMouseMove)
		window.removeEventListener('mouseup', handleMouseUp)
	}

	window.addEventListener('mousemove', handleMouseMove)
	window.addEventListener('mouseup', handleMouseUp)
}

function toggleDrawer() {
	open = !open
}

// Lifecycle hooks
onMount(() => {
	// Any initialization if needed
})
</script>

<aside 
  class="inspector-drawer {open ? 'open' : ''} {isResizing ? 'resizing' : ''}" 
  style="width: {width}px;" 
  bind:this={drawerElement}
  aria-label="Debug inspector"
>
  <div 
    class="resize-handle"
    on:mousedown={startResize}
    aria-label="Resize inspector"
    role="separator"
    aria-orientation="vertical"
  ></div>
  
  <div class="toggle-button" on:click={toggleDrawer}>
    <span class="toggle-icon">{open ? '▶' : '◀'}</span>
  </div>
  
  <div class="inspector-tabs">
    <button 
      class="tab-button {activeTab === 'variables' ? 'active' : ''}" 
      on:click={() => setActiveTab('variables')}
      aria-selected={activeTab === 'variables'}
      role="tab"
      id="tab-variables"
      aria-controls="panel-variables"
    >
      Variables
    </button>
    <button 
      class="tab-button {activeTab === 'storage' ? 'active' : ''}" 
      on:click={() => setActiveTab('storage')}
      aria-selected={activeTab === 'storage'}
      role="tab"
      id="tab-storage"
      aria-controls="panel-storage"
    >
      Storage
    </button>
    <button 
      class="tab-button {activeTab === 'callstack' ? 'active' : ''}" 
      on:click={() => setActiveTab('callstack')}
      aria-selected={activeTab === 'callstack'}
      role="tab"
      id="tab-callstack"
      aria-controls="panel-callstack"
    >
      Call Stack
    </button>
    <button 
      class="tab-button {activeTab === 'watch' ? 'active' : ''}" 
      on:click={() => setActiveTab('watch')}
      aria-selected={activeTab === 'watch'}
      role="tab"
      id="tab-watch"
      aria-controls="panel-watch"
    >
      Watch
    </button>
  </div>
  
  <div class="tab-content">
    <div 
      class="tab-panel {activeTab === 'variables' ? 'active' : ''}" 
      id="panel-variables"
      role="tabpanel"
      aria-labelledby="tab-variables"
    >
      <VariablesView {variables} />
    </div>
    
    <div 
      class="tab-panel {activeTab === 'storage' ? 'active' : ''}" 
      id="panel-storage"
      role="tabpanel"
      aria-labelledby="tab-storage"
    >
      <StorageView {storage} />
    </div>
    
    <div 
      class="tab-panel {activeTab === 'callstack' ? 'active' : ''}" 
      id="panel-callstack"
      role="tabpanel"
      aria-labelledby="tab-callstack"
    >
      <CallStackView stack={callStack} />
    </div>
    
    <div 
      class="tab-panel {activeTab === 'watch' ? 'active' : ''}" 
      id="panel-watch"
      role="tabpanel"
      aria-labelledby="tab-watch"
    >
      <WatchView {watches} />
    </div>
  </div>
</aside>

<style>
  .inspector-drawer {
    position: fixed;
    top: var(--header-height);
    right: 0;
    height: calc(100vh - var(--header-height));
    background-color: var(--bg-panel);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 20;
  }
  
  .inspector-drawer.open {
    transform: translateX(0);
  }
  
  .inspector-drawer.resizing {
    transition: none;
    user-select: none;
  }
  
  .resize-handle {
    position: absolute;
    top: 0;
    left: -3px;
    width: 6px;
    height: 100%;
    cursor: col-resize;
    z-index: 5;
  }
  
  .resize-handle:hover {
    background-color: rgba(124, 58, 237, 0.3);
  }
  
  .toggle-button {
    position: absolute;
    top: 50%;
    left: -24px;
    width: 24px;
    height: 48px;
    background-color: var(--bg-panel);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-right: none;
    border-radius: 4px 0 0 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transform: translateY(-50%);
    z-index: 4;
  }
  
  .toggle-icon {
    color: var(--text-secondary);
    font-size: 12px;
  }
  
  .inspector-tabs {
    display: flex;
    padding: var(--space-1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .tab-button {
    flex: 1;
    background: transparent;
    color: var(--text-secondary);
    border: none;
    padding: 8px var(--space-1);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
    text-align: center;
  }
  
  .tab-button.active {
    color: var(--text-primary);
    border-bottom-color: var(--accent);
  }
  
  .tab-button:hover {
    color: var(--text-primary);
  }
  
  .tab-content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
  
  .tab-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s;
    overflow-y: auto;
  }
  
  .tab-panel.active {
    opacity: 1;
    visibility: visible;
    z-index: 1;
  }
  
  @media (max-width: 900px) {
    .inspector-drawer {
      width: 320px !important;
    }
  }
  
  @media (max-width: 600px) {
    .inspector-drawer {
      width: 100% !important;
    }
    
    .resize-handle {
      display: none;
    }
  }
</style>