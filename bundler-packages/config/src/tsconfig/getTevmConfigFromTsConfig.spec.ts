import { describe, expect, it } from 'vitest'

import {
	NoPluginInTsConfigFoundError,
	getTevmConfigFromTsConfig,
} from './getTevmConfigFromTsConfig.js'
import { runSync } from 'effect/Effect'

describe(getTevmConfigFromTsConfig, () => {
	it('should return the expected ResolvedConfig', async () => {
		let tevmConfig = {
			name: '@tevm/ts-plugin',
			libs: ['lib1', 'lib2'],
		}
		let config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					tevmConfig,
				],
			},
		}
		expect(
			runSync(getTevmConfigFromTsConfig(config, '/path/to/config')),
		).toEqual({ ...tevmConfig, remappings: {} })
		// remove lib should still work
		tevmConfig = {
			name: '@tevm/ts-plugin',
			libs: undefined,
		} as any
		config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					tevmConfig,
				],
			},
		}
		expect(
			runSync(getTevmConfigFromTsConfig(config, '/path/to/config')),
		).toEqual({ ...tevmConfig, remappings: {} })
	})
	it('should add paths to lib if it exists', async () => {
		const tevmConfig = {
			name: '@tevm/ts-plugin',
			libs: ['lib1', 'lib2'],
		}
		const config = {
			compilerOptions: {
				baseUrl: './src',
				paths: {
					'@/*': ['./*'],
				},
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					tevmConfig,
				],
			},
		}
		const configPath = '/path/to/config'
		expect(runSync(getTevmConfigFromTsConfig(config, configPath))).toEqual({
			...tevmConfig,
			remappings: {
				'@/': `${configPath}/`,
			},
			libs: [config.compilerOptions.baseUrl, ...tevmConfig.libs],
		})
	})
	it('should add paths to lib if it exists', async () => {
		const tevmConfig = {
			name: '@tevm/ts-plugin',
			libs: ['lib1', 'lib2'],
		}
		const config = {
			compilerOptions: {
				baseUrl: './src',
				paths: {
					'@/*': ['./*'],
				},
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					tevmConfig,
				],
			},
		}
		expect(
			runSync(getTevmConfigFromTsConfig(config, '/path/to/config')),
		).toEqual({
			...tevmConfig,
			remappings: {
				'@/': '/path/to/config/',
			},
			libs: [config.compilerOptions.baseUrl, ...tevmConfig.libs],
		})
	})
	it('should add baseUrl to lib if it exists', async () => {
		const tevmConfig = {
			name: '@tevm/ts-plugin',
			libs: ['lib1', 'lib2'],
		}
		const config = {
			compilerOptions: {
				baseUrl: './src',
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					tevmConfig,
				],
			},
		}
		expect(
			runSync(getTevmConfigFromTsConfig(config, '/path/to/config')),
		).toEqual({
			...tevmConfig,
			remappings: {},
			libs: [config.compilerOptions.baseUrl, ...tevmConfig.libs],
		})
	})
	it(`should throw a ${NoPluginInTsConfigFoundError} if there is no plugins`, async () => {
		const config = {
			compilerOptions: {
				baseUrl: '.',
			},
		}
		expect(() =>
			runSync(getTevmConfigFromTsConfig(config as any, '/path/to/config')),
		).toThrowError(
			new NoPluginInTsConfigFoundError(
				'No compilerOptions.plugins in tsconfig',
			),
		)
	})
	it('should handle foundry returning an invalid json', async () => {
		const config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
				],
			},
		}
		expect(() =>
			runSync(getTevmConfigFromTsConfig(config, '/path/to/config')),
		).toThrowError(new NoPluginInTsConfigFoundError())
	})
	it(`should throw a ${NoPluginInTsConfigFoundError} if there is no plugin matching @tevm/ts-plugin`, async () => {
		const config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
				],
			},
		}
		expect(() =>
			runSync(getTevmConfigFromTsConfig(config, '/path/to/config')),
		).toThrowError(new NoPluginInTsConfigFoundError())
	})
})
