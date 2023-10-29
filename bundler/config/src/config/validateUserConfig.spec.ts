import { describe, expect, it } from 'vitest'

import type { CompilerConfig } from '../types.js'
import {
	ConfigFnThrowError,
	InvalidConfigError,
	validateUserConfig,
} from './validateUserConfig.js'
import { runSync } from 'effect/Effect'

describe(validateUserConfig.name, () => {
	it('should return the CompilerConfig if it is valid', () => {
		const validConfigs: Array<CompilerConfig> = [
			{
				foundryProject: true,
				remappings: { foo: 'bar' },
				libs: ['lib1', 'lib2'],
			},
			{
				foundryProject: '../forge',
				remappings: { foo: 'bar' },
				libs: ['lib1', 'lib2'],
			},
			{
				foundryProject: false,
				remappings: { foo: 'bar' },
				libs: ['lib1', 'lib2'],
			},
			{ foundryProject: false, remappings: { foo: 'bar' } },
			{ foundryProject: false, libs: ['lib1', 'lib2'] },
			{ remappings: { foo: 'bar' }, libs: ['lib1', 'lib2'] },
			{ foundryProject: false },
			{ libs: ['lib1', 'lib2'] },
			{ libs: [] },
			{ remappings: { foo: 'bar' } },
			{ remappings: {} },
			{ remappings: undefined, foundryProject: undefined, libs: undefined },
			{},
		]
		validConfigs.forEach((config) => {
			console.log(config)
			expect(runSync(validateUserConfig(() => config))).toEqual(config)
		})
	})

	it(`should throw an ${InvalidConfigError.name} if the config is invalid`, () => {
		const invalidConfig: Array<any> = [
			'foo',
			true,
			false,
			undefined,
			null,
			{ foundryProject: 5 },
			{ remappings: '{foo: "bar"}' },
			{ remappings: [] },
			{ libs: { lib: 'lib1' } },
			{ unknownProperty: 'foo' },
		]
		invalidConfig.forEach((config) => {
			expect(() => runSync(validateUserConfig(() => config))).toThrowError(
				new InvalidConfigError(),
			)
		})
	})

	it(`should throw an ${ConfigFnThrowError.name} if config factory throws`, () => {
		const errStr = 'ooops'
		expect(() =>
			runSync(
				validateUserConfig(() => {
					throw errStr
				}),
			),
		).toThrowError(new ConfigFnThrowError({ cause: errStr }))
		const err = new Error(errStr)
		expect(() =>
			runSync(
				validateUserConfig(() => {
					throw err
				}),
			),
		).toThrowError(new ConfigFnThrowError({ cause: err }))
		const wierdError = {}
		expect(() =>
			runSync(
				validateUserConfig(() => {
					throw wierdError
				}),
			),
		).toThrowError(new ConfigFnThrowError({ cause: '' }))
	})
})
