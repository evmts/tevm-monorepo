import { getSolidityCompilerSync } from './loadSolidityCompilerSync'
import * as assert from 'node:assert'
import { describe, it } from 'node:test'

describe('getSolidityCompilerSync', () => {
	it('should return the solidity compiler', () => {
		assert.equal(typeof getSolidityCompilerSync(), 'object')
	})

	it('should have the compile function', () => {
		assert.equal(typeof getSolidityCompilerSync().compile, 'function')
	})

	it('should have the version function', () => {
		assert.equal(getSolidityCompilerSync().version().startsWith('0.8.13'), true)
	})

	it('the version function should return the version', () => {
		const versionRegex = /0\.8\.13\+commit\.[a-zA-Z0-9]+\.Emscripten\.clang/
		const version = getSolidityCompilerSync().version()
		assert.equal(versionRegex.test(version), true)
	})
})
