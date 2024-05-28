import { esbuildPluginTevm } from '@tevm/esbuild-plugin'
import { createTsUpOptions } from '@tevm/tsupconfig'
import { defineConfig } from 'tsup'

const options = createTsUpOptions({
	entry: ['src/index.ts'],
})

export default defineConfig({
	...options,
	esbuildPlugins: [esbuildPluginTevm()],
})
