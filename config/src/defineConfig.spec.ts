import { defineConfig } from '.'
import { defaultConfig, type CompilerConfig } from './Config'
import { execSync } from 'child_process'
import { type MockedFunction, describe, expect, it, vi } from 'vitest'

vi.mock('child_process', () => ({
	execSync: vi.fn(),
}))

const mockExecSync = execSync as MockedFunction<typeof execSync>

describe(defineConfig.name, () => {
	it('should return a valid config when no config is provided', () => {
		const configFactory = () => undefined
		const config = defineConfig(configFactory as any)
		const resolvedConfig = config.configFn('./')
		expect(resolvedConfig).toEqual(defaultConfig)
	})

	it('should return a valid config when partial config is provided', () => {
		const configFactory = () =>
			({
				solcVersion: '0.8.4',
			}) as CompilerConfig
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('./')
		expect(resolvedConfig).toEqual({
			solcVersion: '0.8.4',
			remappings: defaultConfig.remappings,
			foundryProject: defaultConfig.foundryProject,
			libs: defaultConfig.libs,
		})
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

		expect(mockExecSync).toHaveBeenCalledWith('forge config --json')
		expect(resolvedConfig).toEqual({
			solcVersion: '0.8.4',
			remappings: defaultConfig.remappings,
			foundryProject: 'forge',
			libs: ['lib1', 'lib2'],
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

		expect(mockExecSync).toHaveBeenCalledWith('forge config --json')
		expect(resolvedConfig).toEqual({
			solcVersion: '0.8.4',
			remappings: defaultConfig.remappings,
			foundryProject: true,
			libs: ['lib1', 'lib2'],
		})
	})

	it('should throw if invalid config', () => {
		const configFactory = () =>
			({
				solcVersion: '0.8.4',
				notACorrectKey: true,
			}) as CompilerConfig
		const config = defineConfig(configFactory)
		expect(() => config.configFn('./')).toThrowErrorMatchingInlineSnapshot('"Invalid config file ./: {\\"_errors\\":[\\"Unrecognized key(s) in object: \'notACorrectKey\'\\"]}"')
	})

	it('should throw error when forge command fails', () => {
		mockExecSync.mockImplementationOnce(() => {
			throw new Error()
		})

		const configFactory = () =>
		({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)

		expect(() => config.configFn('./')).toThrow(
			'Failed to run forge using forge command. Make sure forge is installed and accessible and forge config --json works',
		)
	})

	it('should throw error when forge command output is not valid JSON', () => {
		mockExecSync.mockReturnValueOnce(Buffer.from('invalid JSON'))

		const configFactory = () =>
		({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)

		expect(() => config.configFn('./')).toThrow(
			'Failed to parse the output of forge config command. The command output is not a valid JSON.',
		)
	})

	it('should throw error when forge remappings format is incorrect', () => {
		const forgeCommandOutput = JSON.stringify({
			remappings: ['invalid=remapping=format'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () =>
		({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)

		expect(() => config.configFn('./')).toThrow(
			'Invalid format for remapping: invalid=remapping=format. It should be in the format key=value.',
		)
	})

	it('should resolve remappings to absolute paths', () => {
		const forgeCommandOutput = JSON.stringify({
			remappings: ['key=value'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () =>
		({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('/config')

		expect(resolvedConfig.remappings).toEqual({
			key: '/config/value',
		})
	})
})
