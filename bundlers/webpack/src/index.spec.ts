import { describe, expect, it } from 'vitest'
import { webpackPluginEvmts } from '.'

describe(webpackPluginEvmts.name, () => {
	it('should properly export the unplugin bundler from @evmts/bundler', async () => {
		const plugin = webpackPluginEvmts()
		expect(plugin).toMatchInlineSnapshot(`
			{
			  "apply": [Function],
			}
		`)
	})
})
