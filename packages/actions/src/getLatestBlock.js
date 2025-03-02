#!/usr/bin/env node

/**
 * This script fetches the latest block information from a public RPC URL.
 * It can be used to update hardcoded block values in tests.
 */

import { execSync } from 'node:child_process'

// Default RPC URL - using Ankr's public Ethereum endpoint
// For Optimism use: https://rpc.ankr.com/optimism
const RPC_URL = process.env.RPC_URL || 'https://rpc.ankr.com/eth'

try {
	// Using cast (foundry) to fetch latest block info
	const result = execSync(`cast block --rpc-url ${RPC_URL} latest`, { encoding: 'utf8' })

	console.log('Latest block information:')
	console.log(result)

	// Extract block number in both decimal and hex formats
	const blockNumberMatch = result.match(/number\s+(\d+)/)
	if (blockNumberMatch?.[1]) {
		const blockNumberDec = blockNumberMatch[1]
		const blockNumberHex = `0x${Number.parseInt(blockNumberDec).toString(16)}`
		console.log(`\nBlock number (decimal): ${blockNumberDec}`)
		console.log(`Block number (hex): ${blockNumberHex}`)
	}

	// Extract block hash
	const blockHashMatch = result.match(/hash\s+(0x[a-fA-F0-9]+)/)
	if (blockHashMatch?.[1]) {
		console.log(`Block hash: ${blockHashMatch[1]}`)
	}
} catch (error) {
	console.error('Error fetching latest block:')
	console.error(error.message)
	process.exit(1)
}
