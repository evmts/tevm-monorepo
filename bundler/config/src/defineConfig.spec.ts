import { DefineConfigError } from './defineConfig.js'
import { type CompilerConfig, defaultConfig, defineConfig } from './index.js'
import { execSync } from 'child_process'
import { flip, runSync } from 'effect/Effect'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('child_process', () => ({
	execSync: vi.fn(),
}))

const mockExecSync = execSync as MockedFunction<typeof execSync>

describe(defineConfig.name, () => {
	beforeEach(() => {
		mockExecSync.mockReset()
	})

	it('should return a valid config when no config is provided', () => {
		const configFactory = () => ({})
		const config = defineConfig(configFactory as any)
		const resolvedConfig = config.configFn('./')
		expect(runSync(resolvedConfig)).toEqual(defaultConfig)
	})

	it('should run forge config --json command when foundryProject is provided', () => {
		const forgeCommandOutput = JSON.stringify({
			solc_version: '0.8.4',
			remappings: [],
			libs: ['lib1', 'lib2'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () =>
			({
				foundryProject: 'forge',
			}) as CompilerConfig
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('./')

		expect(runSync(resolvedConfig)).toEqual({
			remappings: defaultConfig.remappings,
			foundryProject: 'forge',
			libs: ['lib1', 'lib2'],
			debug: false,
		})
		expect(mockExecSync).toHaveBeenCalledWith('forge config --json', {
			cwd: './',
		})
	})

	it('should default forge command to forge', () => {
		const forgeCommandOutput = JSON.stringify({
			solc_version: '0.8.4',
			remappings: [],
			libs: ['lib1', 'lib2'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () => ({
			foundryProject: true,
		})
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('./')

		expect(runSync(resolvedConfig)).toEqual({
			remappings: defaultConfig.remappings,
			foundryProject: true,
			libs: ['lib1', 'lib2'],
			debug: false,
		})
		expect(mockExecSync).toHaveBeenCalledWith('forge config --json', {
			cwd: './',
		})
	})

	it('should resolve remappings to absolute paths', () => {
		const forgeCommandOutput = JSON.stringify({
			remappings: ['key=value'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('/config')

		const res = runSync(resolvedConfig).remappings

		expect(mockExecSync).toBeCalledTimes(1)

		expect(res).toEqual({
			key: '/config/value',
		})
	})

	it('should throw InvalidConfigError if invalid config', () => {
		const configFactory = () =>
			({
				notACorrectKey: true,
			}) as CompilerConfig
		const config = defineConfig(configFactory)
		const configEffect = config.configFn('./')
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(DefineConfigError)
		expect(e._tag).toBe('InvalidConfigError')
		expect(e.name).toBe('InvalidConfigError')
		expect(e.message).toMatchInlineSnapshot(`
			"InvalidConfigError: Unable to resolve EVMts CompilerConfig at ./
			Invalid EVMts CompilerConfig detected"
		`)
	})

	it('should throw FoundryNotFoundError when forge command fails', () => {
		mockExecSync.mockImplementationOnce(() => {
			throw new Error()
		})

		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)
		const configEffect = config.configFn('./')
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(DefineConfigError)
		expect(e._tag).toBe('FoundryNotFoundError')
		expect(e.name).toBe('FoundryNotFoundError')
		expect(e.message).toMatchInlineSnapshot(`
			"FoundryNotFoundError: Unable to resolve EVMts CompilerConfig at ./
			Failed to resolve forge config using \\"forge config --json\\" command. Make sure forge is installed and accessible and forge config --json works.
			note: forge is used to fetch remappings only if forgeConfig is set. If you would prefer to not use forge you can set remappings
			or lib directly in your EVMts compiler config and then EVMts will run without forge"
		`)
	})

	it('should throw FoundryConfigError when forge command output is not valid JSON', () => {
		mockExecSync.mockReturnValue('{"invalid JSON`{')
		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)
		const configEffect = config.configFn('./')
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(DefineConfigError)
		expect(e._tag).toBe('FoundryConfigError')
		expect(e.name).toBe('FoundryConfigError')
		expect(e.message).toMatchInlineSnapshot(`
			"FoundryConfigError: Unable to resolve EVMts CompilerConfig at ./
			Unable to resolve foundry config using forge config --json"
		`)
	})

	it('should throw InvalidRemappingsError when forge remappings format is incorrect', () => {
		const forgeCommandOutput = JSON.stringify({
			remappings: ['invalid=remapping=format'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)
		const configEffect = config.configFn('./')
		const errorChannel = flip(configEffect)
		const e = runSync(errorChannel)
		expect(e).toBeInstanceOf(DefineConfigError)
		expect(e._tag).toBe('InvalidRemappingsError')
		expect(e.name).toBe('InvalidRemappingsError')
		expect(e.message).toMatchInlineSnapshot(`
			"InvalidRemappingsError: Unable to resolve EVMts CompilerConfig at ./
			Invalid remappings: invalid=remapping=format"
		`)
	})
})
