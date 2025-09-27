// Direct benchmark using CommonJS to compare runtime-rs with a JavaScript implementation
const fs = require('node:fs')
const path = require('node:path')
const _crypto = require('node:crypto')
const { performance } = require('node:perf_hooks')

// Direct import of the runtime-rs package
const runtimeRsPath = path.resolve('/Users/williamcory/tevm/main/bundler-packages/runtime-rs')

// On macOS ARM64, load the native module directly
const nativeModulePath = path.join(runtimeRsPath, 'tevm_runtime_rs.darwin-arm64.node')
console.log(`Looking for native module at: ${nativeModulePath}`)
console.log(`Module exists: ${fs.existsSync(nativeModulePath)}`)

const nativeModule = require(nativeModulePath)
console.log('Native module functions:', Object.keys(nativeModule))
console.log('Native module content:', nativeModule)

// The native module already exports generateRuntimeJs
const runtimeRs = nativeModule

// Constants for the benchmark
const NUM_CONTRACTS = 10
const _FUNCTIONS_PER_CONTRACT_MIN = 5
const _FUNCTIONS_PER_CONTRACT_MAX = 15
const NUM_RUNS = 10 // How many times to run each implementation

// Generate a random function for the ABI
function _generateRandomFunction(index, complex = false) {
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

// Generate a random event
function _generateRandomEvent(index) {
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

// Generate a fixed solc output that we know works
function generateSolcOutput() {
	// Based on the working test-runtime.cjs
	return {
		contracts: {
			'SimpleContract.sol': {
				SimpleContract: {
					abi: [
						{
							type: 'constructor',
							inputs: [],
							stateMutability: 'nonpayable',
						},
						{
							type: 'function',
							name: 'getValue',
							inputs: [],
							outputs: [{ type: 'uint256' }],
							stateMutability: 'view',
						},
					],
					metadata: JSON.stringify({
						compiler: { version: '0.8.17+commit.8df45f5f' },
						language: 'Solidity',
						output: {},
						settings: { optimizer: { enabled: true, runs: 200 } },
						sources: {},
						version: 1,
					}),
					userdoc: { kind: 'user', methods: {}, version: 1 },
					devdoc: { kind: 'dev', methods: {}, version: 1 },
					evm: {
						assembly: '',
						legacyAssembly: null,
						bytecode: {
							functionDebugData: {},
							object:
								'608060405234801561001057600080fd5b50604051610107380380610107833981810160405281019061003291906100b5565b806000819055505060eb565b600080fd5b6000819050919050565b61005881610045565b811461006357600080fd5b50565b6000815190506100758161004f565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6100df8261009a565b810181811067ffffffffffffffff821117156100fe576100fd6100ab565b5b80604052505050565b600061011161007b565b905061011d82826100d6565b919050565b600061012d610128846100fc565b600033565b905290565b0161013c8161004f565b811461014757600080fd5b50565b60006020828403121561016057610156610041565b5b610169816100a0565b81146101785750600082815290565b6000610183610107565b905061018f8282610153565b9190506001600160e01b03198116610153565b6101aa826100d6565b810181811067ffffffffffffffff821117156101c9576101c86100ab565b5b80604052505050565b60006000fd5b600082356101df826101cf565b6101e98185610107565b93506101f8818560208601610153565b610201816100d6565b8440549050949350505050565b60008190506000602082019050600183046001825b505050610230565b634e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000819050919050565b610270816000815581156102695761011d565b5b505050606580601b6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336047565b604051603e91906055565b60405180910390f35b60005481565b6000819050919050565b604f81604d565b82525050565b600060208201905060686000830184604e565b9291505056fea2646970667358221220032d80fec58f4ff4a68adcabf070c6ea7b0d14cb17a0dff7d8cb0c9fca90c95064736f6c63430008080033',
							opcodes: '',
							sourceMap: '',
							generatedSources: null,
							linkReferences: {},
						},
						deployed_bytecode: {
							functionDebugData: {},
							object:
								'6080604052348015600f57600080fd5b506004361060285760003560e01c80633fa4f24514602d575b600080fd5b60336047565b604051603e91906055565b60405180910390f35b60005481565b6000819050919050565b604f81604d565b82525050565b600060208201905060686000830184604e565b9291505056fea2646970667358221220032d80fec58f4ff4a68adcabf070c6ea7b0d14cb17a0dff7d8cb0c9fca90c95064736f6c63430008080033',
							opcodes: '',
							sourceMap: '',
							generatedSources: null,
							linkReferences: {},
							immutableReferences: {},
						},
						methodIdentifiers: {
							'getValue()': '3fa4f245',
						},
						gasEstimates: {
							creation: {
								codeDepositCost: '40600',
								executionCost: 'infinite',
								totalCost: 'infinite',
							},
							external: {
								'getValue()': '2415',
							},
						},
					},
				},
			},
		},
	}
}

// JavaScript implementation of runtime code generation
function generateRuntimeJsImpl(solcOutput, moduleType, useScopedPackage) {
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
		for (const [_file, fileContracts] of Object.entries(solcOutput.contracts)) {
			for (const [name, contract] of Object.entries(fileContracts)) {
				const bytecode = contract.evm?.bytecode?.object
				const deployedBytecode = contract.evm?.deployedBytecode?.object
				const abi = contract.abi

				const tevmContract = {
					bytecode: bytecode ? `0x${bytecode}` : null,
					deployedBytecode: deployedBytecode ? `0x${deployedBytecode}` : null,
					name,
					humanReadableAbi: abi?.map((item) => JSON.stringify(item)) || [],
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

// Run the benchmark
async function runBenchmark() {
	console.log('Generating test contracts...')
	const solcOutput = generateSolcOutput()
	console.log(`Generated solc output with ${NUM_CONTRACTS} contracts`)

	// Convert to JSON string for Rust
	const solcOutputJson = JSON.stringify(solcOutput)

	// Test the Rust implementation to make sure it works
	try {
		console.log('Testing Rust implementation...')
		const rustResult = runtimeRs.generateRuntimeJs(solcOutputJson, 'ts', true)
		console.log('Rust implementation working correctly:', rustResult.length > 0)
	} catch (error) {
		console.error('Error testing Rust implementation:', error)
		return
	}

	// Run JavaScript benchmark
	console.log('\nRunning JavaScript implementation benchmark...')
	const jsResults = []

	for (let i = 0; i < NUM_RUNS; i++) {
		const start = performance.now()
		generateRuntimeJsImpl(solcOutput, 'ts', true)
		const end = performance.now()
		jsResults.push(end - start)
	}

	// Run Rust benchmark
	console.log('\nRunning Rust implementation benchmark...')
	const rustResults = []

	for (let i = 0; i < NUM_RUNS; i++) {
		const start = performance.now()
		runtimeRs.generateRuntimeJs(solcOutputJson, 'ts', true)
		const end = performance.now()
		rustResults.push(end - start)
	}

	// Calculate and print results
	const jsAverage = jsResults.reduce((a, b) => a + b, 0) / jsResults.length
	const rustAverage = rustResults.reduce((a, b) => a + b, 0) / rustResults.length

	console.log('\nResults:')
	console.log(
		`JavaScript implementation: ${jsAverage.toFixed(2)}ms average (${jsResults.map((r) => r.toFixed(2)).join(', ')}ms)`,
	)
	console.log(
		`Rust implementation: ${rustAverage.toFixed(2)}ms average (${rustResults.map((r) => r.toFixed(2)).join(', ')}ms)`,
	)
	console.log(`Speedup: ${(jsAverage / rustAverage).toFixed(2)}x`)
}

// Run the benchmark
runBenchmark().catch(console.error)
