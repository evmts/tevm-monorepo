import { createConfig } from './config'
import { describe, expect, it } from 'vitest'

describe(createConfig.name, () => {
	it('should return a config', () => {
		const createOptions = {
			config: {
				name: '@evmts/ts-plugin',
				project: '../',
				out: 'out',
			},
		}
		expect(createConfig(createOptions as any)).toMatchInlineSnapshot(`
			{
			  "name": "@evmts/ts-plugin",
			  "out": "out",
			  "project": "../",
			}
		`)
	})
})
