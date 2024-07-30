import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { createBunConfig } from './createBunConfig.js'

describe(createBunConfig.name, () => {
	test('should return a bun config object', async () => {
		const config = await createBunConfig()
		expect(readFileSync(config.bunfig, 'utf8')).toInclude(config.plugins)
		expect(readFileSync(config.plugins, 'utf8')).toBeDefined()
	})
})
