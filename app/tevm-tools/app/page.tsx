'use client'

import { CommandPalette } from '@/components/command-palette'
import { HeaderBar } from '@/components/header-bar'
import { InspectorDrawer } from '@/components/inspector-drawer'
import { MainArea } from '@/components/main-area'
import { Sidebar } from '@/components/sidebar'
import { useEffect, useState } from 'react'

export default function DebuggerApp() {
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
	const [inspectorOpen, setInspectorOpen] = useState(false)
	const [sidebarWidth, setSidebarWidth] = useState(250)
	const [inspectorWidth, setInspectorWidth] = useState(350)
	const [activeView, setActiveView] = useState<'files' | 'outline'>('files')

	// Mock data
	const [fileTree, setFileTree] = useState([
		{
			name: 'contracts',
			type: 'folder',
			children: [
				{ name: 'Token.sol', type: 'file' },
				{ name: 'Vault.sol', type: 'file' },
			],
		},
		{ name: 'scripts', type: 'folder', children: [{ name: 'deploy.ts', type: 'file' }] },
		{ name: 'test', type: 'folder', children: [{ name: 'Token.test.ts', type: 'file' }] },
	])

	const [currentFile, setCurrentFile] = useState({
		name: 'Token.sol',
		content: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        balanceOf[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
    function transfer(address to, uint256 value) public returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= value, "Insufficient balance");
        
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= value, "Insufficient balance");
        require(allowance[from][msg.sender] >= value, "Insufficient allowance");
        
        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}`,
	})

	const [logs, setLogs] = useState([
		{ level: 'info', message: 'Compiling contracts...' },
		{ level: 'info', message: 'Compiled successfully' },
		{ level: 'info', message: 'Deploying Token.sol...' },
		{
			level: 'event',
			message:
				'Transfer(0x0000000000000000000000000000000000000000, 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 1000000000000000000000000)',
		},
		{ level: 'info', message: 'Deployed at: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4' },
	])

	const [variables, setVariables] = useState([
		{ name: 'name', value: 'MyToken', type: 'string' },
		{ name: 'symbol', value: 'MTK', type: 'string' },
		{ name: 'decimals', value: '18', type: 'uint8' },
		{ name: 'totalSupply', value: '1000000000000000000000000', type: 'uint256' },
	])

	const [storage, setStorage] = useState([
		{ slot: '0', key: 'name', value: 'MyToken', diff: false },
		{ slot: '1', key: 'symbol', value: 'MTK', diff: false },
		{ slot: '2', key: 'decimals', value: '18', diff: false },
		{ slot: '3', key: 'totalSupply', value: '1000000000000000000000000', diff: false },
	])

	const [callStack, setCallStack] = useState([
		{ name: 'transfer', source: 'Token.sol', line: 25 },
		{ name: 'constructor', source: 'Token.sol', line: 15 },
	])

	const [watches, setWatches] = useState([{ expression: 'balanceOf[msg.sender]', value: '1000000000000000000000000' }])

	const [outline, setOutline] = useState([
		{ name: 'Token', type: 'contract', line: 4 },
		{ name: 'name', type: 'variable', line: 5 },
		{ name: 'symbol', type: 'variable', line: 6 },
		{ name: 'decimals', type: 'variable', line: 7 },
		{ name: 'totalSupply', type: 'variable', line: 8 },
		{ name: 'balanceOf', type: 'mapping', line: 10 },
		{ name: 'allowance', type: 'mapping', line: 11 },
		{ name: 'Transfer', type: 'event', line: 13 },
		{ name: 'Approval', type: 'event', line: 14 },
		{ name: 'constructor', type: 'function', line: 16 },
		{ name: 'transfer', type: 'function', line: 24 },
		{ name: 'approve', type: 'function', line: 33 },
		{ name: 'transferFrom', type: 'function', line: 39 },
	])

	// Handle keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Command palette with Cmd+K or /
			if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
				e.preventDefault()
				setCommandPaletteOpen(true)
			}

			// Toggle inspector with Cmd+I
			if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
				e.preventDefault()
				setInspectorOpen(!inspectorOpen)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [inspectorOpen])

	return (
		<div className="flex flex-col h-screen bg-bg-main text-text-primary">
			<HeaderBar
				onclick={() => setCommandPaletteOpen(true)}
				onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
			/>

			<div className="flex flex-1 overflow-hidden">
				<Sidebar
					width={sidebarWidth}
					onResize={setSidebarWidth}
					activeView={activeView}
					onChangeView={setActiveView}
					fileTree={fileTree}
					outline={outline}
				/>

				<MainArea
					file={currentFile}
					logs={logs}
					sidebarWidth={sidebarWidth}
					inspectorWidth={inspectorOpen ? inspectorWidth : 0}
				/>

				<InspectorDrawer
					open={inspectorOpen}
					width={inspectorWidth}
					onResize={setInspectorWidth}
					variables={variables}
					storage={storage}
					callStack={callStack}
					watches={watches}
				/>
			</div>

			<CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
		</div>
	)
}
