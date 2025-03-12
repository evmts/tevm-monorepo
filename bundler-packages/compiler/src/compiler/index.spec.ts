import { describe, expect, it } from 'vitest'
import * as CompilerExports from './index.js'

describe('compiler/index.js', () => {
	it('exports compileContract', () => {
		expect(CompilerExports.compileContract).toBeDefined()
	})

	it('exports compileContractSync', () => {
		expect(CompilerExports.compileContractSync).toBeDefined()
	})
})
