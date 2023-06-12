import { createConfig } from './config'
import { describe, expect, it } from 'vitest'

describe(createConfig.name, () => {
	it('should return a config', () => {
		const createOptions = {
			config: {
				name: '@evmts/ts',
				project: '../',
				out: 'out',
			},
		}
		expect(createConfig(createOptions as any)).toEqual(createOptions.config)
	})

	it('should default project to "."', () => {
		const createOptions = {
			config: {
				name: '@evmts/ts',
			},
		}
		expect(createConfig(createOptions as any)).toEqual({
			...createOptions.config,
			project: '.',
			out: 'out',
		})
	})

	it('should gracefully handle foundry.toml in path', () => {
		let createOptions = {
			config: {
				name: '@evmts/ts',
				project: './foundry.toml',
				out: 'out',
			},
		}
		expect(createConfig(createOptions as any)).toEqual({
			...createOptions.config,
			project: '.',
		})
		createOptions = {
			config: {
				name: '@evmts/ts',
				project: 'foundry.toml',
				out: 'out',
			},
		}
		expect(createConfig(createOptions as any)).toEqual({
			...createOptions.config,
			project: '.',
		})
	})

	it('should fail to parse invalid config', () => {
		const createOptions0 = {
			config: {
				name: '@evmts/ts',
				project: 1,
			},
		}
		const createOptions1 = {
			config: {
				name: 'ts-plugin',
			},
		}
		expect(() =>
			createConfig(createOptions0 as any),
		).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"code\\": \\"invalid_type\\",
          \\"expected\\": \\"string\\",
          \\"received\\": \\"number\\",
          \\"path\\": [
            \\"project\\"
          ],
          \\"message\\": \\"Expected string, received number\\"
        }
      ]"
    `)
		expect(() =>
			createConfig(createOptions1 as any),
		).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"received\\": \\"ts-plugin\\",
          \\"code\\": \\"invalid_literal\\",
          \\"expected\\": \\"@evmts/ts\\",
          \\"path\\": [
            \\"name\\"
          ],
          \\"message\\": \\"Invalid literal value, expected \\\\\\"@evmts/ts\\\\\\"\\"
        }
      ]"
    `)
	})
})
