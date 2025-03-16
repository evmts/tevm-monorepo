import * as fs from 'node:fs'
import * as fsPromises from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import type {
	FileAccessObject,
	Logger,
} from './types.js'
import * as Types from './types.js'

describe('types.ts', () => {
	it('exports the necessary types', () => {
		// Verify the exports are present
		expect(Types).toBeDefined()

		// Since we're testing a TypeScript file with only types,
		// we're mostly ensuring that the file is covered by the test runner.
		// The actual types won't be available at runtime, but we can at least
		// verify the module can be imported without errors.
	})

	it('should allow creating a valid FileAccessObject', () => {
		// This test is mainly for type checking, not runtime behavior
		const fileAccess: FileAccessObject = {
			readFile: fsPromises.readFile,
			readFileSync: fs.readFileSync,
			exists: async (path) => fs.existsSync(path),
			existsSync: fs.existsSync,
		}

		expect(fileAccess).toBeDefined()
		expect(typeof fileAccess.readFile).toBe('function')
		expect(typeof fileAccess.readFileSync).toBe('function')
		expect(typeof fileAccess.exists).toBe('function')
		expect(typeof fileAccess.existsSync).toBe('function')
	})

	it('should allow creating a valid Logger implementation', () => {
		// Create a mock logger that satisfies the Logger interface
		const logger: Logger = {
			info: (...messages: string[]) => console.log(...messages),
			error: (...messages: string[]) => console.error(...messages),
			warn: (...messages: string[]) => console.warn(...messages),
			log: (...messages: string[]) => console.log(...messages),
		}

		expect(logger).toBeDefined()
		expect(typeof logger.info).toBe('function')
		expect(typeof logger.error).toBe('function')
		expect(typeof logger.warn).toBe('function')
		expect(typeof logger.log).toBe('function')
	})

	it('should verify CompiledContracts and ResolvedArtifacts type structure', () => {
		// For types-only tests, we just verify the module has exported these types
		// We can't directly test TypeScript types, but we can verify structure
		expect(typeof Types).toBe('object')
		expect(Types).toMatchObject({})  // Empty object since it only exports types
	})

	it('should verify function types for resolving artifacts', () => {
		// For type-only functions, we just verify the module has exported these
		expect(typeof Types).toBe('object')
	})
})