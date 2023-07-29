import { rollupPluginEvmts } from '@evmts/bundler'
import * as packageJson from '@evmts/bundler/package.json'
import { describe, expect, it, vi } from 'vitest'

describe(rollupPluginEvmts.name, () => {
	it('should properly export the unplugin bundler from @evmts/bundler', async () => {
		const plugin = rollupPluginEvmts()
		expect(plugin.version).toBe(packageJson.version)
		expect(plugin.name).toBe("@evmts/rollup-plugin")
	})
})
