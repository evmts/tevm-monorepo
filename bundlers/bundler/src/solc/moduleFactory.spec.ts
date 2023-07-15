import type { ModuleInfo } from '../types'
import { moduleFactory } from './moduleFactory'
import { readFileSync } from 'fs'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('fs', () => ({
	readFileSync: vi.fn(),
}))
const mockReadFileSync = readFileSync as Mock

describe('moduleFactory', () => {
	const remappings = {
		'key1/': '/path/to/key1',
		'key2/': '/path/to/key2',
	} as const

	const testModuleCode = `import "key1/somefile"
                            import "./localfile"
                            import "othermodule"`

	const absolutePath = '/project/src/testModule.sol'

	const localfileMockContent = 'contract LocalFile {}'
	const key1MockContent = 'contract Key1 {}'
	const othermoduleMockContent = 'contract OtherModule {}'

	let testModule: ModuleInfo

	beforeEach(() => {
		mockReadFileSync
			.mockReturnValueOnce(localfileMockContent)
			.mockReturnValueOnce(key1MockContent)
			.mockReturnValueOnce(othermoduleMockContent)

		testModule = moduleFactory(absolutePath, testModuleCode, remappings, [
			'../node_modules',
		])
	})

	it('should correctly resolve import paths', () => {
		expect(testModule.importedIds).toMatchInlineSnapshot(`
      [
        "/path/to/key1somefile",
      ]
    `)
	})

	it('should correctly replace import statements in code', () => {
		expect(testModule.code).toMatchInlineSnapshot(`
      "import \\"/path/to/key1somefile\\"
                                  import \\"./localfile\\"
                                  import \\"othermodule\\""
    `)
	})

	it('should correctly resolve module dependencies', () => {
		expect(testModule.resolutions.map((r) => r.id)).toMatchInlineSnapshot(`
      [
        "/path/to/key1somefile",
      ]
    `)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})
})
