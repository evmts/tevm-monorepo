import { foundryModules } from '../foundry'
import { solcModules } from '../solc'
import { Config, loadConfig } from '@evmts/config'
import { createUnplugin } from 'unplugin'
import { z } from 'zod'

const compilerOptionValidator = z
	.enum(['solc', 'foundry'])
	.default('solc')
	.describe('compiler to use.  Defaults to solc')

export type CompilerOption = z.infer<typeof compilerOptionValidator>

const pluginFactories = {
	solc: solcModules,
	foundry: foundryModules,
}

const foundryUnplugin = createUnplugin(() => {
	let config: Config

	// for current release we will hardcode this to solc
	const parsedCompilerOption = compilerOptionValidator.safeParse('solc')
	if (!parsedCompilerOption.success) {
		throw new Error(
			`Invalid compiler option: ${parsedCompilerOption.error}.  Valid options are 'solc' and 'foundry'`,
		)
	}
	const compilerOption = parsedCompilerOption.data
	const compiler = pluginFactories[compilerOption]
	let moduleResolver: ReturnType<typeof compiler>

	return {
		name: '@evmts/rollup-plugin',
		version: '0.0.0',
		buildStart: async () => {
			config = await loadConfig('.')
			moduleResolver = compiler(config, console)
		},
		load(id) {
			if (!id.endsWith('.sol')) {
				return
			}
			return moduleResolver.resolveEsmModule(id, process.cwd())
		},
	}
})

// Hacks to make types portable
// we should manually type these at some point

export const viteFoundry = foundryUnplugin.vite

export const rollupFoundry = foundryUnplugin.rollup

export const esbuildFoundry = foundryUnplugin.esbuild

export const webpackFoundry =
	foundryUnplugin.webpack as typeof rspackPluginFoundry

export const rspackPluginFoundry = foundryUnplugin.rspack
