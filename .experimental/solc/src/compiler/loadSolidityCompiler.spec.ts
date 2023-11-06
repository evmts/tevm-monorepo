import { getSolidityCompiler } from './loadSolidityCompiler'
import * as assert from 'node:assert'
import { describe, it } from 'node:test'

describe('getSolidityCompiler', async () => {
	it('should return the solidity compiler', async () => {
		assert.equal(typeof getSolidityCompiler(), 'object')
	})

	it('should have the compile function', async () => {
		const solidityModule = await getSolidityCompiler('0.8.21')
		assert.equal(typeof solidityModule.compile, 'function')
	})

	it('should have the version function', async () => {
		const solidityModule = await getSolidityCompiler('0.8.21')
		assert.equal(typeof solidityModule.version, 'function')
	})

	it('the version function should return the version', async () => {
		const solidityModule = await getSolidityCompiler('0.8.21')
		const versionRegex = /0\.8\.21\+commit\.[a-zA-Z0-9]+\.Emscripten\.clang/
		const version = solidityModule.version()
		assert.equal(versionRegex.test(version), true)
	})

	it('the version function should return a 0.8.13 if no version is specified', async () => {
		const solidityModule = await getSolidityCompiler()
		const versionRegex = /0\.8\.13\+commit\.[a-zA-Z0-9]+\.Emscripten\.clang/
		const version = solidityModule.version()
		assert.equal(versionRegex.test(version), true)
	})
})
