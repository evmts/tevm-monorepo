// Simple test for the runtime-rs package
const fs = require('node:fs')
const path = require('node:path')

// Direct import of the runtime-rs package
const runtimeRsPath = path.resolve('/Users/williamcory/tevm/main/bundler-packages/runtime-rs')
const nativeModulePath = path.join(runtimeRsPath, 'tevm_runtime_rs.darwin-arm64.node')
console.log(`Native module path: ${nativeModulePath}`)
console.log(`Module exists: ${fs.existsSync(nativeModulePath)}`)

// Load the native module
const nativeModule = require(nativeModulePath)
console.log('Native module exports:', Object.keys(nativeModule))

// Create a minimal SolcOutput matching the expected format
const minimalSolcOutput = {
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

// Convert to JSON string
const minimalSolcOutputJson = JSON.stringify(minimalSolcOutput)

try {
	console.log('\nTesting the generateRuntimeJs function...')
	const result = nativeModule.generateRuntimeJs(minimalSolcOutputJson, 'ts', true)
	console.log('Success! Generated code length:', result.length)
	console.log('\nFirst 300 characters of generated code:')
	console.log(`${result.substring(0, 300)}...`)
} catch (error) {
	console.error('Error calling generateRuntimeJs:', error)

	// Print more details about the error if possible
	if (error.stack) {
		console.error('Error stack:', error.stack)
	}

	// Get line and column from error message if available
	const match = /at line (\d+) column (\d+)/.exec(error.message)
	if (match) {
		const line = Number.parseInt(match[1], 10)
		const column = Number.parseInt(match[2], 10)

		// Extract the part of the JSON around the error
		const lines = minimalSolcOutputJson.split('\n')
		console.error(`\nJSON context around error (line ${line}):`)
		for (let i = Math.max(0, line - 2); i <= Math.min(lines.length - 1, line + 2); i++) {
			console.error(`${i === line - 1 ? '>' : ' '} ${i + 1}: ${lines[i]}`)
			if (i === line - 1 && column) {
				// Point to the column
				console.error(`${' '.repeat(column + 4)}^`)
			}
		}
	}
}
