import type { ModuleInfo } from '../types'
import { moduleFactory } from './moduleFactory'
import { readFileSync } from 'fs'
import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

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
import "./anotherLocalFile"
import "othermodule"
import "otherOthermodule"`

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
			  "/project/src/localfile",
			  "/project/src/anotherLocalFile",
			  "othermodule",
			  "otherOthermodule",
			]
		`)
	})

	it('should correctly replace import statements in code', () => {
		expect(testModule.code).toMatchInlineSnapshot(`
			"import \\"/path/to/key1somefile\\"
			import \\"/project/src/localfile\\"
			import \\"/project/src/anotherLocalFile\\"
			import \\"othermodule\\"
			import \\"otherOthermodule\\""
		`)
	})

	it('should correctly resolve module dependencies', () => {
		expect(testModule.resolutions.map((r) => r.id)).toMatchInlineSnapshot(`
			[
			  "/path/to/key1somefile",
			  "/project/src/localfile",
			  "/project/src/anotherLocalFile",
			  "othermodule",
			  "otherOthermodule",
			]
		`)
	})

	it('should not replace import statements if resolveImportPath returns the original import', () => {
		// This import path does not start with a remapping key, is not local, and cannot be resolved by Node
		const testModuleCodeUnresolvedImport = `import "unresolved/import"`
		const unresolvedImportMockContent = 'contract UnresolvedImport {}'

		mockReadFileSync
			.mockReturnValueOnce(unresolvedImportMockContent)
			.mockReturnValueOnce(key1MockContent)
			.mockReturnValueOnce(othermoduleMockContent)

		const testModuleUnresolvedImport = moduleFactory(
			absolutePath,
			testModuleCodeUnresolvedImport,
			remappings,
			['../node_modules'],
		)

		// Update the expected snapshot to reflect the change.
		// The snapshot string might need to be adjusted based on the actual output of your function.
		expect(testModuleUnresolvedImport.code).toMatchInlineSnapshot(`
    "import \\"unresolved/import\\""
  `)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})
})
