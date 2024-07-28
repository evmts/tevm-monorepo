import { expect, test } from 'bun:test'
import { configPath } from './configPath.js'
import { join } from 'path'

test('should return config path', () => {
	expect(configPath).toBe(join(__dirname, '..', 'bunfig.toml'))
})
