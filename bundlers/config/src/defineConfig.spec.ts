import { defineConfig } from '.'
import { type EvmtsConfig, defaultConfig } from './Config'
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
				compiler: {
					solcVersion: '0.8.4',
				},
			}) as EvmtsConfig
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('./')
		expect(resolvedConfig).toEqual({
			compiler: {
				solcVersion: '0.8.4',
				remappings: defaultConfig.compiler.remappings,
				foundryProject: defaultConfig.compiler.foundryProject,
				libs: defaultConfig.compiler.libs,
			},
			localContracts: defaultConfig.localContracts,
			externalContracts: defaultConfig.externalContracts,
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
				compiler: {
					foundryProject: 'forge',
				},
			}) as EvmtsConfig
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('./')

		expect(mockExecSync).toHaveBeenCalledWith('forge config --json')
		expect(resolvedConfig).toEqual({
			compiler: {
				solcVersion: '0.8.4',
				remappings: defaultConfig.compiler.remappings,
				foundryProject: 'forge',
				libs: ['lib1', 'lib2'],
			},
			localContracts: defaultConfig.localContracts,
			externalContracts: defaultConfig.externalContracts,
		})
	})

	it('should default forge command to forge', () => {
		const forgeCommandOutput = JSON.stringify({
			solc_version: '0.8.4',
			remappings: [],
			libs: ['lib1', 'lib2'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () =>
			({
				compiler: {
					foundryProject: true,
				},
			}) as EvmtsConfig
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('./')

		expect(mockExecSync).toHaveBeenCalledWith('forge config --json')
		expect(resolvedConfig).toEqual({
			compiler: {
				solcVersion: '0.8.4',
				remappings: defaultConfig.compiler.remappings,
				foundryProject: true,
				libs: ['lib1', 'lib2'],
			},
			localContracts: defaultConfig.localContracts,
			externalContracts: defaultConfig.externalContracts,
		})
	})

	it('should throw error when forge command fails', () => {
		mockExecSync.mockImplementationOnce(() => {
			throw new Error()
		})

		const configFactory = () =>
			({
				compiler: {
					foundryProject: 'forge',
				},
			}) as EvmtsConfig
		const config = defineConfig(configFactory)

		expect(() => config.configFn('./')).toThrow(
			'Failed to run forge using forge command. Make sure forge is installed and accessible and forge config --json works',
		)
	})

	it('should throw error when forge command output is not valid JSON', () => {
		mockExecSync.mockReturnValueOnce(Buffer.from('invalid JSON'))

		const configFactory = () =>
			({
				compiler: {
					foundryProject: 'forge',
				},
			}) as EvmtsConfig
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
				compiler: {
					foundryProject: 'forge',
				},
			}) as EvmtsConfig
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
				compiler: {
					foundryProject: 'forge',
				},
			}) as EvmtsConfig
		const config = defineConfig(configFactory)
		const resolvedConfig = config.configFn('/config')

		expect(resolvedConfig.compiler.remappings).toEqual({
			key: '/config/value',
		})
	})

	it('should merge provided apiKeys with default apiKeys', () => {
		const configFactory = () =>
			({
				externalContracts: {
					out: 'path/to/out',
					contracts: [],
					apiKeys: {
						etherscan: {
							1: 'provided-key',
						},
					},
				},
			}) satisfies EvmtsConfig
		const config = defineConfig(configFactory as any)
		const resolvedConfig = config.configFn('./')

		expect(resolvedConfig.externalContracts.apiKeys).toMatchInlineSnapshot(`
			{
			  "etherscan": {
			    "1": "provided-key",
			    "10": undefined,
			    "137": undefined,
			    "42161": undefined,
			    "56": undefined,
			  },
			}
		`)
	})

	it('should throw an error if apiKeys is invalid', () => {
		const configFactory = () => ({
			externalContracts: {
				out: 'path/to/out',
				contracts: [],
				apiKeys: {
					// Missing the 'etherscan' key
					someOtherKey: {
						1: 'provided-key',
					},
				},
			},
		})
		const config = defineConfig(configFactory as any)

		expect(() => config.configFn('./')).toThrowErrorMatchingInlineSnapshot(
			'"Invalid config file ./: {\\"_errors\\":[],\\"externalContracts\\":{\\"_errors\\":[],\\"apiKeys\\":{\\"_errors\\":[\\"Unrecognized key(s) in object: \'someOtherKey\'\\"]}}}"',
		)
	})

	it('should throw an error when invalid apiKeys are provided', () => {
		const invalidApiKey = false

		const configFactory = () => ({
			externalContracts: {
				apiKeys: {
					etherscan: {
						'1': invalidApiKey,
						'10': invalidApiKey,
						'56': invalidApiKey,
						'137': invalidApiKey,
						'42161': invalidApiKey,
					},
				},
			},
		})
		const config = defineConfig(configFactory as any)
		expect(() => config.configFn('./')).toThrowErrorMatchingInlineSnapshot(
			'"Invalid config file ./: {\\"_errors\\":[],\\"externalContracts\\":{\\"_errors\\":[],\\"apiKeys\\":{\\"_errors\\":[],\\"etherscan\\":{\\"1\\":{\\"_errors\\":[\\"Expected string, received boolean\\"]},\\"10\\":{\\"_errors\\":[\\"Expected string, received boolean\\"]},\\"56\\":{\\"_errors\\":[\\"Expected string, received boolean\\"]},\\"137\\":{\\"_errors\\":[\\"Expected string, received boolean\\"]},\\"42161\\":{\\"_errors\\":[\\"Expected string, received boolean\\"]},\\"_errors\\":[]}},\\"contracts\\":{\\"_errors\\":[\\"Required\\"]},\\"out\\":{\\"_errors\\":[\\"Required\\"]}}}"',
		)
	})
})
