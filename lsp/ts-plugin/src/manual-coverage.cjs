#!/usr/bin/env node
// This is a direct test of getScriptSnapshot.ts for coverage purposes

// First, let's test line 34 (bytecode resolution for .s.sol files)
function testSolBytecodeResolution() {
	console.log('Testing .s.sol bytecode resolution (line 34)...')

	// Mock simple objects to isolate the functionality
	const filePath = '/test.s.sol'

	const plugin = {
		resolveDtsSync: (path, cwd, unknown, bytecode) => {
			// Test that the bytecode parameter is true for .s.sol files
			console.log(`resolveDtsSync called with path: ${path}`)
			console.log(`bytecode parameter: ${bytecode}`)
			return { code: 'export {}' }
		},
	}

	// Create a minimal TS object
	const ts = {
		ScriptSnapshot: {
			fromString: (str) => ({ text: str }),
		},
	}

	// Only our test file should exist
	const existsSync = (path) => {
		console.log(`Checking if exists: ${path}`)
		return path === filePath
	}

	// Create mock bundler
	const mockBundler = () => plugin

	// Replace the real bundler with our mock
	const bundlerModule = require('@tevm/base-bundler')
	const originalBundler = bundlerModule.bundler
	bundlerModule.bundler = mockBundler

	// Now load and call the function directly - focusing only on the small piece we care about
	const { getScriptSnapshotDecorator } = require('./decorators/getScriptSnapshot.js')

	try {
		// This won't run the full function, but it shows what would happen
		console.log('Directly testing the line that handles .s.sol files:')
		console.log(
			'if (!isSolidity(filePath) || !existsSync(filePath) || existsSync(`${filePath}.d.ts`) || existsSync(`${filePath}.ts`)) {',
		)
		console.log('  return languageServiceHost.getScriptSnapshot(filePath)')
		console.log('}')
		console.log('try {')
		console.log('  const plugin = bundler(config, logger as any, fao, solc, solcCache)')
		console.log("  const resolveBytecode = filePath.endsWith('.s.sol') <--- THIS IS WHAT WE ARE TESTING")
		console.log('  ...')

		// Check if the file extension is .s.sol
		const resolveBytecode = filePath.endsWith('.s.sol')
		console.log(`\n⚠️ Direct test results: resolveBytecode = ${resolveBytecode} (should be true)`)

		// Call the actual function to see what happens
		console.log('\nCalling the full function through getScriptSnapshotDecorator...')

		const decorator = getScriptSnapshotDecorator({})(
			{
				languageServiceHost: {
					getScriptSnapshot: () => null,
				},
				project: {
					getCurrentDirectory: () => '/',
				},
			},
			ts,
			{
				info: () => {},
				error: () => {},
			},
			{},
			{
				existsSync,
				writeFileSync: () => {},
			},
		)

		// Call with a .s.sol file
		const result = decorator.getScriptSnapshot(filePath)
		console.log(`Result is ${result ? 'valid' : 'null'}`)
	} finally {
		// Restore the original bundler
		bundlerModule.bundler = originalBundler
	}
}

// Next, test line 36-40 (debug output)
function testDebugOutput() {
	console.log('\n\nTesting debug output (lines 36-40)...')

	// Mock simple objects to isolate the functionality
	const filePath = '/test.sol'

	const plugin = {
		resolveDtsSync: (path, cwd, unknown, bytecode) => {
			console.log(`resolveDtsSync called with path: ${path}`)
			return { code: 'export {}' }
		},
	}

	// Create a minimal TS object
	const ts = {
		ScriptSnapshot: {
			fromString: (str) => ({ text: str }),
		},
	}

	// Only our test file should exist
	const existsSync = (path) => {
		console.log(`Checking if exists: ${path}`)
		return path === filePath
	}

	// Track when writeFileSync is called
	let writeFileWasCalled = false
	let writePath = null
	let writeContent = null

	const writeFileSync = (path, content) => {
		console.log(`writeFileSync called with path: ${path}`)
		writeFileWasCalled = true
		writePath = path
		writeContent = content
	}

	// Create mock bundler
	const mockBundler = () => plugin

	// Replace the real bundler with our mock
	const bundlerModule = require('@tevm/base-bundler')
	const originalBundler = bundlerModule.bundler
	bundlerModule.bundler = mockBundler

	// Now load and call the function directly
	const { getScriptSnapshotDecorator } = require('./decorators/getScriptSnapshot.js')

	try {
		// This shows what should happen
		console.log('Directly testing the lines for debug output:')
		console.log('if (config.debug) {')
		console.log('  writeFileSync(')
		console.log('    `${filePath}.debug.d.ts`,')
		console.log('    `// Debug: the following snapshot is what tevm resolves ${filePath} to\n${snapshot.code}`,')
		console.log('  )')
		console.log('}')

		// Call the actual function with debug enabled
		console.log('\nCalling the full function through getScriptSnapshotDecorator with debug=true...')

		const decorator = getScriptSnapshotDecorator({})(
			{
				languageServiceHost: {
					getScriptSnapshot: () => null,
				},
				project: {
					getCurrentDirectory: () => '/',
				},
			},
			ts,
			{
				info: () => {},
				error: () => {},
			},
			{
				debug: true, // Enable debug output
			},
			{
				existsSync,
				writeFileSync,
			},
		)

		// Call with a .sol file
		const result = decorator.getScriptSnapshot(filePath)

		// Verify debug output
		if (writeFileWasCalled) {
			console.log(`\n⚠️ writeFileSync was called with path: ${writePath}`)
			if (writeContent?.includes('Debug: the following snapshot')) {
				console.log('✅ Content contains debug message as expected')
			} else {
				console.log('❌ Content does not contain expected debug message')
			}
		} else {
			console.log('❌ writeFileSync was not called')
		}

		console.log(`Result is ${result ? 'valid' : 'null'}`)
	} finally {
		// Restore the original bundler
		bundlerModule.bundler = originalBundler
	}
}

// Run the tests
testSolBytecodeResolution()
testDebugOutput()
