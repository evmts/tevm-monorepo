import { describe, expect, it } from 'vitest'

import {
	NoPluginFoundError,
	getEvmtsConfigFromTsConfig,
} from './getEvmtsConfigFromTsConfig.js'
import { runSync } from 'effect/Effect'

describe(getEvmtsConfigFromTsConfig, () => {
	it('should return the expected ResolvedConfig', async () => {
		let evmtsConfig = {
			name: '@evmts/ts-plugin',
			libs: ['lib1', 'lib2'],
		}
		let config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					evmtsConfig,
				],
			},
		}
		expect(runSync(getEvmtsConfigFromTsConfig(config))).toEqual(evmtsConfig)
		// remove lib should still work
		evmtsConfig = {
			name: '@evmts/ts-plugin',
			libs: undefined,
		} as any
		config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					evmtsConfig,
				],
			},
		}
		expect(runSync(getEvmtsConfigFromTsConfig(config))).toEqual(evmtsConfig)
	})
	it('should add baseUrl to lib if it exists', async () => {
		const evmtsConfig = {
			name: '@evmts/ts-plugin',
			libs: ['lib1', 'lib2'],
		}
		const config = {
			compilerOptions: {
				baseUrl: './src',
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
					evmtsConfig,
				],
			},
		}
		expect(runSync(getEvmtsConfigFromTsConfig(config))).toEqual({
			...evmtsConfig,
			libs: [config.compilerOptions.baseUrl, ...evmtsConfig.libs],
		})
	})
	it(`should throw a ${NoPluginFoundError} if there is no plugins`, async () => {
		const config = {
			compilerOptions: {
				baseUrl: '.',
			},
		}
		expect(() =>
			runSync(getEvmtsConfigFromTsConfig(config as any)),
		).toThrowError(
			new NoPluginFoundError('No compilerOptions.plugins in tsconfig'),
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
		expect(() => runSync(getEvmtsConfigFromTsConfig(config))).toThrowError(
			new NoPluginFoundError(),
		)
	})
	it(`should throw a ${NoPluginFoundError} if there is no plugin matching @evmts/ts-plugin`, async () => {
		const config = {
			compilerOptions: {
				plugins: [
					{
						name: 'css-modules-typescript-loader',
					},
				],
			},
		}
		expect(() => runSync(getEvmtsConfigFromTsConfig(config))).toThrowError(
			new NoPluginFoundError(),
		)
	})
})
