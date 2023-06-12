import { foundryModules } from '../foundry'
import { solcModules } from '../solc'
import { FoundryConfig } from '../types'
import { createUnplugin } from 'unplugin'
import { z } from 'zod'

const compilerOptionValidator = z
	.enum(['solc', 'foundry'])
	.default('solc')
	.describe('compiler to use.  Defaults to solc')

export type CompilerOption = z.infer<typeof compilerOptionValidator>
type UnpluginOptions = FoundryConfig & { compiler?: CompilerOption }

const pluginFactories = {
	solc: solcModules,
	foundry: foundryModules,
}

const foundryUnplugin = createUnplugin((options: UnpluginOptions = {}) => {
	const parsedCompiler = compilerOptionValidator.safeParse(options.compiler)
	if (!parsedCompiler.success) {
		throw new Error(
			`Invalid compiler option: ${parsedCompiler.error}.  Valid options are 'solc' and 'foundry'`,
		)
	}
	const pluginFoundry = pluginFactories[parsedCompiler.data](options, console)
	return {
		name: '@evmts/rollup',
		version: '0.0.0',
		load(id) {
			if (!id.endsWith('.sol')) {
				return
			}
			return pluginFoundry.resolveEsmModule(id, process.cwd())
		},
	}
})

// Hacks to make types portable
// we should manually type these at some point

export const viteFoundry = foundryUnplugin.vite as typeof rollupFoundry

export const rollupFoundry = foundryUnplugin.rollup

export const esbuildFoundry = foundryUnplugin.esbuild

export const webpackFoundry =
	foundryUnplugin.webpack as typeof rspackPluginFoundry

export const rspackPluginFoundry = foundryUnplugin.rspack
