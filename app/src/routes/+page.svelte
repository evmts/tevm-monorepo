<script lang="ts">
import { browser } from '$app/environment'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { useQueryClient } from '@tanstack/svelte-query'
import { createElement } from 'react'
import { onMount } from 'svelte'
import { http } from 'viem'
import { base, mainnet, optimism } from 'wagmi/chains'
import { RainbowKitButton } from '../react/RainbowKitWrapper'
import ReactWrapper from '../react/ReactWrapper.svelte'

import CommandPalette from '../components/CommandPalette.svelte'
// Import our components
import HeaderBar from '../components/HeaderBar.svelte'
import InspectorDrawer from '../components/InspectorDrawer.svelte'
import MainArea from '../components/MainArea.svelte'
import Sidebar from '../components/Sidebar.svelte'

// Import default contract code
const defaultContract = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    mapping(address => uint256) private _balances;
    uint256 private _totalSupply;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        address owner = msg.sender;
        
        _transfer(owner, to, amount);
        
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "Transfer amount exceeds balance");
        
        _balances[from] = fromBalance - amount;
        _balances[to] += amount;
        
        emit Transfer(from, to, amount);
    }
}`

// State using traditional Svelte reactive variables
const code = defaultContract
let currentLine = 15
let isRunning = false
let isPaused = true
let showCommandPalette = false
let sidebarWidth = 250
let inspectorOpen = true
let inspectorWidth = 300

// Mock logs
let logs = [
	{ level: 'info', message: 'Tevm debugger initialized', timestamp: Date.now() },
	{ level: 'info', message: 'Contract compiled successfully', timestamp: Date.now() },
	{ level: 'debug', message: 'Deploying contract...', timestamp: Date.now() },
	{ level: 'info', message: 'Contract deployed at 0x7C3AED...', timestamp: Date.now() },
	{ level: 'debug', message: 'Calling transfer()...', timestamp: Date.now() },
	{ level: 'event', message: 'Transfer(0x7C3AED..., 0x916BEA..., 1000)', timestamp: Date.now() },
]

// Create Wagmi config
const queryClient = useQueryClient()
const wagmiConfig = $state(
	getDefaultConfig({
		appName: 'Tevm Solidity Debugger',
		projectId: '898f836c53a18d0661340823973f0cb4',
		chains: [mainnet, optimism, base],
		ssr: false,
		appDescription: 'A Solidity debugger powered by Tevm',
		transports: {
			[mainnet.id]: http('https://rpc.ankr.com/eth'),
		},
	}),
)

// Event handlers
function handleRunClick() {
	isRunning = true
	isPaused = false
	logs = [...logs, { level: 'debug', message: 'Executing contract...', timestamp: Date.now() }]
	// In a real implementation, this would connect to Tevm and execute the contract
}

function handleStepClick() {
	if (isRunning && isPaused) {
		// Simulate stepping to the next line
		currentLine = Math.min(currentLine + 1, 27)
		logs = [...logs, { level: 'debug', message: `Stepped to line ${currentLine + 1}`, timestamp: Date.now() }]
	}
}

function handlePauseClick() {
	isPaused = true
	logs = [...logs, { level: 'info', message: 'Execution paused', timestamp: Date.now() }]
}

function handleStopClick() {
	isRunning = false
	isPaused = true
	logs = [...logs, { level: 'info', message: 'Execution stopped', timestamp: Date.now() }]
}

function handleCommandPaletteOpen() {
	showCommandPalette = true
}

function handleCommandPaletteClose() {
	showCommandPalette = false
}

function handleCommandExecute(event: CustomEvent<{ commandId: string }>) {
	const commandId = event.detail.commandId
	console.log(`Execute command: ${commandId}`)

	// Handle commands
	switch (commandId) {
		case 'run':
			handleRunClick()
			break
		case 'step-over':
			handleStepClick()
			break
		case 'toggle-inspector':
			inspectorOpen = !inspectorOpen
			break
		// Add more command handlers as needed
	}
}

function handleSidebarWidthChange(width: number) {
	sidebarWidth = width
}

function handleInspectorWidthChange(width: number) {
	inspectorWidth = width
}

// Keyboard shortcuts
function handleKeydown(event: KeyboardEvent) {
	if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
		event.preventDefault()
		showCommandPalette = true
	}
}

// Lifecycle
onMount(() => {
	if (browser) {
		document.addEventListener('keydown', handleKeydown)
	}

	return () => {
		if (browser) {
			document.removeEventListener('keydown', handleKeydown)
		}
	}
})
</script>

<div class="debugger-app">
  <HeaderBar 
    onRunClick={handleRunClick}
    onStepClick={handleStepClick}
    onPauseClick={handlePauseClick}
    onStopClick={handleStopClick}
    onCommandPaletteOpen={handleCommandPaletteOpen}
  />
  
  <Sidebar 
    width={sidebarWidth}
    onWidthChange={handleSidebarWidthChange}
  />
  
  <MainArea 
    {sidebarWidth}
    {inspectorOpen}
    {inspectorWidth}
    {code}
    {currentLine}
    {logs}
  />
  
  <InspectorDrawer 
    open={inspectorOpen}
    width={inspectorWidth}
    onWidthChange={handleInspectorWidthChange}
  />
  
  <CommandPalette 
    open={showCommandPalette}
    on:close={handleCommandPaletteClose}
    on:execute={handleCommandExecute}
  />
  
  <div class="rainbow-wrapper">
    <ReactWrapper
      element={createElement(RainbowKitButton, {
        config: wagmiConfig,
        queryClient: queryClient,
      })}
    />
  </div>
</div>

<style>
  .debugger-app {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: var(--bg-main);
    color: var(--text-primary);
  }
  
  .rainbow-wrapper {
    position: fixed;
    top: 8px;
    right: 16px;
    z-index: 101;
  }
</style>