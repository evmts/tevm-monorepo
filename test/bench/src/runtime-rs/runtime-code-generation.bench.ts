import crypto from 'node:crypto'
import fs from 'node:fs'
import { promises as fsPromises } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { generateRuntimeJs } from '@tevm/runtime-rs'
import { afterAll, beforeAll, bench, describe } from 'vitest'

/**
 * Benchmark that tests the performance of runtime code generation
 * for Solidity contracts, comparing JavaScript and Rust implementations.
 *
 * 1. Creates test contracts of varying complexity
 * 2. Generates solc output in JSON format
 * 3. Tests both the JS and Rust implementations
 */

// Constants for the benchmark
const NUM_CONTRACTS = 10
const FUNCTIONS_PER_CONTRACT_MIN = 5
const FUNCTIONS_PER_CONTRACT_MAX = 15

/**
 * Generate a sample ABI function
 */
function generateRandomFunction(index: number, complex = false) {
	const stateMutability = ['view', 'pure', 'nonpayable', 'payable'][Math.floor(Math.random() * 4)]
	const name = `function${index}`

	if (!complex) {
		return {
			type: 'function',
			name,
			inputs: [{ name: 'input', type: 'uint256' }],
			outputs: [{ name: 'output', type: 'uint256' }],
			stateMutability,
		}
	}

	// Generate a more complex function with structs and arrays
	return {
		type: 'function',
		name,
		inputs: [
			{
				name: 'complexInput',
				type: 'tuple',
				components: [
					{ name: 'id', type: 'uint256' },
					{ name: 'name', type: 'string' },
					{ name: 'values', type: 'uint256[]' },
					{
						name: 'nestedStruct',
						type: 'tuple',
						components: [
							{ name: 'active', type: 'bool' },
							{ name: 'score', type: 'uint256' },
						],
					},
				],
			},
			{ name: 'addresses', type: 'address[]' },
		],
		outputs: [
			{
				name: 'result',
				type: 'tuple',
				components: [
					{ name: 'success', type: 'bool' },
					{ name: 'data', type: 'bytes' },
				],
			},
		],
		stateMutability,
	}
}

/**
 * Generate a random event
 */
function generateRandomEvent(index: number) {
	return {
		type: 'event',
		name: `Event${index}`,
		inputs: [
			{ indexed: true, name: 'sender', type: 'address' },
			{ indexed: false, name: 'value', type: 'uint256' },
			{ indexed: false, name: 'data', type: 'bytes' },
		],
		anonymous: false,
	}
}

// Define a simplified SolcOutput type
interface SolcOutput {
	contracts?: Record<string, Record<string, any>>
	sources?: Record<string, any>
	errors?: any[]
}

/**
 * Generate a sample solc output with random contracts
 */
function generateSolcOutput(): SolcOutput {
	const contracts: Record<string, Record<string, any>> = {}
	const sources: Record<string, any> = {}

	// Create a sample file
	const file = 'TestContracts.sol'
	contracts[file] = {}
	sources[file] = {
		content: '// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\n// Test contracts for benchmarking',
	}

	// Generate multiple contracts
	for (let i = 0; i < NUM_CONTRACTS; i++) {
		const contractName = `Contract${i}`

		// Generate a random number of functions
		const numFunctions = Math.floor(
			Math.random() * (FUNCTIONS_PER_CONTRACT_MAX - FUNCTIONS_PER_CONTRACT_MIN + 1) + FUNCTIONS_PER_CONTRACT_MIN,
		)

		// Create the ABI with functions, events, and a constructor
		const abi = [
			// Constructor
			{
				type: 'constructor',
				inputs: [
					{ name: 'initialValue', type: 'uint256' },
					{ name: 'owner', type: 'address' },
				],
				stateMutability: 'payable',
			},
			// Some events
			generateRandomEvent(0),
			generateRandomEvent(1),
			generateRandomEvent(2),
			// Functions
			...Array.from(
				{ length: numFunctions },
				(_, idx) => generateRandomFunction(idx, idx % 3 === 0), // Every third function is complex
			),
		]

		// Generate random bytecode
		const bytecode = crypto.randomBytes(100).toString('hex')
		const deployedBytecode = crypto.randomBytes(200).toString('hex')

		// Create the contract output structure
		contracts[file][contractName] = {
			abi,
			metadata: JSON.stringify({
				compiler: { version: '0.8.17+commit.8df45f5f' },
				language: 'Solidity',
				output: { abi },
				settings: {
					optimizer: { enabled: true, runs: 200 },
					outputSelection: { '*': { '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'] } },
				},
				sources: { [file]: { content: sources[file].content } },
			}),
			userdoc: { kind: 'user', methods: {}, version: 1 },
			devdoc: { kind: 'dev', methods: {}, version: 1 },
			evm: {
				bytecode: {
					object: bytecode,
					sourceMap: '0:1:0',
				},
				deployedBytecode: {
					object: deployedBytecode,
					sourceMap: '0:1:0',
				},
			},
		}
	}

	return {
		contracts,
		sources,
	}
}

/**
 * Generate runtime code in JavaScript (mock implementation)
 */
function generateRuntimeJsImpl(solcOutput: any, moduleType: string, useScopedPackage: boolean): string {
	const packageName = useScopedPackage ? '@tevm/contract' : 'tevm/contract'

	// Basic implementation for comparison
	let output = ''

	if (moduleType === 'ts' || moduleType === 'mjs') {
		output += `import { createContract } from '${packageName}';\n\n`
	} else if (moduleType === 'cjs') {
		output += `const { createContract } = require('${packageName}');\n\n`
	} else if (moduleType === 'dts') {
		output += `import type { Contract } from '${packageName}';\n\n`
	}

	// Process contracts
	if (solcOutput.contracts) {
		for (const [file, fileContracts] of Object.entries(solcOutput.contracts)) {
			for (const [name, contract] of Object.entries(fileContracts as Record<string, any>)) {
				const bytecode = contract.evm?.bytecode?.object
				const deployedBytecode = contract.evm?.deployedBytecode?.object
				const abi = contract.abi

				const tevmContract = {
					bytecode: bytecode ? `0x${bytecode}` : null,
					deployedBytecode: deployedBytecode ? `0x${deployedBytecode}` : null,
					name,
					humanReadableAbi: abi?.map((item: any) => JSON.stringify(item)) || [],
				}

				// Format based on module type
				if (moduleType === 'ts') {
					output += `const _${name} = ${JSON.stringify(tevmContract, null, 2)} as const;\n\n`
					output += `export const ${name} = createContract(_${name});\n\n`
				} else if (moduleType === 'mjs') {
					output += `const _${name} = ${JSON.stringify(tevmContract, null, 2)};\n\n`
					output += `export const ${name} = createContract(_${name});\n\n`
				} else if (moduleType === 'cjs') {
					output += `const _${name} = ${JSON.stringify(tevmContract, null, 2)};\n\n`
					output += `module.exports.${name} = createContract(_${name});\n\n`
				} else if (moduleType === 'dts') {
					output += `declare const _name${name}: "${name}";\n`
					output += `declare const _abi${name}: any[];\n\n`
					output += `export const ${name}: Contract<typeof _name${name}, typeof _abi${name}, undefined, \`0x\${string}\`, \`0x\${string}\`, undefined>;\n\n`
				}
			}
		}
	}

	// Add artifacts export
	if (moduleType === 'ts' || moduleType === 'mjs') {
		output += `export const artifacts = ${JSON.stringify(solcOutput.contracts, null, 2)};\n`
	} else if (moduleType === 'cjs') {
		output += `module.exports.artifacts = ${JSON.stringify(solcOutput.contracts, null, 2)};\n`
	} else if (moduleType === 'dts') {
		output += 'export const artifacts: Record<string, any>;\n'
	}

	return output
}

describe('Runtime Code Generation Benchmarks', () => {
	// Generate the solc output before testing
	const solcOutput = generateSolcOutput()
	console.log(`Generated solc output with ${NUM_CONTRACTS} contracts`)

	// Convert to JSON string
	const solcOutputJson = JSON.stringify(solcOutput)

	bench('JavaScript Implementation - TypeScript Output', () => {
		generateRuntimeJsImpl(solcOutput, 'ts', true)
	})

	bench('Rust Implementation - TypeScript Output', () => {
		generateRuntimeJs(solcOutputJson, 'ts', true)
	})

	bench('JavaScript Implementation - CommonJS Output', () => {
		generateRuntimeJsImpl(solcOutput, 'cjs', true)
	})

	bench('Rust Implementation - CommonJS Output', () => {
		generateRuntimeJs(solcOutputJson, 'cjs', true)
	})

	bench('JavaScript Implementation - ES Module Output', () => {
		generateRuntimeJsImpl(solcOutput, 'mjs', true)
	})

	bench('Rust Implementation - ES Module Output', () => {
		generateRuntimeJs(solcOutputJson, 'mjs', true)
	})

	bench('JavaScript Implementation - TypeScript Declarations', () => {
		generateRuntimeJsImpl(solcOutput, 'dts', true)
	})

	bench('Rust Implementation - TypeScript Declarations', () => {
		generateRuntimeJs(solcOutputJson, 'dts', true)
	})
})
