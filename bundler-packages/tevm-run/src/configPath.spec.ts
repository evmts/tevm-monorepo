import { expect, test } from 'bun:test'
import { join } from 'node:path'
import { configPath } from './configPath.js'

test('should return config path', () => {
	expect(configPath).toBe(join(__dirname, '..', 'bunfig.toml'))
})
