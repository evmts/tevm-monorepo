import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { runSync } from 'effect/Effect'
import { beforeEach, describe, expect, it, type MockedFunction, vi } from 'vitest'
import {
	FoundryConfigError,
	FoundryNotFoundError,
	InvalidRemappingsError,
	loadFoundryConfig,
} from './loadFoundryConfig.js'

vi.mock('child_process', async () => ({
	execSync: vi.fn(),
}))

const mockExecSync = execSync as MockedFunction<typeof execSync>
const foundryFixture = join(__dirname, '..', 'fixtures', 'withFoundry')

describe(loadFoundryConfig.name, () => {
	beforeEach(() => {
		mockExecSync.mockReset()
	})
	it('should return the remappings from foundry', async () => {
		const { execSync } = (await vi.importActual('child_process')) as any
		mockExecSync.mockImplementationOnce(execSync)
		let res = runSync(loadFoundryConfig('forge', foundryFixture))
		expect(res.libs).toEqual(['lib'])
		expect(res.remappings?.['@solmate-utils/']).toContain('lib/solmate/src/utils/')
		expect(mockExecSync).lastCalledWith('forge config --json', {
			cwd: foundryFixture,
		})
		mockExecSync.mockImplementationOnce(execSync)
		res = runSync(loadFoundryConfig(true, foundryFixture))
		expect(res.libs).toEqual(['lib'])
		expect(res.remappings?.['@solmate-utils/']).toContain('lib/solmate/src/utils/')
		expect(mockExecSync).lastCalledWith('forge config --json', {
			cwd: foundryFixture,
		})
		expect(mockExecSync).lastCalledWith('forge config --json', {
			cwd: foundryFixture,
		})
	})

	it('should return an empty config if no foundryProject is passed in', () => {
		mockExecSync.mockImplementationOnce((vi.importActual('child_process') as any).execSync)
		expect(runSync(loadFoundryConfig(undefined, foundryFixture))).toEqual({})
		expect(runSync(loadFoundryConfig(false, join(__dirname, '..', 'fixtures', 'withFoundry')))).toEqual({})
	})

	it(`should throw ${FoundryNotFoundError.name} if command is not found`, () => {
		mockExecSync.mockImplementationOnce((vi.importActual('child_process') as any).execSync)
		expect(() => runSync(loadFoundryConfig('notforgecommand', foundryFixture))).toThrowErrorMatchingInlineSnapshot(`
			[(FiberFailure) Error: Failed to resolve forge config using "notforgecommand config --json" command. Make sure forge is installed and accessible and forge config --json works.
			note: forge is used to fetch remappings only if forgeConfig is set. If you would prefer to not use forge you can set remappings
			or lib directly in your Tevm compiler config and then Tevm will run without forge]
		`)
	})

	it(`should throw ${FoundryConfigError.name} in unlikely event foundry returns invalid json`, () => {
		mockExecSync.mockImplementationOnce(() => {
			return `
[profile.default]
not-a-json
				`
		})
		expect(() => runSync(loadFoundryConfig('forge', foundryFixture))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) Error: Unable to resolve foundry config using forge config --json]',
		)
	})

	it(`should throw ${InvalidRemappingsError.name} in unlikey event foundry returns remappings not formatted as expected`, () => {
		const remap = 'not-fromatted-as-expected'
		mockExecSync.mockImplementationOnce(() => {
			return JSON.stringify({
				remappings: [remap],
			})
		})
		expect(() => runSync(loadFoundryConfig('forge', foundryFixture))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) Error: Invalid remappings: not-fromatted-as-expected]',
		)
	})
})
