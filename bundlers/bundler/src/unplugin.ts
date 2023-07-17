import { bundler } from './bundler'
import { ResolvedConfig, loadConfig } from '@evmts/config'
import { createUnplugin, type UnpluginContext, type UnpluginBuildContext } from 'unplugin'
import { z } from 'zod'

const compilerOptionValidator = z
	.enum(['solc', 'foundry'])
	.default('solc')
	.describe('compiler to use.  Defaults to solc')

export type CompilerOption = z.infer<typeof compilerOptionValidator>

const bundlers = {
	solc: bundler,
}

// make a function with this signature
export function unpluginFn(
	this: UnpluginBuildContext & UnpluginContext,
	options: { compiler?: z.infer<typeof compilerOptionValidator> } = {},
) {
	const logger = {
		...console,
		warn: this.warn,
		error: this.error,
	}

	let config: ResolvedConfig

	// for current release we will hardcode this to solc
	const parsedCompilerOption = compilerOptionValidator.safeParse(
		options.compiler,
	)
	if (!parsedCompilerOption.success) {
		throw new Error(
			`Invalid compiler option: ${options.compiler}.  Valid options are 'solc' and 'foundry'`,
		)
	}
	const compilerOption = parsedCompilerOption.data

	if (compilerOption === 'foundry') {
		throw new Error(
			'We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time.',
		)
	}
	const bundler = bundlers[compilerOption]
	let moduleResolver: ReturnType<typeof bundler>


	return {
		name: '@evmts/rollup-plugin',
		version: '0.0.0',
		buildStart: async () => {
			config = loadConfig('.')
			moduleResolver = bundler(config, logger)
			this.addWatchFile('./tsconfig.json');
		},
		load(id: string) {
			if (id.startsWith('@evmts/core/runtime')) {

			}
			if (!id.endsWith('.sol')) {
				return
			}
			return moduleResolver.resolveEsmModule(id, process.cwd())
		},
	} as const
}

const evmtsUnplugin = createUnplugin(unpluginFn)

// Hacks to make types portable
// we should manually type these at some point

export const vitePluginEvmts = evmtsUnplugin.vite as typeof evmtsUnplugin.rollup
export const rollupPluginEvmts = evmtsUnplugin.rollup
export const esbuildPluginEvmts = evmtsUnplugin.esbuild
export const webpackPluginEvmts =
	evmtsUnplugin.webpack as typeof evmtsUnplugin.rspack

export const rspackPluginEvmts = evmtsUnplugin.rspack
