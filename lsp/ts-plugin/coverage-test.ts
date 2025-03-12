// This is a test file that directly runs the methods we want to test
// without relying on mocking, which is causing issues in our test setup

import { existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'

// Function to test the .s.sol and debug sections of getScriptSnapshot.ts
function testScriptSnapshotSpecialPaths() {
	// Import the code inline to avoid module mocking issues
	const { getScriptSnapshotDecorator } = require('./src/decorators/getScriptSnapshot.js')

	// Create a simplified cache object
	const cache = {}

	// Create a simplified TypeScript object
	const ts = {
		ScriptSnapshot: {
			fromString: (text: string) => ({ text }),
		},
		Extension: {
			Dts: '.d.ts',
		},
	}

	// Create a simplified file access object
	const fao = {
		existsSync: (path: string) => {
			// Our test cases
			if (path === '/test.s.sol') return true
			if (path === '/test.s.sol.d.ts' || path === '/test.s.sol.ts') return false
			if (path === '/debug.sol') return true
			if (path === '/debug.sol.d.ts' || path === '/debug.sol.ts') return false
			// Default
			return false
		},
		writeFileSync: (path: string, content: string) => {
			console.log(`[Debug] writeFileSync called with path: ${path}`)
			console.log(`[Debug] Content starts with: ${content.substring(0, 50)}...`)
		},
	}

	// Create mock bundler that records calls
	const mockCalls: any[] = []
	const mockBundler = () => ({
		resolveDtsSync: (filePath: string, cwd: string, _: boolean, resolveBytecode: boolean) => {
			mockCalls.push({ filePath, resolveBytecode })
			return { code: 'export type Test = any;' }
		},
	})

	// Replace the module
	const bundlerModule = require('@tevm/base-bundler')
	const originalBundler = bundlerModule.bundler
	bundlerModule.bundler = mockBundler

	try {
		// Test .s.sol path
		console.log('Testing .s.sol path (should set resolveBytecode=true)...')
		const decorator = getScriptSnapshotDecorator(cache)(
			{
				languageServiceHost: {
					getScriptSnapshot: () => null,
				},
				project: {
					getCurrentDirectory: () => '/mock',
				},
			},
			ts as any,
			{
				info: () => {},
				error: () => {},
				warn: () => {},
				log: () => {},
			},
			{},
			fao as any,
		)

		// Call with .s.sol file
		decorator.getScriptSnapshot('/test.s.sol')

		// Check if the call was made with resolveBytecode=true
		const solCall = mockCalls.find((call) => call.filePath === '/test.s.sol')
		if (solCall && solCall.resolveBytecode === true) {
			console.log('✅ .s.sol test passed! resolveBytecode was set to true')
		} else {
			console.log('❌ .s.sol test failed! Expected resolveBytecode=true')
			if (solCall) {
				console.log(`   Got: resolveBytecode=${solCall.resolveBytecode}`)
			} else {
				console.log('   No call was recorded')
			}
		}

		// Reset calls
		mockCalls.length = 0

		// Test debug path
		console.log('\nTesting debug output path...')
		const debugDecorator = getScriptSnapshotDecorator(cache)(
			{
				languageServiceHost: {
					getScriptSnapshot: () => null,
				},
				project: {
					getCurrentDirectory: () => '/mock',
				},
			},
			ts as any,
			{
				info: () => {},
				error: () => {},
				warn: () => {},
				log: () => {},
			},
			{ debug: true },
			fao as any,
		)

		// Set up a spy on writeFileSync
		let writeFileCalled = false
		let writeFilePath: string | null = null
		let writeFileContent: string | null = null

		// Override writeFileSync with our spy
		const originalWriteFileSync = fao.writeFileSync
		fao.writeFileSync = (path: string, content: string) => {
			writeFileCalled = true
			writeFilePath = path
			writeFileContent = content
			console.log(`[Debug] writeFileSync called with path: ${path}`)
		}

		// Call with a regular .sol file
		debugDecorator.getScriptSnapshot('/debug.sol')

		// Check if debug file was written
		if (
			writeFileCalled &&
			writeFilePath === '/debug.sol.debug.d.ts' &&
			writeFileContent?.includes('Debug: the following snapshot')
		) {
			console.log('✅ Debug test passed! Debug file was written')
		} else {
			console.log('❌ Debug test failed!')
			console.log(`   writeFileCalled: ${writeFileCalled}`)
			console.log(`   writeFilePath: ${writeFilePath}`)
			if (writeFileContent) {
				console.log(`   writeFileContent starts with: ${writeFileContent.substring(0, 50)}...`)
			} else {
				console.log('   writeFileContent is null')
			}
		}

		// Restore original
		fao.writeFileSync = originalWriteFileSync
	} finally {
		// Restore the original bundler
		bundlerModule.bundler = originalBundler
	}
}

// Run the tests directly
testScriptSnapshotSpecialPaths()
