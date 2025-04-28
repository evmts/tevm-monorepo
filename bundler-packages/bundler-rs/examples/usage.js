const fs = require('node:fs').promises
const path = require('node:path')
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

// Write a sample Solidity file
async function writeSampleFile() {
	const dir = path.join(__dirname, 'temp')

	try {
		await fs.mkdir(dir, { recursive: true })
		const filePath = path.join(dir, 'Counter.sol')
		await fs.writeFile(filePath, SOLIDITY_CONTENT)
		return filePath
	} catch (error) {
		console.error('Error writing sample file:', error)
		throw error
	}
}

// Main function
async function main() {
	try {
		console.log('Creating sample Solidity file...')
		const sampleFilePath = await writeSampleFile()
		console.log(`Sample file created at: ${sampleFilePath}`)

		console.log('\nCreating bundler...')
		const bundler = await createBundler({
			remappings: [],
			libs: [],
			solcVersion: '0.8.20',
			cacheDir: path.join(__dirname, 'temp', '.cache'),
			debug: true,
		})

		console.log('\nCompiling to TypeScript...')
		const tsResult = await bundler.resolveTsModule(sampleFilePath, __dirname, {
			optimize: true,
			optimizerRuns: 200,
			includeAst: false,
			includeBytecode: true,
		})

		console.log('\nTypeScript output:')
		console.log('-'.repeat(80))
		console.log(tsResult.code.substring(0, 2000) + (tsResult.code.length > 2000 ? '...' : ''))
		console.log('-'.repeat(80))

		// Write the output to a file
		const tsOutputPath = path.join(__dirname, 'temp', 'Counter.ts')
		await fs.writeFile(tsOutputPath, tsResult.code)
		console.log(`\nTypeScript output written to: ${tsOutputPath}`)

		console.log('\nCompiling to Declaration file...')
		const dtsResult = await bundler.resolveDts(sampleFilePath, __dirname, {
			optimize: true,
			optimizerRuns: 200,
			includeAst: false,
			includeBytecode: true,
		})

		console.log('\nDeclaration file output:')
		console.log('-'.repeat(80))
		console.log(dtsResult.code.substring(0, 2000) + (dtsResult.code.length > 2000 ? '...' : ''))
		console.log('-'.repeat(80))

		// Write the output to a file
		const dtsOutputPath = path.join(__dirname, 'temp', 'Counter.d.ts')
		await fs.writeFile(dtsOutputPath, dtsResult.code)
		console.log(`\nDeclaration file output written to: ${dtsOutputPath}`)

		console.log('\nCompiling artifacts...')
		const artifactsResult = await bundler.compileArtifacts(sampleFilePath, __dirname, {
			optimize: true,
			optimizerRuns: 200,
			includeAst: false,
			includeBytecode: true,
		})

		// Parse the JSON string back to an object
		const artifacts = JSON.parse(artifactsResult)

		console.log('\nArtifacts summary:')
		console.log('-'.repeat(80))
		console.log(`Number of modules: ${Object.keys(artifacts.modules).length}`)
		console.log(`Number of artifacts: ${Object.keys(artifacts.artifacts).length}`)

		if (artifacts.artifacts) {
			for (const key of Object.keys(artifacts.artifacts)) {
				const artifact = artifacts.artifacts[key]
				console.log(`\nContract: ${key}`)
				console.log(`- Has ABI: ${artifact.abi ? 'Yes' : 'No'}`)
				console.log(`- Has bytecode: ${artifact.bytecode ? 'Yes' : 'No'}`)
				console.log(`- Has deployed bytecode: ${artifact.deployed_bytecode ? 'Yes' : 'No'}`)
				console.log(`- Has user docs: ${artifact.user_doc ? 'Yes' : 'No'}`)
				console.log(`- Has dev docs: ${artifact.dev_doc ? 'Yes' : 'No'}`)

				if (artifact.abi) {
					console.log('\nABI methods:')
					for (const item of artifact.abi) {
						if (item.type === 'function') {
							console.log(`- ${item.name}(${(item.inputs || []).map((i) => `${i.type} ${i.name}`).join(', ')})`)
						} else if (item.type === 'constructor') {
							console.log(`- constructor(${(item.inputs || []).map((i) => `${i.type} ${i.name}`).join(', ')})`)
						}
					}
				}
			}
		}
		console.log('-'.repeat(80))

		// Write the artifacts to a file
		const artifactsOutputPath = path.join(__dirname, 'temp', 'Counter.artifacts.json')
		await fs.writeFile(artifactsOutputPath, JSON.stringify(artifacts, null, 2))
		console.log(`\nArtifacts written to: ${artifactsOutputPath}`)
	} catch (error) {
		console.error('Error:', error)
	}
}

main().catch(console.error)
