const fs = require('node:fs').promises
const path = require('node:path')
const assert = require('node:assert')
const { createBundler } = require('../')

// Example Solidity file content
const SOLIDITY_CONTENT = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Counter {
    uint public count;
    
    constructor(uint _count) {
        count = _count;
    }
    
    function increment() public {
        count += 1;
    }
    
    function decrement() public {
        count -= 1;
    }
    
    function reset() public {
        count = 0;
    }
}
`

async function runTest() {
	try {
		console.log('Testing bundler-rs...')

		// Create temp directory for test files
		const testDir = path.join(__dirname, 'temp')
		await fs.mkdir(testDir, { recursive: true })

		// Create a Solidity file for testing
		const sampleFilePath = path.join(testDir, 'Counter.sol')
		await fs.writeFile(sampleFilePath, SOLIDITY_CONTENT)

		// Create the bundler
		console.log('\nCreating bundler...')
		const bundler = await createBundler({
			remappings: [],
			libs: [],
			solcVersion: '0.8.20',
			cacheDir: path.join(testDir, '.cache'),
		})

		// Test bundling to TypeScript
		console.log('\nTesting TypeScript module generation...')
		const tsResult = await bundler.resolveTsModule(sampleFilePath, testDir, {
			optimize: true,
			includeBytecode: true,
		})

		// Verify TS result
		assert.ok(tsResult.code, 'TypeScript code should not be empty')
		assert.ok(tsResult.code.includes('createContract'), 'TypeScript code should include createContract')
		assert.ok(tsResult.code.includes('Counter'), 'TypeScript code should include the Counter contract')
		console.log('✓ TypeScript module generation passed')

		// Test bundling to declarations
		console.log('\nTesting Declaration file generation...')
		const dtsResult = await bundler.resolveDts(sampleFilePath, testDir, {
			optimize: true,
			includeBytecode: true,
		})

		// Verify DTS result
		assert.ok(dtsResult.code, 'Declaration code should not be empty')
		assert.ok(dtsResult.code.includes('Counter'), 'Declaration code should include the Counter contract')
		assert.ok(dtsResult.code.includes('export declare'), 'Declaration code should include export declarations')
		console.log('✓ Declaration file generation passed')

		// Test artifact compilation
		console.log('\nTesting artifact compilation...')
		const artifactsResult = await bundler.compileArtifacts(sampleFilePath, testDir, {
			optimize: true,
			includeBytecode: true,
		})

		// Parse the JSON string back to an object
		const artifacts = JSON.parse(artifactsResult)

		// Verify artifacts
		assert.ok(artifacts.modules, 'Artifacts should include modules')
		assert.ok(artifacts.artifacts, 'Artifacts should include compiled contracts')
		assert.ok(artifacts.solc_input, 'Artifacts should include solc input')
		assert.ok(artifacts.solc_output, 'Artifacts should include solc output')

		// Verify contract artifacts
		const contractKeys = Object.keys(artifacts.artifacts)
		assert.ok(contractKeys.length > 0, 'Artifacts should contain at least one contract')

		// Get first contract
		const firstContract = artifacts.artifacts[contractKeys[0]]

		// Check contract components
		assert.ok(firstContract.abi, 'Contract should have an ABI')
		assert.ok(firstContract.bytecode, 'Contract should have bytecode')
		assert.ok(Array.isArray(firstContract.abi), 'ABI should be an array')

		// Check ABI has the expected functions
		const functionNames = firstContract.abi.filter((item) => item.type === 'function').map((item) => item.name)

		assert.ok(functionNames.includes('increment'), 'ABI should include increment function')
		assert.ok(functionNames.includes('decrement'), 'ABI should include decrement function')
		assert.ok(functionNames.includes('reset'), 'ABI should include reset function')
		assert.ok(functionNames.includes('count'), 'ABI should include count function')

		console.log('✓ Artifact compilation passed')

		// Clean up test files
		await fs.rm(testDir, { recursive: true, force: true })

		console.log('\nAll tests passed! ✅')
	} catch (err) {
		console.error('❌ Test failed:', err)
		process.exit(1)
	}
}

runTest().catch(console.error)
