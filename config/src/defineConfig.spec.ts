import { type CompilerConfig, defaultConfig, defineConfig } from './index.js'
import { execSync } from 'child_process'
import { runSync } from 'effect/Effect'
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
		})
		expect(mockExecSync).toHaveBeenCalledWith('forge config --json', {
			cwd: './',
		})
	})

	it('should throw if invalid config', () => {
		const configFactory = () =>
			({
				notACorrectKey: true,
			}) as CompilerConfig
		const config = defineConfig(configFactory)
		expect(() => runSync(config.configFn('./'))).toThrowErrorMatchingSnapshot()
	})

	it('should throw error when forge command fails', () => {
		mockExecSync.mockImplementationOnce(() => {
			throw new Error()
		})

		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)

		expect(() => runSync(config.configFn('./'))).toThrowErrorMatchingSnapshot()
	})

	it('should throw error when forge command output is not valid JSON', () => {
		mockExecSync.mockReturnValue('{"invalid JSON`{')

		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)

		expect(() => runSync(config.configFn('./'))).toThrowErrorMatchingSnapshot()
	})

	it('should throw error when forge remappings format is incorrect', () => {
		const forgeCommandOutput = JSON.stringify({
			remappings: ['invalid=remapping=format'],
		})
		mockExecSync.mockReturnValueOnce(Buffer.from(forgeCommandOutput))

		const configFactory = () => ({
			foundryProject: 'forge',
		})
		const config = defineConfig(configFactory)

		expect(() => runSync(config.configFn('./'))).toThrowErrorMatchingSnapshot()
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
})
